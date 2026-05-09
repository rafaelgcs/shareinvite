import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShieldAlert, CreditCard, MessageCircle } from 'lucide-react';

export default function UnpaidEvent({ event }) {
    return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 text-center">
            <Head title="Evento Pendente" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-stone-900 border border-white/10 p-12 rounded-[3rem] shadow-2xl"
            >
                <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                
                <h1 className="text-3xl font-serif text-white mb-4">{event.title}</h1>
                <p className="text-stone-400 font-light mb-8 leading-relaxed">
                    Este convite digital ainda não foi ativado pelo anfitrião. 
                    Por favor, entre em contato com os organizadores do evento.
                </p>
                
                <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 text-left">
                        <CreditCard className="w-5 h-5 text-stone-500" />
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">Status</p>
                            <p className="text-sm text-stone-400">Aguardando Pagamento</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                    <p className="text-[10px] text-stone-600 uppercase tracking-[0.2em] font-bold mb-4">Desenvolvido por</p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                            <span className="font-serif text-xs font-bold text-white italic">S</span>
                        </div>
                        <span className="font-serif text-sm tracking-tight text-white/50">ShareInvite</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
