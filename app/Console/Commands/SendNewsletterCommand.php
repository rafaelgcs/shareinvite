<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\MarketingNewsletterNotification;
use Illuminate\Console\Command;

class SendNewsletterCommand extends Command
{
    protected $signature = 'miu:send-newsletter {subject} {title} {message} {--action-text=} {--action-url=}';
    protected $description = 'Send a marketing newsletter to all users';

    public function handle()
    {
        $subject = $this->argument('subject');
        $title = $this->argument('title');
        $message = $this->argument('message');
        $actionText = $this->option('action-text');
        $actionUrl = $this->option('action-url');

        $users = User::all();
        $count = $users->count();

        if ($this->confirm("Você está prestes a enviar este e-mail para {$count} usuários. Continuar?")) {
            $this->withProgressBar($users, function ($user) use ($subject, $title, $message, $actionText, $actionUrl) {
                $user->notify(new MarketingNewsletterNotification($subject, $title, $message, $actionText, $actionUrl));
            });

            $this->newLine();
            $this->info('Newsletter enviada com sucesso!');
        }
    }
}
