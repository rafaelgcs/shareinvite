<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('primary_color')->default('#1c1917')->after('logo');
            $table->string('secondary_color')->default('#fafaf9')->after('primary_color');
            $table->string('animation_type')->default('envelope_3d')->after('secondary_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['primary_color', 'secondary_color', 'animation_type']);
        });
    }
};
