<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;

class PublicInvitationController extends Controller
{
    public function show($slug)
    {
        $event = Event::where('slug', $slug)
            ->with(['locations', 'notices'])
            ->firstOrFail();

        return Inertia::render('Public/InvitationView', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'cover_image' => $event->cover_image,
                'logo' => $event->logo,
                'event_date' => $event->event_date,
                'primary_color' => $event->primary_color,
                'secondary_color' => $event->secondary_color,
                'text_color' => $event->text_color,
                'background_color' => $event->background_color,
                'animation_type' => $event->animation_type,
                'theme' => $event->theme,
                'rsvp_enabled' => $event->rsvp_enabled,
                'rsvp_deadline' => $event->rsvp_deadline ? $event->rsvp_deadline->format('Y-m-d') : null,
                'allow_extra_guests' => $event->allow_extra_guests,
                'max_extra_guests' => $event->max_extra_guests,
            ],
            'locations' => $event->locations,
            'notices' => $event->notices,
            'guides' => $event->guides,
        ]);
    }
}
