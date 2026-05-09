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
}

export default function InvitationView({ event, locations, notices }: InvitationViewProps) {
    const primaryColor = event.primary_color || '#1c1917';
    const secondaryColor = event.secondary_color || '#fafaf9';
    const textColor = event.text_color || '#1c1917';
    const backgroundColor = event.background_color || '#ffffff';
    const animationType = event.animation_type || 'envelope_3d';
    const theme = event.theme || 'classic';

    const renderTheme = () => {
        switch (theme) {
            case 'modern':
                return <ModernTheme event={event} locations={locations} />;
            case 'floral':
                return <FloralTheme event={event} locations={locations} />;
            case 'dark':
                return <DarkTheme event={event} locations={locations} />;
            case 'vintage':
                return <VintageTheme event={event} locations={locations} />;
            case 'classic':
            default:
                return <ClassicTheme event={event} locations={locations} />;
        }
    };

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

                {/* Footer - Shared across themes for branding */}
                <footer className="py-12 text-center text-white/50 text-sm" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <p>Feito com ❤️ pela plataforma ShareInvite.</p>
                </footer>
            </EnvelopeAnimation>
        </div>
    );
}

