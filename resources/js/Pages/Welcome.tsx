import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Welcome({ canLogin, canRegister }: { canLogin: boolean, canRegister: boolean }) {
    return (
        <>
            <Head title="ShareInvite - Convites Digitais Premium" />
            <div className="bg-stone-900 min-h-screen text-stone-100 font-sans selection:bg-stone-700 selection:text-white">
                
                {/* Navbar */}
                <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-xl">
                            <span className="font-serif text-xl font-bold text-white">S</span>
                        </div>
                        <span className="font-serif text-2xl tracking-wide text-white">ShareInvite</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium">
                        {canLogin && (
                            <>
                                <Link href={route('login')} className="hover:text-stone-300 transition-colors">
                                    Entrar
                                </Link>
                                {canRegister && (
                                    <Link 
                                        href={route('register')} 
                                        className="px-5 py-2.5 bg-white text-stone-900 rounded-full hover:bg-stone-200 transition-colors shadow-lg"
                                    >
                                        Criar Conta
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
                    {/* Background decorations */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stone-700 rounded-full mix-blend-screen filter blur-[128px] opacity-30" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-stone-800 rounded-full mix-blend-screen filter blur-[128px] opacity-40" />
                    
                    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-stone-800 border border-stone-700 text-xs font-medium tracking-widest text-stone-300 mb-6 uppercase">
                                A Nova Era dos Eventos
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight text-white mb-8">
                                Crie Convites <br className="hidden md:block" />
                                <span className="text-stone-400 italic">Inesquecíveis.</span>
                            </h1>
                            <p className="max-w-2xl mx-auto text-lg md:text-xl text-stone-400 font-light mb-12">
                                Uma experiência digital premium para seus convidados. Design imersivo, gestão inteligente de RSVP e mapas integrados.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {canRegister && (
                                    <Link href={route('register')} className="w-full sm:w-auto px-8 py-4 bg-white text-stone-900 rounded-full text-base font-medium hover:bg-stone-200 transition-all transform hover:scale-105 shadow-xl">
                                        Começar Gratuitamente
                                    </Link>
                                )}
                                <Link href="/demo/invitation" className="w-full sm:w-auto px-8 py-4 bg-stone-800 text-white rounded-full text-base font-medium hover:bg-stone-700 border border-stone-700 transition-all">
                                    Ver Demonstração
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </main>

                {/* Features Section */}
                <section className="py-24 bg-black">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-12">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="p-8 rounded-3xl bg-stone-900 border border-stone-800"
                            >
                                <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-serif text-white mb-3">Animações 3D</h3>
                                <p className="text-stone-400 font-light leading-relaxed">
                                    Surpreenda com uma abertura de envelope digital fluida que traz a sensação tátil para o mundo online.
                                </p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="p-8 rounded-3xl bg-stone-900 border border-stone-800"
                            >
                                <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-serif text-white mb-3">RSVP Inteligente</h3>
                                <p className="text-stone-400 font-light leading-relaxed">
                                    Controle absoluto da sua lista. Limites automáticos baseados no seu pacote contratado e dados em tempo real.
                                </p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="p-8 rounded-3xl bg-stone-900 border border-stone-800"
                            >
                                <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-serif text-white mb-3">Múltiplos Locais</h3>
                                <p className="text-stone-400 font-light leading-relaxed">
                                    Guie seus convidados da cerimônia até a festa com integração nativa ao Google Maps.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <footer className="py-8 bg-black border-t border-stone-800 text-center text-stone-500 text-sm">
                    &copy; {new Date().getFullYear()} ShareInvite. Todos os direitos reservados.
                </footer>
            </div>
        </>
    );
}
