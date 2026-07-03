import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnvelopeAnimation from '@/Components/Invitation/EnvelopeAnimation';
import NoticeModal from '@/Components/Invitation/NoticeModal';
import { Head, Link } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import ClassicTheme from '@/Components/Themes/ClassicTheme';
import ModernTheme from '@/Components/Themes/ModernTheme';
import FloralTheme from '@/Components/Themes/FloralTheme';
import DarkTheme from '@/Components/Themes/DarkTheme';
import VintageTheme from '@/Components/Themes/VintageTheme';
import { hasInvitationOpened, isEventConfirmedLocally, getOpenedStorageKey, getRsvpStorageKey } from '@/Utils/rsvpStorage';

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
        allow_extra_guests?: boolean;
        max_extra_guests?: number;
        can_access_mural?: boolean;
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
        file_path?: string | null;
    }>;
    guest?: any;
}

export default function InvitationView({ event, locations, notices, guides, guest = null }: InvitationViewProps) {
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);
    const [skipAnimation, setSkipAnimation] = useState(false);

    useEffect(() => {
        // Check if user has already opened the invitation and confirmed
        const hasOpened = hasInvitationOpened(event.slug);
        const isConfirmed = !!guest?.confirmed_at || isEventConfirmedLocally(event.id);
        
        if (hasOpened && isConfirmed) {
            setSkipAnimation(true);
        }
    }, [event.slug, event.id, guest]);

    const primaryColor = event.primary_color || '#1c1917';
    const secondaryColor = event.secondary_color || '#fafaf9';
    const textColor = event.text_color || '#1c1917';
    const backgroundColor = event.background_color || '#ffffff';
    const animationType = event.animation_type || 'envelope_3d';
    const theme = event.theme || 'classic';

    // Check if event is already confirmed (from server or localStorage)
    const isEventConfirmed = !!guest?.confirmed_at || isEventConfirmedLocally(event.id);

    const renderTheme = () => {
        switch (theme) {
            case 'modern':
                return <ModernTheme event={event} locations={locations} guides={guides} guest={guest} />;
            case 'floral':
                return <FloralTheme event={event} locations={locations} guides={guides} guest={guest} />;
            case 'dark':
                return <DarkTheme event={event} locations={locations} guides={guides} guest={guest} />;
            case 'vintage':
                return <VintageTheme event={event} locations={locations} guides={guides} guest={guest} />;
            case 'classic':
            default:
                return <ClassicTheme event={event} locations={locations} guides={guides} guest={guest} />;
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
                initialOpened={skipAnimation}
                onComplete={setIsAnimationFinished}
                slug={event.slug}
            >
                <NoticeModal notices={notices} />

                {renderTheme()}

                {/* Premium Footer */}
                <footer className="relative pt-24 pb-48 text-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                    {/* Decorative Top Wave/Border */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
                    
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="mb-12">
                            <span className="font-serif text-3xl text-white/90 tracking-tighter">Miu Invites</span>
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
            {event.rsvp_enabled && isAnimationFinished && !isEventConfirmed && (
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

            {/* Floating Feed Button */}
            {isAnimationFinished && event.can_access_mural && (
                <motion.div 
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="fixed bottom-28 right-6 z-50 flex flex-col items-end gap-3"
                >
                    <Link 
                        href={route('invitation.feed', event.slug)}
                        className="w-14 h-14 bg-white/80 backdrop-blur-md text-stone-900 rounded-full shadow-2xl flex items-center justify-center border border-stone-200 hover:scale-110 active:scale-95 transition-all group pointer-events-auto"
                    >
                        <Camera className="w-6 h-6" />
                        <span className="absolute right-16 bg-stone-900 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Mural de Fotos</span>
                    </Link>
                </motion.div>
            )}
        </div>
    );
}

