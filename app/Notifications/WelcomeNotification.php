<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Bem-vindo ao Miu Invites!')
            ->greeting('Olá, ' . $notifiable->name . '!')
            ->line('Sua conta foi criada com sucesso na nossa plataforma de convites digitais de luxo.')
            ->line('Agora você pode começar a criar eventos inesquecíveis.')
            ->action('Criar meu primeiro evento', url('/dashboard'))
            ->line('Obrigado por escolher o Miu Invites!');
    }
}
