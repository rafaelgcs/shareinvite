import { motion } from 'framer-motion';
import GoogleMapWidget from '@/Components/Invitation/GoogleMapWidget';
import RsvpForm from '@/Components/Invitation/RsvpForm';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface ThemeProps {
    event: any;
    locations: any[];
    guides?: any[];
    guest?: any;
}

export default function ClassicTheme({ event, locations, guides = [], guest = null }: ThemeProps) {

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

            {/* Guides Section */}
            {guides.length > 0 && (
                <section className="py-24 px-4 bg-stone-50 border-y border-stone-200">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="font-serif text-4xl mb-4" style={{ color: 'var(--color-primary)' }}>Guia do Evento</h2>
                            <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: 'var(--color-primary)' }} />
                            <p className="text-stone-500 italic">Informações importantes para que você aproveite cada momento.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            {guides.map((guide) => (
                                <motion.div 
                                    key={guide.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="p-8 bg-white rounded-3xl border border-stone-100 shadow-sm"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">
                                        {guide.type.replace('_', ' ')}
                                    </span>
                                    <h3 className="font-serif text-2xl text-stone-900 mb-4">{guide.title}</h3>
                                    <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{guide.content}</p>

                                    {guide.file_path && (
                                        <div className="mt-6 pt-6 border-t border-stone-100">
                                            <a 
                                                href={guide.file_path} 
                                                target="_blank" 
                                                className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-all group"
                                            >
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                                    {guide.file_path.toLowerCase().endsWith('.pdf') ? (
                                                        <FileText className="w-6 h-6 text-red-500" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-blue-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-stone-900 uppercase tracking-widest">Ver Anexo</p>
                                                    <p className="text-[10px] text-stone-400">PDF ou Imagem Informativa</p>
                                                </div>
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* RSVP Section */}
            <section id="rsvp-section" className="py-24 px-4 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'var(--color-primary)' }} />
                <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" style={{ backgroundColor: 'var(--color-primary)' }} />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                >
                    <RsvpForm 
                        eventId={event.id} 
                        event={event}
                        allowExtraGuests={event.allow_extra_guests} 
                        maxExtraGuests={event.max_extra_guests} 
                        guest={guest}
                    />
                </motion.div>
            </section>
        </>
    );
}
