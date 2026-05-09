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
        'theme',
        'event_date',
        'rsvp_enabled',
        'rsvp_deadline',
        'allow_extra_guests',
        'max_extra_guests',
        'status',
        'is_paid',
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'rsvp_deadline' => 'date',
        'rsvp_enabled' => 'boolean',
        'allow_extra_guests' => 'boolean',
        'max_extra_guests' => 'integer',
        'is_paid' => 'boolean',
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

    public function guides(): HasMany
    {
        return $this->hasMany(EventGuide::class);
    }
}
