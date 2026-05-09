import { motion } from 'framer-motion';
import EnvelopeAnimation from '@/Components/Invitation/EnvelopeAnimation';
import NoticeModal from '@/Components/Invitation/NoticeModal';
import { Head } from '@inertiajs/react';
import ClassicTheme from '@/Components/Themes/ClassicTheme';
import ModernTheme from '@/Components/Themes/ModernTheme';
import FloralTheme from '@/Components/Themes/FloralTheme';
import DarkTheme from '@/Components/Themes/DarkTheme';
import VintageTheme from '@/Components/Themes/VintageTheme';

// Example props interface coming from Laravel/Inertia
interface InvitationViewProps {
    event: {
        id: number;
        title: string;
        cover_image: string | null;
        logo: string | null;
        event_date: string;
        primary_color?: string;
        secondary_color?: string;
        text_color?: string;
        background_color?: string;
        animation_type?: string;
        theme?: string;
        rsvp_enabled?: boolean;
        rsvp_deadline?: string | null;
    };
    locations: Array<{
        id: number;
        name: string;
        address: string;
        notes: string;
        latitude: number;
        longitude: number;
    }>;
    notices: Array<{
        id: number;
        message: string;
        priority: string;
    }>;
    guides: Array<{
        id: number;
        title: string;
        content: string;
        type: string;
    }>;
}

export default function InvitationView({ event, locations, notices, guides }: InvitationViewProps) {
    const primaryColor = event.primary_color || '#1c1917';
    const secondaryColor = event.secondary_color || '#fafaf9';
    const textColor = event.text_color || '#1c1917';
    const backgroundColor = event.background_color || '#ffffff';
    const animationType = event.animation_type || 'envelope_3d';
    const theme = event.theme || 'classic';

    const renderTheme = () => {
        switch (theme) {
            case 'modern':
                return <ModernTheme event={event} locations={locations} guides={guides} />;
            case 'floral':
                return <FloralTheme event={event} locations={locations} guides={guides} />;
            case 'dark':
                return <DarkTheme event={event} locations={locations} guides={guides} />;
            case 'vintage':
                return <VintageTheme event={event} locations={locations} guides={guides} />;
            case 'classic':
            default:
                return <ClassicTheme event={event} locations={locations} guides={guides} />;
        }
    };

    const isRsvpOpen = event.rsvp_enabled && (!event.rsvp_deadline || new Date(event.rsvp_deadline) >= new Date());

    return (
        <div style={{ 
            '--color-primary': primaryColor, 
            '--color-secondary': secondaryColor,
            '--color-text': textColor,
            '--color-bg': backgroundColor
        } as React.CSSProperties}>
            <Head title={`Convite: ${event.title}`} />
            
            <EnvelopeAnimation 
                animationType={animationType}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                textColor={textColor}
                backgroundColor={backgroundColor}
                logo={event.logo}
                title={event.title}
            >
                <NoticeModal notices={notices} />

                {renderTheme()}

                {/* Premium Footer */}
                <footer className="relative pt-24 pb-48 text-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                    {/* Decorative Top Wave/Border */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
                    
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="mb-12">
                            <span className="font-serif text-3xl text-white/90 tracking-tighter">ShareInvite</span>
                            <div className="h-px w-8 bg-white/20 mx-auto mt-4" />
                        </div>
                        
                        <p className="text-white/40 text-sm font-light tracking-widest uppercase mb-8">
                            Eternizando momentos especiais
                        </p>
                        
                        <div className="flex justify-center gap-6 mb-12">
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 text-lg">✨</div>
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 text-lg">🥂</div>
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 text-lg">🤍</div>
                        </div>

                        <p className="text-white/20 text-[10px] uppercase tracking-[0.3em]">
                            Plataforma de Convites Digitais de Luxo
                        </p>
                    </div>
                </footer>
            </EnvelopeAnimation>

            {/* Floating RSVP Button */}
            {event.rsvp_enabled && (
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none"
                >
                    {isRsvpOpen ? (
                        <button 
                            onClick={() => {
                                const rsvpSection = document.getElementById('rsvp-section');
                                if (rsvpSection) {
                                    rsvpSection.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="pointer-events-auto px-8 py-4 bg-stone-900 text-white rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all group"
                        >
                            <span className="font-bold tracking-widest uppercase text-xs">Confirmar Presença</span>
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/40">
                                <motion.span 
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="text-xs"
                                >
                                    ✍️
                                </motion.span>
                            </div>
                        </button>
                    ) : (
                        <div className="pointer-events-auto px-6 py-3 bg-stone-200 text-stone-500 rounded-full shadow-lg flex items-center gap-2 grayscale cursor-not-allowed">
                            <span className="font-bold tracking-widest uppercase text-xs">RSVP Encerrado</span>
                            <span className="text-xs">🔒</span>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}

