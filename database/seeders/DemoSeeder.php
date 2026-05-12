<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventGuide;
use App\Models\EventLocation;
use App\Models\EventNotice;
use App\Models\Guest;
use App\Models\Plan;
use App\Models\Post;
use App\Models\PostComment;
use App\Models\PostLike;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Plans
        $premiumPlan = Plan::updateOrCreate(['name' => 'Premium'], [
            'guest_limit' => 200,
            'duration_months' => 3,
            'price' => 99.00,
        ]);

        Plan::updateOrCreate(['name' => 'Classic'], [
            'guest_limit' => 50,
            'duration_months' => 3,
            'price' => 49.00,
        ]);

        Plan::updateOrCreate(['name' => 'Luxury'], [
            'guest_limit' => 9999,
            'duration_months' => 12,
            'price' => 199.00,
        ]);

        // 2. Create Test User
        $user = User::firstOrCreate(['email' => 'admin@miuinvites.com'], [
            'name' => 'Miu Admin',
            'password' => bcrypt('password'),
        ]);

        // 3. Create Demo Event
        $event = Event::updateOrCreate(['slug' => 'demo'], [
            'user_id' => $user->id,
            'plan_id' => $premiumPlan->id,
            'title' => 'Casamento de Isabella & Gabriel',
            'cover_image' => 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069',
            'logo' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070',
            'event_date' => now()->addMonths(1),
            'status' => 'active',
            'is_paid' => true,
            'primary_color' => '#D4AF37',
            'secondary_color' => '#1A1A1A',
            'text_color' => '#FFFFFF',
            'background_color' => '#0A0A0A',
            'animation_type' => 'physical',
            'theme' => 'noir',
            'rsvp_enabled' => true,
            'rsvp_deadline' => now()->addWeeks(2),
            'allow_extra_guests' => true,
            'max_extra_guests' => 2,
        ]);

        // 4. Add Locations
        EventLocation::updateOrCreate(['event_id' => $event->id, 'name' => 'Cerimônia'], [
            'address' => 'Catedral Metropolitana, Centro, Rio de Janeiro',
            'notes' => 'Horário: 19:00',
        ]);

        EventLocation::updateOrCreate(['event_id' => $event->id, 'name' => 'Recepção'], [
            'address' => 'Copacabana Palace, Av. Atlântica, 1702',
            'notes' => 'Horário: 21:00',
        ]);

        // 5. Add Notices
        EventNotice::updateOrCreate(['event_id' => $event->id, 'message' => 'Dress Code: Traje Gala (Smoking para homens e vestido longo para mulheres).'], [
            'priority' => 'high',
        ]);

        EventNotice::updateOrCreate(['event_id' => $event->id, 'message' => 'Haverá serviço de valet no local da recepção.'], [
            'priority' => 'normal',
        ]);

        // 6. Add Guides
        EventGuide::updateOrCreate(['event_id' => $event->id, 'title' => 'Lista de Presentes'], [
            'content' => 'Nossa lista de presentes está disponível no site da Fast Shop e iCasei sob o nome Isabella & Gabriel.',
            'type' => 'gift_list'
        ]);

        // 7. Add Guests
        $guest1 = Guest::updateOrCreate(['event_id' => $event->id, 'name' => 'Convidado Demo'], [
            'uuid' => 'demo-guest-123',
            'phone' => '21999999999',
            'confirmed_at' => now(),
        ]);

        $guest2 = Guest::updateOrCreate(['event_id' => $event->id, 'name' => 'Ana Silva'], [
            'uuid' => (string) Str::uuid(),
            'phone' => '21888888888',
            'confirmed_at' => now(),
        ]);

        // 8. Add Posts
        $post1 = Post::create([
            'event_id' => $event->id,
            'guest_name' => 'Ana Silva',
            'message' => 'Que felicidade participar desse momento com vocês! ❤️',
            'photo_url' => 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2070',
        ]);

        $post2 = Post::create([
            'event_id' => $event->id,
            'guest_name' => 'Pedro Santos',
            'message' => 'Contando os dias para essa festa incrível!',
            'photo_url' => 'https://images.unsplash.com/photo-1465495910483-0d674b10404c?auto=format&fit=crop&q=80&w=2070',
        ]);

        // 9. Add Likes and Comments
        PostLike::create(['post_id' => $post1->id, 'guest_id' => $guest1->id]);
        PostLike::create(['post_id' => $post2->id, 'guest_id' => $guest1->id]);

        PostComment::create([
            'post_id' => $post1->id,
            'guest_id' => $guest1->id,
            'guest_name' => 'Rafael Garcia',
            'content' => 'Com certeza será inesquecível!',
        ]);
    }
}
