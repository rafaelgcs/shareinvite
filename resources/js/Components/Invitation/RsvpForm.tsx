import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { Download, Share2 } from 'lucide-react';
import DigitalTicket from './DigitalTicket';

interface RsvpFormProps {
    eventId: number;
    event?: {
        title: string;
        event_date: string;
        logo?: string | null;
        primary_color?: string;
    };
    allowExtraGuests?: boolean;
    maxExtraGuests?: number;
}

export default function RsvpForm({ eventId, event, allowExtraGuests = true, maxExtraGuests = 5 }: RsvpFormProps) {
    const ticketRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [extraGuests, setExtraGuests] = useState(0);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [guestData, setGuestData] = useState<any>(null);

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
                body: JSON.stringify({ name, email, phone, extra_guests: extraGuests }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                setGuestData(data.guest);
                setName('');
                setEmail('');
                setPhone('');
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

    const handleDownload = async () => {
        if (!ticketRef.current) return;
        
        try {
            const canvas = await html2canvas(ticketRef.current, {
                scale: 3, // Higher quality
                useCORS: true,
                backgroundColor: "#ffffff", // Explicitly set background
                logging: false,
                width: 320, // Match the ticket width
                onclone: (clonedDoc) => {
                    // Ensure the cloned element is visible and properly sized
                    const ticket = clonedDoc.querySelector('[data-ticket="invitation"]');
                    if (ticket instanceof HTMLElement) {
                        ticket.style.transform = 'none';
                        ticket.style.margin = '0';
                    }
                }
            });
            
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `convite-${guestData?.name?.toLowerCase().replace(/\s+/g, '-')}.png`;
            link.click();
        } catch (error) {
            console.error("Error generating invitation image:", error);
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center">
                <div className="bg-white p-8 rounded-3xl text-center border border-stone-100 shadow-2xl max-w-md mx-auto mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="font-serif text-3xl mb-2 text-stone-900">Presença Confirmada!</h3>
                    <p className="text-stone-500 mb-8">{message}</p>
                    
                    {/* Digital Ticket for Download */}
                    <div className="relative group cursor-pointer" onClick={handleDownload}>
                        <DigitalTicket 
                            ref={ticketRef}
                            guest={guestData}
                            event={event as any}
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-all rounded-[2rem] flex items-center justify-center pointer-events-none">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-all flex items-center gap-2 text-xs font-bold text-stone-900">
                                <Download className="w-3 h-3" />
                                Salvar Imagem
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-stone-400 mt-8">
                        Toque no convite acima para salvar a imagem. <br />
                        Ela será solicitada na entrada do evento.
                    </p>
                </div>

                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-full font-bold shadow-xl hover:bg-stone-800 transition-all hover:scale-105 active:scale-95"
                >
                    <Download className="w-5 h-5" />
                    Baixar Convite Individual
                </button>
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
                    <label className="block text-sm font-medium text-stone-700 mb-1">WhatsApp (Opcional)</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all"
                        placeholder="(00) 00000-0000"
                    />
                </div>

                {allowExtraGuests && (
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Acompanhantes</label>
                        <select
                            value={extraGuests}
                            onChange={(e) => setExtraGuests(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all bg-white"
                        >
                            {Array.from({ length: maxExtraGuests + 1 }, (_, i) => i).map((num) => (
                                <option key={num} value={num}>
                                    {num === 0 ? 'Nenhum' : `${num} acompanhante${num > 1 ? 's' : ''}`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

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
