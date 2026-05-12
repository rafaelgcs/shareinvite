<?php
 
namespace App\Http\Controllers;
 
use App\Models\Event;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
 
class StripeController extends Controller
{
    public function createSession(Request $request, Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        $planModel = \App\Models\Plan::where('slug', $request->plan)->first();
        
        if (!$planModel) {
            $planModel = \App\Models\Plan::where('slug', 'premium')->first();
        }

        $newPrice = $planModel->price;
        $currentPrice = $event->is_paid && $event->plan ? $event->plan->price : 0;
        
        $priceToPay = $newPrice - $currentPrice;

        if ($priceToPay <= 0) {
            return response()->json([
                'message' => 'Você já possui este plano ou um plano superior.'
            ], 422);
        }

        $price = (int)($priceToPay * 100);

        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'allow_promotion_codes' => true,
            'line_items' => [[
                'price_data' => [
                    'currency' => 'brl',
                    'product_data' => [
                        'name' => ($currentPrice > 0 ? "Upgrade para " : "Plano ") . ($planModel->name ?? 'Premium') . " - " . $event->title,
                        'description' => $currentPrice > 0 
                            ? "Upgrade de plano com desconto do valor já pago."
                            : "Ativação de convite digital premium.",
                    ],
                    'unit_amount' => $price,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('stripe.success', ['event' => $event->id]) . '?sid={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('events.checkout', $event->id),
            'metadata' => [
                'event_id' => $event->id,
                'plan_slug' => $planModel->slug,
            ],
        ]);

        return response()->json(['url' => $session->url]);
    }

    public function success(Request $request, Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        $sessionId = $request->get('sid');

        if (!$sessionId) {
            return redirect()->route('dashboard')->with('error', 'Sessão de pagamento inválida.');
        }

        // Mock payment for development/demo
        if ($sessionId === 'mock_session') {
            $planSlug = $request->get('plan');
            $planModel = \App\Models\Plan::where('slug', $planSlug)->first();

            $event->update([
                'is_paid' => true,
                'status' => 'active',
                'plan_id' => $planModel?->id,
            ]);
            return redirect()->route('dashboard')->with('success', 'Pagamento confirmado! Seu convite foi liberado (Modo de Teste).');
        }

        Stripe::setApiKey(config('services.stripe.secret'));
        
        try {
            $session = Session::retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                $planSlug = $session->metadata->plan_slug ?? 'premium';
                $planModel = \App\Models\Plan::where('slug', $planSlug)->first();

                $event->update([
                    'is_paid' => true,
                    'status' => 'active',
                    'plan_id' => $planModel?->id,
                ]);

                return redirect()->route('dashboard')->with('success', 'Pagamento confirmado! Seu convite foi liberado.');
            }
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('error', 'Erro ao verificar pagamento: ' . $e->getMessage());
        }

        return redirect()->route('dashboard')->with('error', 'O pagamento não foi concluído.');
    }

    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sigHeader, $endpointSecret
            );
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Handle the event
        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $eventId = $session->metadata->event_id ?? null;

            if ($eventId) {
                $eventModel = Event::find($eventId);
                if ($eventModel) {
                    $planSlug = $session->metadata->plan_slug ?? 'premium';
                    $planModel = \App\Models\Plan::where('slug', $planSlug)->first();

                    $eventModel->update([
                        'is_paid' => true,
                        'status' => 'active',
                        'plan_id' => $planModel?->id,
                    ]);

                    if ($eventModel->user) {
                        $eventModel->user->notify(new \App\Notifications\PaymentConfirmedNotification($eventModel));
                    }
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}
