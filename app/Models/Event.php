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

    public function canBeEdited(): bool
    {
        // 2 days after the event, it is no longer possible to alter the information.
        return now()->lte($this->event_date->addDays(2));
    }

    public function hasAccess(): bool
    {
        // Must be paid and within 3 months after the event date
        if (!$this->is_paid) {
            return false;
        }

        return now()->lte($this->event_date->addMonths(3));
    }
}
