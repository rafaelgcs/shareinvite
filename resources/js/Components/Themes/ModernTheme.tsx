import { motion } from 'framer-motion';
import GoogleMapWidget from '@/Components/Invitation/GoogleMapWidget';
import RsvpForm from '@/Components/Invitation/RsvpForm';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface ThemeProps {
    event: any;
    locations: any[];
    guides?: any[];
}

export default function ModernTheme({ event, locations, guides = [] }: ThemeProps) {

    const defaultCover = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop";

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Split Cover Section */}
            <section className="relative w-full min-h-screen flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative">
                    <img 
                        src={event.cover_image || defaultCover} 
                        alt="Capa"
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="w-full md:w-1/2 min-h-[50vh] md:h-screen flex items-center justify-center p-8 md:p-16 bg-stone-50">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-md w-full"
                    >
                        {event.logo && (
                            <img src={event.logo} alt="Logo" className="w-20 h-20 mb-8 object-contain opacity-80" />
                        )}
                        <h2 className="text-stone-400 uppercase tracking-[0.3em] text-xs font-semibold mb-4">You are invited to</h2>
                        <h1 className="text-5xl md:text-7xl font-light text-stone-900 tracking-tight leading-none mb-8">
                            {event.title}
                        </h1>
                        <div className="h-px w-12 bg-stone-300 mb-8" />
                        <p className="text-stone-600 text-lg md:text-xl font-light leading-relaxed mb-4">
                            {new Date(event.event_date).toLocaleDateString('pt-BR', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Locations Section - Minimal */}
            <section className="py-32 px-4 bg-white">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 items-start">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-light text-stone-900 mb-6 tracking-tight">Onde & Quando</h2>
                        <p className="text-stone-500 leading-relaxed">
                            Junte-se a nós para celebrar este momento especial. Preparamos tudo com muito carinho para receber você.
                        </p>
                    </motion.div>
                    
                    <div className="md:col-span-2">
                        <GoogleMapWidget locations={locations} layout="list" />
                    </div>
                </div>
            </section>

            {/* Guides Section - Minimalist */}
            {guides.length > 0 && (
                <section className="py-32 px-4 bg-stone-50 overflow-hidden">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-20">
                            <h2 className="text-4xl font-light text-stone-900 tracking-tight mb-4">Informações e Orientações</h2>
                            <div className="h-px w-24 bg-stone-900" />
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                            {guides.map((guide) => (
                                <motion.div 
                                    key={guide.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-6">{guide.title}</h3>
                                    <div className="text-stone-600 leading-relaxed font-light whitespace-pre-wrap">
                                        {guide.content}
                                    </div>

                                    {guide.file_path && (
                                        <div className="mt-8">
                                            <a 
                                                href={guide.file_path} 
                                                target="_blank" 
                                                className="inline-flex items-center gap-4 text-stone-900 group"
                                            >
                                                <div className="w-14 h-14 bg-white border border-stone-100 flex items-center justify-center shadow-sm group-hover:bg-stone-900 group-hover:text-white transition-all duration-300">
                                                    {guide.file_path.toLowerCase().endsWith('.pdf') ? (
                                                        <FileText className="w-6 h-6" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6" />
                                                    )}
                                                </div>
                                                <div className="border-b border-stone-200 pb-1 group-hover:border-stone-900 transition-colors">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Ver Material</p>
                                                    <p className="text-xs text-stone-400 font-light italic">Attachment</p>
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

            {/* RSVP Section - Clean */}
            <section id="rsvp-section" className="py-32 px-4 bg-stone-50">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto bg-white p-8 md:p-16 rounded-sm shadow-sm border border-stone-100"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-stone-900 mb-4 tracking-tight">Confirmar Presença</h2>
                        <p className="text-stone-400 text-sm uppercase tracking-widest">RSVP</p>
                    </div>
                    <RsvpForm 
                        eventId={event.id} 
                        event={event}
                        allowExtraGuests={event.allow_extra_guests} 
                        maxExtraGuests={event.max_extra_guests} 
                    />
                </motion.div>
            </section>
        </div>
    );
}
