<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicInvitationController extends Controller
{
    public function show($slug)
    {
        $event = Event::where('slug', $slug)
            ->with(['locations', 'notices'])
            ->firstOrFail();

        if (!$event->hasAccess()) {
            return Inertia::render('Public/UnpaidEvent', [
                'event' => [
                    'title' => $event->title,
                    'is_expired' => $event->is_paid && !$event->hasAccess(),
                ]
            ]);
        }

        $guest = null;
        if (session('guest_id')) {
            $guest = Guest::find(session('guest_id'));
        }

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
                'slug' => $event->slug,
                'can_access_mural' => $event->canAccessFeature('mural'),
            ],
            'locations' => $event->locations,
            'notices' => $event->notices,
            'guides' => $event->guides,
            'guest' => $guest ? [
                'id' => $guest->id,
                'name' => $guest->name,
                'confirmed_at' => $guest->confirmed_at,
            ] : null,
        ]);
    }

    public function guestLogin($uuid)
    {
        $guest = Guest::where('uuid', $uuid)->with('event')->firstOrFail();
        
        // Store guest info in session
        session(['guest_id' => $guest->id, 'guest_name' => $guest->name]);

        return redirect()->route('invitation.show', $guest->event->slug);
    }

    public function feed($slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();

        if (!$event->hasAccess()) {
            return redirect()->route('invitation.show', $slug);
        }

        if (!$event->canAccessFeature('mural')) {
            return redirect()->route('invitation.show', $slug);
        }
        $posts = $event->posts()
            ->with(['comments', 'likes'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->get()
            ->map(function ($post) {
                $post->is_liked = session('guest_id') ? $post->likes->where('guest_id', session('guest_id'))->isNotEmpty() : false;
                return $post;
            });

        return Inertia::render('Public/Feed', [
            'event' => $event,
            'posts' => $posts,
            'guest' => session('guest_id') ? [
                'id' => session('guest_id'),
                'name' => session('guest_name'),
            ] : null,
        ]);
    }
}
