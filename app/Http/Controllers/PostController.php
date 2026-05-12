<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'guest_name' => 'required|string',
            'message' => 'required|string',
            'photo' => 'nullable|image|max:5120', // 5MB max
        ]);

        $photoUrl = null;
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('posts', 'public');
            $photoUrl = Storage::url($path);
        }

        Post::create([
            'event_id' => $request->event_id,
            'guest_name' => $request->guest_name,
            'message' => $request->message,
            'photo_url' => $photoUrl,
        ]);

        return back();
    }

    public function toggleLike(Post $post)
    {
        if (!session('guest_id')) {
            return back();
        }

        $like = $post->likes()->where('guest_id', session('guest_id'))->first();

        if ($like) {
            $like->delete();
        } else {
            $post->likes()->create([
                'guest_id' => session('guest_id'),
            ]);
        }

        return back();
    }

    public function storeComment(Request $request, Post $post)
    {
        if (!session('guest_id')) {
            return back();
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $post->comments()->create([
            'guest_id' => session('guest_id'),
            'guest_name' => session('guest_name'),
            'content' => $request->content,
        ]);

        return back();
    }
}
