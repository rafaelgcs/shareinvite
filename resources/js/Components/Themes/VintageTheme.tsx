import { motion } from 'framer-motion';
import GoogleMapWidget from '@/Components/Invitation/GoogleMapWidget';
import RsvpForm from '@/Components/Invitation/RsvpForm';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { formatEventDate } from '@/Utils/dateUtils';

interface ThemeProps {
    event: any;
    locations: any[];
    guides?: any[];
    guest?: any;
}

export default function VintageTheme({ event, locations, guides = [], guest = null }: ThemeProps) {

    const defaultCover = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop";

    return (
        <div className="bg-[#f2e8cf] min-h-screen text-[#3d405b] font-serif overflow-hidden">
            {/* Vintage Paper Overlay Effect */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />

            {/* Antique Cover Section */}
            <section className="relative w-full h-[100vh] flex items-center justify-center p-6">
                <div className="absolute inset-8 border-[12px] border-double border-[#bc6c25]/30 rounded-sm pointer-events-none" />
                
                <div className="text-center max-w-4xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                         {event.logo && (
                            <img src={event.logo} alt="Logo" className="w-20 h-20 mx-auto mb-12 sepia" />
                        )}
                        <h2 className="text-xl uppercase tracking-[0.4em] text-[#bc6c25] mb-8 font-sans font-bold italic">Grande Comemoração</h2>
                        <h1 className="text-6xl md:text-9xl text-[#3d405b] mb-12 leading-none border-y-2 border-[#bc6c25]/20 py-8 inline-block px-12">
                            {event.title}
                        </h1>
                        <p className="text-2xl md:text-4xl italic text-[#6a6c7c]">
                            {formatEventDate(event.event_date)}
                        </p>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-[#bc6c25]/40 font-bold tracking-widest text-xs font-sans uppercase">
                    <span>MCMXXIV</span>
                    <div className="h-px flex-1 mx-8 bg-[#bc6c25]/20" />
                    <span>Miu Invites Edition</span>
                </div>
            </section>

            {/* Locations - List Layout */}
            <section className="py-32 px-4 bg-white/40 border-y border-[#bc6c25]/10">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-20 text-center">
                        <h2 className="text-5xl mb-6 italic">O Roteiro</h2>
                        <p className="text-[#6a6c7c] max-w-md mx-auto leading-relaxed">
                            Guarde estas informações com carinho. Esperamos por você nos seguintes locais.
                        </p>
                    </div>
                    
                    <div className="vintage-list">
                        <GoogleMapWidget locations={locations} layout="list" />
                    </div>
                </div>
            </section>

            {/* Guides Section - Antique style */}
            {guides.length > 0 && (
                <section className="py-32 px-4 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-20 text-center">
                            <h2 className="text-4xl italic text-[#bc6c25] mb-4">Avisos aos Convidados</h2>
                            <div className="w-48 h-px bg-[#bc6c25]/20 mx-auto" />
                        </div>
                        
                        <div className="space-y-16">
                            {guides.map((guide) => (
                                <motion.div 
                                    key={guide.id}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="border-l-4 border-[#bc6c25]/20 pl-8 py-2"
                                >
                                    <h3 className="text-xl uppercase tracking-widest text-[#3d405b] mb-4 font-bold">{guide.title}</h3>
                                    <div className="text-lg text-[#6a6c7c] italic leading-relaxed whitespace-pre-wrap">
                                        {guide.content}
                                    </div>

                                    {guide.file_path && (
                                        <div className="mt-8">
                                            <a 
                                                href={guide.file_path} 
                                                target="_blank" 
                                                className="inline-flex items-center gap-4 p-4 border border-[#bc6c25]/10 bg-white/50 rounded-sm hover:bg-white transition-all group"
                                            >
                                                <div className="w-12 h-12 border border-[#bc6c25]/20 flex items-center justify-center sepia group-hover:bg-[#bc6c25]/10">
                                                    {guide.file_path.toLowerCase().endsWith('.pdf') ? (
                                                        <FileText className="w-6 h-6 text-red-800" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-blue-800" />
                                                    )}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bc6c25]/60 mb-1">Anexo Informativo</p>
                                                    <p className="text-sm font-bold text-[#3d405b]">Visualizar Arquivo</p>
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
            <section id="rsvp-section" className="py-32 px-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto bg-white p-12 shadow-2xl border-4 border-[#bc6c25]/10 rounded-lg relative"
                >
                    <div className="absolute top-4 right-4 text-[#bc6c25]/20 text-6xl">✉️</div>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl mb-4 italic">Confirme seu Convite</h2>
                        <div className="w-24 h-1 bg-[#bc6c25]/20 mx-auto" />
                    </div>
                    <RsvpForm 
                        eventId={event.id} 
                        event={event}
                        allowExtraGuests={event.allow_extra_guests} 
                        maxExtraGuests={event.max_extra_guests} 
                        guest={guest}
                    />
                </motion.div>
            </section>
        </div>
    );
}
