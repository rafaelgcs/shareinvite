<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_id',
        'slug',
        'title',
        'cover_image',
        'logo',
        'primary_color',
        'secondary_color',
        'text_color',
        'background_color',
        'animation_type',
        'event_date',
        'status',
    ];

    protected $casts = [
        'event_date' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(EventLocation::class);
    }

    public function notices(): HasMany
    {
        return $this->hasMany(EventNotice::class);
    }

    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class);
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
