<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     * (We will use this for the Dashboard)
     */
    public function index(Request $request)
    {
        $events = $request->user()->events()->withCount('guests')->with('plan')->latest()->get()->map(function ($event) {
            // Mocking limit logic for MVP if no plan exists
            $limit = $event->plan ? $event->plan->guest_limit : 50; 
            return [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->event_date->format('Y-m-d'),
                'status' => $event->status,
                'guests' => $event->guests_count,
                'limit' => $limit,
                'is_paid' => $event->is_paid,
                'is_expired' => $event->is_paid && !$event->hasAccess(),
            ];
        });

        return Inertia::render('Dashboard', [
            'events' => $events,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Events/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'event_date' => 'required|date',
            'slug' => 'required|string|max:255|unique:events,slug',
        ]);

        $event = $request->user()->events()->create([
            'title' => $validated['title'],
            'event_date' => $validated['event_date'],
            'slug' => \Illuminate\Support\Str::slug($validated['slug']),
            'status' => 'draft',
        ]);

        $request->user()->notify(new \App\Notifications\EventCreatedNotification($event));

        return redirect()->route('events.show', $event)->with('success', 'Convite criado! Agora configure os detalhes.');
    }

    /**
     * Display the specified resource (Management Dashboard).
     */
    public function show(Event $event)
    {
        // Ensure user owns the event
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        $event->load(['locations', 'notices', 'guests', 'guides']);

        return Inertia::render('Events/Show', [
            'event' => $event,
        ]);
    }

    /**
     * Update the design settings of the event.
     */
    public function updateDesign(Request $request, Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        if (!$event->canBeEdited()) {
            return back()->with('error', 'Este evento não pode mais ser editado (limite de 2 dias após o evento).');
        }

        $validated = $request->validate([
            'primary_color' => 'required|string|max:20',
            'secondary_color' => 'required|string|max:20',
            'text_color' => 'nullable|string|max:20',
            'background_color' => 'nullable|string|max:20',
            'animation_type' => 'required|string|in:envelope_3d,fade_in,gate_fold,slipcase,wax_seal',
            'theme' => 'required|string|in:classic,modern,floral,dark,vintage',
            'rsvp_enabled' => 'required|boolean',
            'rsvp_deadline' => 'nullable|date',
            'allow_extra_guests' => 'required|boolean',
            'max_extra_guests' => 'required|integer|min:0|max:10',
            'cover_image' => 'nullable|image|max:15360', // 15MB max (will be compressed)
            'logo' => 'nullable|image|max:15360', // 15MB max (will be compressed)
        ]);

        $updateData = $validated;
        unset($updateData['cover_image']);
        unset($updateData['logo']);

        $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());

        if ($request->hasFile('cover_image')) {
            $image = $manager->decodePath($request->file('cover_image')->getRealPath());
            $image->scaleDown(width: 1080); // resize down to max 1080px width
            $filename = 'events/cover_' . uniqid() . '.webp';
            $image->save(storage_path('app/public/' . $filename), 80);
            $updateData['cover_image'] = '/storage/' . $filename;
        }

        if ($request->hasFile('logo')) {
            $image = $manager->decodePath($request->file('logo')->getRealPath());
            $image->scaleDown(width: 600); // resize down to max 600px width
            $filename = 'events/logo_' . uniqid() . '.webp';
            $image->save(storage_path('app/public/' . $filename), 80);
            $updateData['logo'] = '/storage/' . $filename;
        }

        $event->update($updateData);

        return back()->with('success', 'Design atualizado com sucesso!');
    }

    public function checkIn(Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Events/CheckIn', [
            'event' => $event,
        ]);
    }

    public function exportGuests(Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        $guests = $event->guests()->latest()->get();
        
        $filename = "lista-presenca-" . Str::slug($event->title) . "-" . now()->format('Y-m-d') . ".csv";
        
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($guests) {
            $file = fopen('php://output', 'w');
            // UTF-8 BOM for Excel compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            fputcsv($file, ['Nome', 'Email', 'Telefone', 'Acompanhantes', 'Data Confirmação', 'Status Entrada', 'Hora Entrada']);

            foreach ($guests as $guest) {
                fputcsv($file, [
                    $guest->name,
                    $guest->email,
                    $guest->phone,
                    $guest->extra_guests,
                    $guest->confirmed_at ? $guest->confirmed_at->format('d/m/Y H:i') : '-',
                    $guest->checked_in_at ? 'Presente' : 'Aguardando',
                    $guest->checked_in_at ? $guest->checked_in_at->format('H:i') : '-'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function checkout(Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Events/Checkout', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        if (!$event->canBeEdited()) {
            return back()->with('error', 'Este evento não pode mais ser editado (limite de 2 dias após o evento).');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:events,slug,' . $event->id,
            'event_date' => 'required|date',
        ]);

        $event->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['slug']),
            'event_date' => $validated['event_date'],
        ]);

        return back()->with('success', 'Informações atualizadas!');
    }

    public function pay(Event $event)
    {
        if ($event->user_id !== auth()->id()) {
            abort(403);
        }

        $event->update([
            'is_paid' => true,
            'status' => 'active'
        ]);

        return redirect()->route('dashboard')->with('success', 'Evento liberado com sucesso!');
    }
}
