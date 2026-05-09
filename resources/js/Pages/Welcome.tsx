import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, Star, ShieldCheck, Zap, Heart, Camera, MapPin, Calendar, ArrowRight, Menu, X, Users, MessageSquare } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Welcome({ canLogin, canRegister }: { canLogin: boolean, canRegister: boolean }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const features = [
        {
            icon: Heart,
            title: "Design de Alta Costura",
            desc: "Convites que parecem ter sido impressos em papel de luxo, com texturas e relevos digitais.",
            color: "bg-rose-500/10 text-rose-500"
        },
        {
            icon: Zap,
            title: "RSVP em Tempo Real",
            desc: "Seus convidados confirmam presença com um toque. Você acompanha tudo pelo celular.",
            color: "bg-amber-500/10 text-amber-500"
        },
        {
            icon: MapPin,
            title: "Logística Integrada",
            desc: "Mapas dinâmicos que guiam seus convidados até o local da cerimônia e da festa.",
            color: "bg-blue-500/10 text-blue-500"
        },
        {
            icon: Camera,
            title: "Feed Compartilhado",
            desc: "Um mural de fotos exclusivo onde seus convidados postam os melhores momentos.",
            color: "bg-purple-500/10 text-purple-500"
        },
        {
            icon: ShieldCheck,
            title: "Check-in Seguro",
            desc: "Valide a entrada dos seus convidados via QR Code com o nosso scanner nativo.",
            color: "bg-emerald-500/10 text-emerald-500"
        },
        {
            icon: MessageSquare,
            title: "Avisos Instantâneos",
            desc: "Notifique seus convidados sobre dress code, horários ou mudanças importantes.",
            color: "bg-stone-500/10 text-stone-500"
        }
    ];

    const plans = [
        {
            name: "Classic",
            price: "R$ 49",
            features: ["Até 50 convidados", "RSVP Básico", "Mapa do Local", "Suporte por E-mail"],
            recommended: false
        },
        {
            name: "Premium",
            price: "R$ 99",
            features: ["Até 200 convidados", "Feed do Evento", "Scanner de Entrada", "Múltiplos Locais", "Animações 3D"],
            recommended: true
        },
        {
            name: "Luxury",
            price: "R$ 199",
            features: ["Convidados Ilimitados", "Personalização Total", "Domínio Próprio", "Suporte VIP 24h", "Exportação de Dados"],
            recommended: false
        }
    ];

    return (
        <div ref={containerRef} className="bg-stone-950 text-stone-100 font-sans selection:bg-stone-700 selection:text-white min-h-screen overflow-x-hidden">
            <Head title="ShareInvite - A Nova Era dos Convites Digitais Premium" />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-stone-900/50 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
                            <span className="font-serif text-lg font-bold text-stone-950 italic">S</span>
                        </div>
                        <span className="font-serif text-xl tracking-tight text-white">ShareInvite</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className="text-stone-400 hover:text-white transition-colors">Funcionalidades</a>
                        <a href="#pricing" className="text-stone-400 hover:text-white transition-colors">Preços</a>
                        <a href="#how-it-works" className="text-stone-400 hover:text-white transition-colors">Como funciona</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {canLogin && (
                            <Link href={route('login')} className="text-sm font-medium text-stone-400 hover:text-white transition-colors">
                                Entrar
                            </Link>
                        )}
                        {canRegister && (
                            <Link 
                                href={route('register')} 
                                className="px-5 py-2.5 bg-white text-stone-950 rounded-full text-sm font-bold hover:bg-stone-200 transition-all shadow-lg transform hover:scale-105"
                            >
                                Criar Conta
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-stone-800/20 rounded-full filter blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-stone-700/10 rounded-full filter blur-[150px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-xs font-semibold tracking-widest text-stone-400 mb-8 uppercase">
                                <Star className="w-3 h-3 fill-stone-400" /> Papelaria Digital de Luxo
                            </span>
                            <h1 className="text-5xl md:text-7xl xl:text-8xl font-serif text-white leading-[0.95] mb-8">
                                O convite que o seu evento <span className="text-stone-500 italic">merece.</span>
                            </h1>
                            <p className="text-xl text-stone-400 font-light max-w-lg mb-10 leading-relaxed">
                                Transforme o primeiro contato dos seus convidados em uma experiência memorável. Design premium, RSVP automatizado e gestão total.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href={route('register')} className="px-10 py-5 bg-white text-stone-950 rounded-full text-lg font-bold hover:bg-stone-200 transition-all shadow-2xl flex items-center justify-center gap-2 group">
                                    Começar agora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="/demo/invitation" className="px-10 py-5 bg-stone-900 text-white rounded-full text-lg font-bold hover:bg-stone-800 border border-stone-800 transition-all flex items-center justify-center">
                                    Ver Demonstração
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative flex justify-center lg:justify-end"
                        >
                            <div className="relative w-[320px] sm:w-[400px] aspect-[9/19] bg-stone-900 rounded-[3rem] border-[8px] border-stone-800 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
                                <img 
                                    src="/assets/hero-mockup.png" 
                                    alt="Mockup Convite" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 to-transparent pointer-events-none" />
                            </div>
                            
                            {/* Floating labels */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -left-4 top-1/4 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl hidden md:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">RSVP</p>
                                        <p className="text-sm font-bold text-white">Confirmado!</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-8 bottom-1/4 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl hidden md:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-stone-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Localização</p>
                                        <p className="text-sm font-bold text-white">Google Maps</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-stone-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Tudo o que você precisa.</h2>
                        <p className="text-stone-400 text-lg font-light max-w-2xl mx-auto">
                            Desde o primeiro convite até o check-in na entrada, o ShareInvite cuida de cada detalhe com elegância e precisão.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-8 rounded-[2.5rem] bg-stone-900/50 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-2"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feature.color} transition-transform group-hover:scale-110`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-serif text-white mb-4">{feature.title}</h3>
                                <p className="text-stone-400 font-light leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works / Mobile Focus */}
            <section id="how-it-works" className="py-32 bg-white text-stone-950 rounded-[4rem]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative mx-auto w-[280px] sm:w-[350px] aspect-[9/19] bg-stone-950 rounded-[3rem] p-3 shadow-[0_50px_100px_rgba(0,0,0,0.2)]">
                                <div className="w-full h-full rounded-[2.5rem] bg-white overflow-hidden relative">
                                    <div className="p-8 text-center mt-10">
                                        <div className="w-12 h-12 bg-stone-100 rounded-full mx-auto mb-4" />
                                        <h4 className="font-serif text-2xl mb-2">Maria & João</h4>
                                        <p className="text-xs text-stone-400 uppercase tracking-widest mb-8">Confirmar Presença</p>
                                        
                                        <div className="space-y-4 text-left">
                                            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Convidado</p>
                                                <p className="text-sm font-bold">Rafael Garcia</p>
                                            </div>
                                            <div className="p-4 bg-stone-900 text-white rounded-2xl text-center font-bold text-sm">
                                                Confirmar Agora
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 to-transparent" />
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <h2 className="text-4xl md:text-6xl font-serif mb-8">Feito para ser compartilhado <span className="text-stone-400 italic">em segundos.</span></h2>
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center shrink-0">
                                        <span className="font-serif text-xl font-bold">1</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Crie o seu convite</h4>
                                        <p className="text-stone-500">Escolha o tema, as cores e adicione as informações do seu evento em poucos minutos.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center shrink-0">
                                        <span className="font-serif text-xl font-bold">2</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Envie via WhatsApp</h4>
                                        <p className="text-stone-500">Gere links individuais e envie para seus convidados com uma experiência de abertura incrível.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center shrink-0">
                                        <span className="font-serif text-xl font-bold">3</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Acompanhe tudo</h4>
                                        <p className="text-stone-500">Receba notificações de confirmação e veja quem já fez o check-in no dia do evento.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 bg-stone-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Planos para todos os momentos.</h2>
                        <p className="text-stone-400 text-lg font-light max-w-2xl mx-auto">
                            Seja para um jantar íntimo ou para o casamento dos seus sonhos, temos o plano perfeito.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, idx) => (
                            <div 
                                key={idx}
                                className={`p-10 rounded-[3rem] border transition-all ${
                                    plan.recommended 
                                    ? 'bg-white text-stone-950 border-white scale-105 z-10' 
                                    : 'bg-stone-900/50 text-white border-white/5'
                                }`}
                            >
                                <h4 className="text-xl font-bold mb-2 uppercase tracking-widest">{plan.name}</h4>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-serif font-bold">{plan.price}</span>
                                    <span className="text-sm opacity-60">/evento</span>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    {plan.features.map((feat, fidx) => (
                                        <li key={fidx} className="flex items-center gap-3 text-sm">
                                            <Check className={`w-5 h-5 ${plan.recommended ? 'text-stone-900' : 'text-stone-500'}`} />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <Link 
                                    href={route('register')}
                                    className={`w-full py-4 rounded-full text-center font-bold transition-all ${
                                        plan.recommended 
                                        ? 'bg-stone-950 text-white hover:bg-stone-800' 
                                        : 'bg-white text-stone-950 hover:bg-stone-200'
                                    }`}
                                >
                                    Escolher Plano
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-stone-800 to-stone-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-7xl font-serif text-white mb-8">Pronto para criar algo inesquecível?</h2>
                        <p className="text-xl text-stone-400 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                            Junte-se a milhares de anfitriões que transformaram seus eventos com o ShareInvite.
                        </p>
                        <Link href={route('register')} className="inline-flex items-center gap-3 px-12 py-6 bg-white text-stone-950 rounded-full text-xl font-bold hover:bg-stone-200 transition-all shadow-2xl transform hover:scale-105">
                            Começar agora gratuitamente <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-black text-center">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                <span className="font-serif text-lg font-bold text-white italic">S</span>
                            </div>
                            <span className="font-serif text-xl tracking-tight text-white">ShareInvite</span>
                        </div>
                        <div className="flex gap-8 text-sm text-stone-500">
                            <a href="#" className="hover:text-white transition-colors">Termos</a>
                            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                            <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        </div>
                    </div>
                    <p className="text-stone-600 text-xs uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} ShareInvite Luxury Digital Stationery.
                    </p>
                </div>
            </footer>
        </div>
    );
}
