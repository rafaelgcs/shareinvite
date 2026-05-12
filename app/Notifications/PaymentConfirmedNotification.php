<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentConfirmedNotification extends Notification
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
            ->subject('Pagamento Confirmado: Seu evento está liberado!')
            ->greeting('Boas notícias!')
            ->line('O pagamento para o seu evento "' . $this->event->title . '" foi processado com sucesso.')
            ->line('Todas as funcionalidades premium agora estão liberadas para você.')
            ->action('Ver meu evento', url('/events/' . $this->event->id))
            ->line('Desejamos que seu evento seja um sucesso absoluto!');
    }
}
