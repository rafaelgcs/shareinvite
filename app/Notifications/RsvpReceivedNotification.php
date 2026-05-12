<?php

namespace App\Notifications;

use App\Models\Event;
use App\Models\Guest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RsvpReceivedNotification extends Notification
{
    use Queueable;

    protected $event;
    protected $guest;

    public function __construct(Event $event, Guest $guest)
    {
        $this->event = $event;
        $this->guest = $guest;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nova confirmação de presença: ' . $this->guest->name)
            ->greeting('Olá, anfitrião!')
            ->line('Um novo convidado acabou de confirmar presença no seu evento "' . $this->event->title . '".')
            ->line('Nome do convidado: ' . $this->guest->name)
            ->action('Ver lista de convidados', url('/dashboard'))
            ->line('Continue acompanhando suas confirmações pelo painel.');
    }
}
