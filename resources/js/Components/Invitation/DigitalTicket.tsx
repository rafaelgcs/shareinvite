import { useRef, forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface DigitalTicketProps {
    guest: {
        name: string;
        uuid: string;
        extra_guests: number;
    };
    event: {
        title: string;
        event_date: string;
        logo?: string | null;
    };
}

const DigitalTicket = forwardRef<HTMLDivElement, DigitalTicketProps>(({ guest, event }, ref) => {
    return (
        <div 
            ref={ref}
            data-ticket="invitation"
            className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-stone-200 w-[320px] mx-auto text-left relative"
            style={{ backgroundColor: '#ffffff' }}
        >
            {/* Ticket Punch Effect */}
            <div className="absolute left-0 top-[150px] -translate-x-1/2 w-8 h-8 bg-white border border-stone-200 rounded-full z-20 shadow-inner" />
            <div className="absolute right-0 top-[150px] translate-x-1/2 w-8 h-8 bg-white border border-stone-200 rounded-full z-20 shadow-inner" />

            <div className="p-6 bg-stone-900 text-white text-center pb-12">
                {event?.logo ? (
                    <img src={event.logo} className="w-12 h-12 mx-auto mb-4 object-contain brightness-0 invert" alt="Logo" />
                ) : (
                    <div className="w-10 h-10 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center font-serif text-xl italic text-white">
                        {event?.title?.[0] || 'S'}
                    </div>
                )}
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1 font-bold">Convite Individual</p>
                <h4 className="font-serif text-xl leading-tight px-6 break-words text-white">
                    {event?.title}
                </h4>
            </div>

            <div className="px-8 -mt-6 relative z-10">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-stone-100 flex justify-center">
                    <QRCodeSVG 
                        value={`${window.location.origin}/g/${guest?.uuid}`} 
                        size={180}
                        level="H"
                        includeMargin={true}
                    />
                </div>
            </div>

            <div className="p-8 pt-6 space-y-6">
                <div>
                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1">Convidado</p>
                    <p className="text-lg font-serif text-stone-900 leading-tight break-words">{guest?.name}</p>
                    {guest?.extra_guests > 0 && (
                        <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider font-medium">
                            + {guest.extra_guests} acompanhante{guest.extra_guests > 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                <div className="pt-6 border-t border-dashed border-stone-200 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1">Data</p>
                        <p className="text-xs font-bold text-stone-800">
                            {event?.event_date ? new Date(event.event_date).toLocaleDateString('pt-BR') : '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1">Entrada</p>
                        <p className="text-xs font-bold text-stone-800">Código Único</p>
                    </div>
                </div>
                
                <div className="pt-4 text-center">
                    <p className="text-[8px] text-stone-300 uppercase tracking-widest font-bold">
                        SHAREINVITE • LUXURY DIGITAL CARDS
                    </p>
                </div>
            </div>
        </div>
    );
});

DigitalTicket.displayName = 'DigitalTicket';

export default DigitalTicket;
