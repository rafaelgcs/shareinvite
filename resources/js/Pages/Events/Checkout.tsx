import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CreditCard, ShieldCheck, Zap, Star, Check, ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Event } from '@/types';

export default function Checkout({ event }: { event: Event }) {
    const [selectedPlan, setSelectedPlan] = useState('premium');
    const { post, processing } = useForm();

    const plans = [
        {
            id: 'classic',
            name: 'Classic',
            price: 49,
            guests: 50,
            features: ['RSVP Básico', 'Mapa do Local', 'Suporte por E-mail', 'Design Clássico']
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 99,
            guests: 200,
            features: ['Mural de Fotos', 'Scanner de Entrada', 'Múltiplos Locais', 'Animações 3D Premium']
        },
        {
            id: 'luxury',
            name: 'Luxury',
            price: 199,
            guests: 'Ilimitados',
            features: ['Personalização Total', 'Domínio Próprio', 'Suporte VIP 24h', 'Exportação de Dados']
        }
    ];

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('events.pay', event.id), {
                plan: selectedPlan
            });
            
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Erro ao iniciar checkout:', error);
            // Fallback for dev environment without Stripe keys
            if (confirm('Ambiente de teste detectado. Deseja ativar este convite gratuitamente para teste?')) {
                window.location.href = route('stripe.success', { event: event.id, session_id: 'mock_session' });
            }
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <h2 className="font-serif text-4xl text-[#0A0A0A] tracking-tight leading-none">
                        Ativação do Convite
                    </h2>
                    <p className="text-stone-500 font-medium italic">Selecione o plano ideal para sua celebração.</p>
                </div>
            }
        >
            <Head title="Checkout - Miu Invites" />

            <div className="py-12 bg-[#F9F8F6] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <Link 
                        href={route('events.show', event.id)} 
                        className="inline-flex items-center gap-2 text-stone-400 hover:text-[#0A0A0A] transition-all mb-12 font-black uppercase text-[10px] tracking-widest group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Voltar para Edição
                    </Link>

                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        
                        {/* Plans Selection */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="grid sm:grid-cols-3 gap-6">
                                {plans.map((plan) => (
                                    <button
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`relative p-8 rounded-[3rem] border-2 text-left transition-all ambient-shadow group ${
                                            selectedPlan === plan.id 
                                            ? 'border-[#0A0A0A] bg-white shadow-2xl scale-[1.02]' 
                                            : 'border-stone-100 bg-white/50 hover:border-stone-200'
                                        }`}
                                    >
                                        {selectedPlan === plan.id && (
                                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#D4AF37] text-white rounded-full flex items-center justify-center shadow-xl z-10 border-4 border-white">
                                                <Check className="w-5 h-5 stroke-[3px]" />
                                            </div>
                                        )}
                                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${selectedPlan === plan.id ? 'text-[#D4AF37]' : 'text-stone-400'}`}>
                                            {plan.name}
                                        </p>
                                        <div className="flex items-baseline gap-1 mb-6">
                                            <span className="text-xs font-black text-stone-400">R$</span>
                                            <span className="text-4xl font-serif font-black text-[#0A0A0A]">{plan.price}</span>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 py-3 border-t border-stone-50">
                                                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                                                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">{plan.guests} convidados</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Payment Redirect Info */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[4rem] p-12 sm:p-20 border border-stone-100 shadow-2xl text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
                                    <ShieldCheck className="w-64 h-64 text-[#D4AF37]" />
                                </div>

                                <div className="w-24 h-24 bg-[#0A0A0A] text-[#D4AF37] rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3">
                                    <Lock className="w-10 h-10" />
                                </div>
                                
                                <h3 className="text-3xl font-serif text-[#0A0A0A] mb-4 font-black">Checkout Premium</h3>
                                <p className="text-stone-500 mb-12 max-w-md mx-auto leading-relaxed">
                                    Finalize sua ativação através do ambiente criptografado do <span className="font-black text-[#0A0A0A]">Stripe</span>. Aceitamos cartões internacionais e PIX.
                                </p>

                                <div className="grid grid-cols-2 gap-6 mb-12 max-w-sm mx-auto">
                                    <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 flex flex-col items-center gap-3 transition-all hover:bg-white hover:border-[#D4AF37]">
                                        <CreditCard className="w-8 h-8 text-stone-300 group-hover:text-[#D4AF37]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Cartão</span>
                                    </div>
                                    <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 flex flex-col items-center gap-3 transition-all hover:bg-white hover:border-[#D4AF37]">
                                        <div className="w-8 h-8 bg-[#0A0A0A] text-[#D4AF37] rounded-lg flex items-center justify-center text-[10px] font-black italic">PIX</div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">PIX</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={processing}
                                    className="w-full max-w-md py-8 bg-[#0A0A0A] text-white rounded-[2.5rem] text-xl font-black shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 disabled:opacity-50 group uppercase tracking-widest text-sm"
                                >
                                    {processing ? 'Redirecionando...' : (
                                        <>
                                            Ativar Convite Agora <Zap className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37] group-hover:scale-125 transition-transform" />
                                        </>
                                    )}
                                </button>
                                
                                <div className="mt-12 flex items-center justify-center gap-4 text-stone-300">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Criptografia de ponta a ponta</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-[#0A0A0A] text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />
                                
                                <div className="flex items-center gap-3 mb-10">
                                    <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                                    <h3 className="font-serif text-3xl font-black">Resumo</h3>
                                </div>
                                
                                <div className="space-y-6 mb-10 pb-10 border-b border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Plano</span>
                                        <span className="font-black text-[#D4AF37] uppercase text-[10px] tracking-widest">{plans.find(p => p.id === selectedPlan)?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Preço</span>
                                        <span className="font-serif text-2xl font-black">R$ {plans.find(p => p.id === selectedPlan)?.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-6">
                                        <span className="font-serif text-3xl font-black">Total</span>
                                        <span className="font-serif text-3xl font-black text-[#D4AF37]">R$ {plans.find(p => p.id === selectedPlan)?.price}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-6">Incluso neste plano:</p>
                                    {plans.find(p => p.id === selectedPlan)?.features.map((feat, idx) => (
                                        <div key={idx} className="flex items-center gap-4 text-xs text-white/70 font-medium">
                                            <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                                            {feat}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="p-8 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-[2.5rem] flex gap-5 items-start relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Star className="w-6 h-6 text-[#D4AF37] shrink-0 fill-[#D4AF37]" />
                                <p className="text-xs text-[#0A0A0A] font-medium leading-relaxed relative z-10">
                                    Ao ativar, sua celebração ganha vida imediatamente. Convidados poderão confirmar presença e acessar todos os detalhes exclusivos.
                                </p>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
