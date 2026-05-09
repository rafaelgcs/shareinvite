<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventGuide extends Model
{
    protected $fillable = ['event_id', 'title', 'content', 'type', 'image_url', 'file_path'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
