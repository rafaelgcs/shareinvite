<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordChangedNotification extends Notification
{
    use Queueable;

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Sua senha foi alterada')
            ->greeting('Olá!')
            ->line('Estamos enviando este e-mail para confirmar que a senha da sua conta Miu Invites foi alterada com sucesso.')
            ->line('Se você não realizou esta alteração, por favor entre em contato conosco imediatamente.')
            ->action('Acessar minha conta', url('/login'))
            ->line('Segurança é nossa prioridade.');
    }
}
