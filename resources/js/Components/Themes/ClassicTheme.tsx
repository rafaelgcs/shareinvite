import { motion } from 'framer-motion';
import GoogleMapWidget from '@/Components/Invitation/GoogleMapWidget';
import RsvpForm from '@/Components/Invitation/RsvpForm';

interface ThemeProps {
    event: any;
    locations: any[];
}

export default function ClassicTheme({ event, locations }: ThemeProps) {
    const defaultCover = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop";

    return (
        <>
            {/* Cover Section */}
            <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={event.cover_image || defaultCover} 
                        alt="Capa do Evento"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative z-10 text-center px-4"
                >
                    {event.logo ? (
                        <img src={event.logo} alt="Logo" className="w-32 h-32 mx-auto mb-6 object-contain drop-shadow-xl" />
                    ) : (
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mx-auto flex items-center justify-center mb-6 shadow-xl">
                            <span className="font-serif text-3xl text-white">M&A</span>
                        </div>
                    )}
                    <h1 className="font-serif text-5xl md:text-7xl text-white tracking-wide drop-shadow-lg mb-4">
                        {event.title}
                    </h1>
                    <p className="text-white/90 font-light tracking-widest uppercase text-sm md:text-base">
                        {new Date(event.event_date).toLocaleDateString('pt-BR', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </p>
                </motion.div>
            </section>

            {/* Locations Section */}
            <section className="py-24 px-4" style={{ backgroundColor: 'var(--color-secondary)' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-4xl mb-4" style={{ color: 'var(--color-primary)' }}>Localização</h2>
                        <div className="w-12 h-0.5 mx-auto" style={{ backgroundColor: 'var(--color-primary)' }} />
                    </div>
                    
                    <GoogleMapWidget locations={locations} layout="list" />
                </motion.div>
            </section>

            {/* RSVP Section */}
            <section className="py-24 px-4 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'var(--color-primary)' }} />
                <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" style={{ backgroundColor: 'var(--color-primary)' }} />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                >
                    <RsvpForm eventId={event.id} />
                </motion.div>
            </section>
        </>
    );
}
