import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CreditCard, ShieldCheck, Zap, Star, Check, ArrowLeft, Lock } from 'lucide-react';
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
            features: ['RSVP Básico', 'Mapa do Local', 'Suporte por E-mail']
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 99,
            guests: 200,
            features: ['Mural de Fotos', 'Scanner de Entrada', 'Múltiplos Locais', 'Animações 3D']
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
            alert('Erro ao processar o pagamento. Tente novamente.');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Checkout - Liberar Convite" />

            <div className="py-12 bg-stone-50 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <Link 
                        href={route('dashboard')} 
                        className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Painel
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        
                        {/* Plans Selection */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="font-serif text-3xl text-stone-900 mb-2">Escolha o seu plano</h2>
                                <p className="text-stone-500">Selecione a melhor opção para o seu evento: <span className="font-bold text-stone-900">{event.title}</span></p>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4">
                                {plans.map((plan) => (
                                    <button
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`relative p-6 rounded-[2rem] border-2 text-left transition-all ${
                                            selectedPlan === plan.id 
                                            ? 'border-stone-900 bg-white shadow-xl scale-105' 
                                            : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                                        }`}
                                    >
                                        {selectedPlan === plan.id && (
                                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-lg">
                                                <Check className="w-5 h-5" />
                                            </div>
                                        )}
                                        <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">{plan.name}</p>
                                        <p className="text-2xl font-serif font-bold text-stone-900 mb-4">R$ {plan.price}</p>
                                        <ul className="space-y-2">
                                            <li className="text-[10px] text-stone-600 flex items-center gap-1">
                                                <Check className="w-3 h-3" /> {plan.guests} convidados
                                            </li>
                                        </ul>
                                    </button>
                                ))}
                            </div>

                            {/* Payment Redirect Info */}
                            <div className="bg-white rounded-[3rem] p-10 border border-stone-100 shadow-xl text-center">
                                <div className="w-20 h-20 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                    <Lock className="w-10 h-10" />
                                </div>
                                
                                <h3 className="text-2xl font-serif text-stone-900 mb-4">Pagamento Seguro via Stripe</h3>
                                <p className="text-stone-500 mb-8 max-w-sm mx-auto leading-relaxed">
                                    Você será redirecionado para o ambiente seguro do Stripe para concluir o pagamento via <span className="font-bold text-stone-900">Cartão de Crédito</span> ou <span className="font-bold text-stone-900">PIX</span>.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col items-center gap-2">
                                        <CreditCard className="w-6 h-6 text-stone-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Cartão</span>
                                    </div>
                                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 bg-stone-900 text-white rounded flex items-center justify-center text-[8px] font-bold">PIX</div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">PIX</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={processing}
                                    className="w-full py-6 bg-stone-900 text-white rounded-full text-xl font-bold shadow-2xl hover:bg-stone-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                                >
                                    {processing ? 'Redirecionando...' : (
                                        <>
                                            Ir para Pagamento <Zap className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" />
                                        </>
                                    )}
                                </button>
                                
                                <div className="mt-8 flex items-center justify-center gap-4 text-stone-300">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Ambiente 100% Seguro</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-6">
                            <div className="bg-stone-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-2xl -translate-y-1/2 translate-x-1/2" />
                                
                                <h3 className="font-serif text-2xl mb-8">Resumo do Pedido</h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/60">Plano {plans.find(p => p.id === selectedPlan)?.name}</span>
                                        <span className="font-bold">R$ {plans.find(p => p.id === selectedPlan)?.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/60">Taxa de serviço</span>
                                        <span className="font-bold">R$ 0,00</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xl">
                                        <span className="font-serif">Total</span>
                                        <span className="font-bold">R$ {plans.find(p => p.id === selectedPlan)?.price}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4">O que está incluído:</p>
                                    {plans.find(p => p.id === selectedPlan)?.features.map((feat, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-xs text-white/80">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                                            {feat}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex gap-4 items-start">
                                <Star className="w-5 h-5 text-amber-500 shrink-0" />
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    Ao liberar este convite, você terá acesso imediato a todas as funcionalidades do plano selecionado.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
