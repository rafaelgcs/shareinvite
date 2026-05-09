<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'guest_limit',
        'duration_months',
        'price',
    ];

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
