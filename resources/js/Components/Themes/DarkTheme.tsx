import { motion } from 'framer-motion';
import GoogleMapWidget from '@/Components/Invitation/GoogleMapWidget';
import RsvpForm from '@/Components/Invitation/RsvpForm';

interface ThemeProps {
    event: any;
    locations: any[];
    guides?: any[];
}

export default function DarkTheme({ event, locations, guides = [] }: ThemeProps) {

    const defaultCover = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop";

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white">
            {/* Cinematic Cover Section */}
            <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={event.cover_image || defaultCover} 
                        alt="Capa"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 1.1 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    className="relative z-10 text-center px-4"
                >
                    {event.logo && (
                        <img src={event.logo} alt="Logo" className="w-24 h-24 mx-auto mb-8 object-contain brightness-0 invert opacity-80" />
                    )}
                    <h1 className="font-serif text-6xl md:text-9xl text-white tracking-tighter mb-6 uppercase">
                        {event.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-8 bg-white/30" />
                        <p className="text-white/60 tracking-[0.5em] uppercase text-xs font-medium">
                            The Celebration
                        </p>
                        <div className="h-px w-8 bg-white/30" />
                    </div>
                    <p className="text-white font-light text-xl md:text-2xl">
                        {new Date(event.event_date).toLocaleDateString('pt-BR', {
                            day: '2-digit', month: 'long', year: 'numeric'
                        })}
                    </p>
                </motion.div>
            </section>

            {/* Locations Section - List Mode */}
            <section className="py-32 px-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-20 text-center">
                        <h2 className="text-4xl font-serif mb-4 uppercase tracking-widest">Os Locais</h2>
                        <p className="text-white/40 font-light">Tudo o que você precisa saber para chegar.</p>
                    </div>
                    
                    <div className="text-black">
                        <GoogleMapWidget locations={locations} layout="list" />
                    </div>
                </div>
            </section>

            {/* Guides Section - Dark Sleek */}
            {guides.length > 0 && (
                <section className="py-32 px-4 bg-[#0a0a0a] border-t border-white/5">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-20 grid md:grid-cols-2 items-end gap-8">
                            <div>
                                <h2 className="text-5xl font-serif uppercase tracking-tighter">The Essentials</h2>
                                <p className="text-white/40 mt-4 font-light">Important information for all distinguished guests.</p>
                            </div>
                            <div className="h-px bg-white/20 w-full mb-4" />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-1px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
                            {guides.map((guide) => (
                                <motion.div 
                                    key={guide.id}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="p-12 bg-[#0a0a0a]"
                                >
                                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 mb-6">{guide.title}</h3>
                                    <div className="text-white/70 font-light leading-relaxed whitespace-pre-wrap">
                                        {guide.content}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* RSVP Section - Dark Card */}
            <section id="rsvp-section" className="py-32 px-4 bg-[#111] border-t border-white/5">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto bg-white p-12 rounded-[40px] text-black"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif mb-2">Confirmar</h2>
                        <p className="text-stone-400 uppercase tracking-widest text-xs">Aguardamos por você</p>
                    </div>
                    <RsvpForm eventId={event.id} allowExtraGuests={event.allow_extra_guests} maxExtraGuests={event.max_extra_guests} />
                </motion.div>
            </section>
        </div>
    );
}
