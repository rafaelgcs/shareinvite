import { useState } from 'react';

interface RsvpFormProps {
    eventId: number;
}

export default function RsvpForm({ eventId }: RsvpFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [extraGuests, setExtraGuests] = useState(0);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch(`/api/events/${eventId}/rsvp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ name, email, extra_guests: extraGuests }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                setName('');
                setEmail('');
                setExtraGuests(0);
            } else {
                setStatus('error');
                setMessage(data.message || 'Ocorreu um erro ao confirmar.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Erro de conexão. Tente novamente mais tarde.');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-green-50 text-green-800 p-8 rounded-3xl text-center border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="font-serif text-2xl mb-2">Presença Confirmada!</h3>
                <p className="text-green-700">{message}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 max-w-xl mx-auto">
            <h3 className="font-serif text-3xl text-center text-stone-900 mb-8">Confirme sua presença</h3>
            
            {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                    {message}
                </div>
            )}

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Nome Completo</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all"
                        placeholder="Ex: João da Silva"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">E-mail (Opcional)</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all"
                        placeholder="Para receber lembretes"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Acompanhantes</label>
                    <select
                        value={extraGuests}
                        onChange={(e) => setExtraGuests(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all bg-white"
                    >
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num === 0 ? 'Nenhum' : `${num} acompanhante${num > 1 ? 's' : ''}`}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full mt-4 py-4 px-6 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? 'Confirmando...' : 'Confirmar Presença'}
                </button>
            </div>
        </form>
    );
}
