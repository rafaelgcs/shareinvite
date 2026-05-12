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

        $plan = $request->plan ?: 'premium';
        $prices = [
            'classic' => 4900, // R$ 49.00
            'premium' => 9900, // R$ 99.00
            'luxury' => 19900, // R$ 199.00
        ];

        $price = $prices[$plan] ?? 9900;

        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'allow_promotion_codes' => true,
            'line_items' => [[
                'price_data' => [
                    'currency' => 'brl',
                    'product_data' => [
                        'name' => "Plano " . ucfirst($plan) . " - " . $event->title,
                        'description' => "Ativação de convite digital premium.",
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
                'plan' => $plan,
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
            $event->update([
                'is_paid' => true,
                'status' => 'active'
            ]);
            return redirect()->route('dashboard')->with('success', 'Pagamento confirmado! Seu convite foi liberado (Modo de Teste).');
        }

        Stripe::setApiKey(config('services.stripe.secret'));
        
        try {
            $session = Session::retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                $event->update([
                    'is_paid' => true,
                    'status' => 'active'
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
                    $eventModel->update([
                        'is_paid' => true,
                        'status' => 'active'
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
