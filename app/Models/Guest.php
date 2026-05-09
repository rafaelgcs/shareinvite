<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'uuid',
        'name',
        'email',
        'phone',
        'extra_guests',
        'confirmed_at',
        'checked_in_at',
    ];

    protected $casts = [
        'confirmed_at' => 'datetime',
        'checked_in_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($guest) {
            if (!$guest->uuid) {
                $guest->uuid = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
