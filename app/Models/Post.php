<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'guest_name',
        'photo_url',
        'message',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
