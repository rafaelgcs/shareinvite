<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventCreatedNotification extends Notification
{
    use Queueable;

    protected $event;

    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Seu evento foi criado!')
            ->greeting('Parabéns!')
            ->line('Você acabou de criar o evento "' . $this->event->title . '".')
            ->line('Estamos aguardando a confirmação do pagamento para liberar todas as ferramentas de personalização e gestão.')
            ->action('Realizar Pagamento', url('/events/' . $this->event->id . '/checkout'))
            ->line('Qualquer dúvida, estamos à disposição.');
    }
}
