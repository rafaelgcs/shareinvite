import { motion } from 'framer-motion';
import GoogleMapWidget from '@/Components/Invitation/GoogleMapWidget';
import RsvpForm from '@/Components/Invitation/RsvpForm';

interface ThemeProps {
    event: any;
    locations: any[];
}

export default function DarkTheme({ event, locations }: ThemeProps) {
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

            {/* RSVP Section - Dark Card */}
            <section className="py-32 px-4 bg-[#111] border-t border-white/5">
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
                    <RsvpForm eventId={event.id} />
                </motion.div>
            </section>
        </div>
    );
}
