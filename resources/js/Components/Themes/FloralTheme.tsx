import { motion } from 'framer-motion';
import GoogleMapWidget from '@/Components/Invitation/GoogleMapWidget';
import RsvpForm from '@/Components/Invitation/RsvpForm';

interface ThemeProps {
    event: any;
    locations: any[];
    guides?: any[];
}

export default function FloralTheme({ event, locations, guides = [] }: ThemeProps) {

    const defaultCover = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop";

    return (
        <div className="bg-[#fffcf9] min-h-screen">
            {/* Elegant Cover Section */}
            <section className="relative w-full h-[90vh] flex items-center justify-center p-4 md:p-12 overflow-hidden">
                {/* Decorative Floral background element (using CSS/Gradients/Shapes since we don't have SVG assets easily) */}
                <div className="absolute top-0 left-0 w-64 h-64 opacity-10 -translate-x-1/4 -translate-y-1/4 pointer-events-none">
                    <div className="w-full h-full rounded-full border-[20px] border-stone-900" />
                </div>
                <div className="absolute bottom-0 right-0 w-80 h-80 opacity-10 translate-x-1/4 translate-y-1/4 pointer-events-none">
                    <div className="w-full h-full rounded-full border-[15px] border-stone-900" />
                </div>

                <div className="relative z-10 w-full max-w-5xl h-full flex flex-col items-center justify-center border border-stone-200 bg-white/40 backdrop-blur-sm p-8 md:p-16 text-center rounded-[40px] md:rounded-[100px]">
                    <div className="absolute inset-4 border border-stone-100 rounded-[30px] md:rounded-[90px] pointer-events-none" />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                        className="mb-8"
                    >
                        {event.logo ? (
                            <img src={event.logo} alt="Logo" className="w-24 h-24 object-contain mb-8" />
                        ) : (
                            <div className="w-20 h-20 border border-stone-300 rounded-full flex items-center justify-center mb-8 font-serif italic text-2xl text-stone-400">
                                {event.title?.[0]}
                            </div>
                        )}
                    </motion.div>

                    <h2 className="font-serif italic text-xl md:text-2xl text-stone-500 mb-6">Convidamos você para celebrar o nosso</h2>
                    <h1 className="font-serif text-5xl md:text-8xl text-stone-900 mb-10 tracking-tight">
                        {event.title}
                    </h1>
                    
                    <div className="flex items-center gap-6 mb-10">
                        <div className="h-px w-12 bg-stone-300" />
                        <p className="font-serif italic text-lg md:text-2xl text-stone-600">
                            {new Date(event.event_date).toLocaleDateString('pt-BR', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                        <div className="h-px w-12 bg-stone-300" />
                    </div>

                    <div className="w-full max-w-md h-[30vh] overflow-hidden rounded-2xl shadow-lg mt-4">
                         <img 
                            src={event.cover_image || defaultCover} 
                            alt="Capa"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Locations Section - Floral */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-16">
                        <span className="text-3xl mb-4 block">🌸</span>
                        <h2 className="font-serif text-4xl text-stone-900 mb-4">Localização do Encontro</h2>
                        <p className="font-serif italic text-stone-500 max-w-md mx-auto leading-relaxed">
                            Mal podemos esperar para ver você em nosso local especial. Siga o mapa abaixo para chegar sem dificuldades.
                        </p>
                    </div>
                    
                    <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white text-black">
                        <GoogleMapWidget locations={locations} layout="list" />
                    </div>
                </div>
            </section>

            {/* Guides Section - Floral */}
            {guides.length > 0 && (
                <section className="py-24 px-4 bg-white relative">
                    <div className="absolute top-0 right-0 w-64 h-64 opacity-5 rotate-180 pointer-events-none">
                         <div className="w-full h-full rounded-full border-[20px] border-stone-900" />
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="font-serif text-4xl text-stone-900 mb-2 italic">Dicas e Orientações</h2>
                            <p className="font-serif text-stone-400">Preparamos alguns guias para que tudo seja perfeito.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-12">
                            {guides.map((guide) => (
                                <motion.div 
                                    key={guide.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="p-10 border border-stone-100 rounded-[50px] bg-[#fffcf9] text-center shadow-sm"
                                >
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-50">
                                        <span className="text-xs">✨</span>
                                    </div>
                                    <h3 className="font-serif text-2xl text-stone-800 mb-4">{guide.title}</h3>
                                    <p className="font-serif italic text-stone-600 leading-relaxed whitespace-pre-wrap">{guide.content}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* RSVP Section - Elegant */}
            <section id="rsvp-section" className="py-32 px-4 bg-stone-900 text-white relative">
                 <div className="max-w-3xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-5xl mb-6 italic">Sua presença é essencial</h2>
                        <p className="text-stone-400 tracking-widest uppercase text-sm font-light">Por favor, confirme até 15 dias antes</p>
                    </div>
                    <div className="bg-white rounded-3xl p-8 md:p-12 text-stone-900 shadow-2xl">
                        <RsvpForm eventId={event.id} allowExtraGuests={event.allow_extra_guests} maxExtraGuests={event.max_extra_guests} />
                    </div>
                </div>
            </section>
        </div>
    );
}
