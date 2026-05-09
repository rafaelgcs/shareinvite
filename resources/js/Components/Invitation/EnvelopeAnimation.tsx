import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface EnvelopeProps {
    children: React.ReactNode;
    animationType?: string;
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string | null;
    title?: string;
}

export default function EnvelopeAnimation({ 
    children, 
    animationType = 'envelope_3d',
    primaryColor = '#1c1917',
    secondaryColor = '#fafaf9',
    logo,
    title
}: EnvelopeProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Fade-in animation handling
    useEffect(() => {
        if (animationType === 'fade_in') {
            const timer = setTimeout(() => setIsOpen(true), 2500); // 2.5s intro
            return () => clearTimeout(timer);
        }
    }, [animationType]);

    if (isOpen) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="min-h-screen"
                style={{ backgroundColor: secondaryColor }}
            >
                {children}
            </motion.div>
        );
    }

    if (animationType === 'fade_in') {
        return (
            <div 
                className="fixed inset-0 flex flex-col items-center justify-center z-50 transition-colors duration-1000"
                style={{ backgroundColor: primaryColor }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="text-center"
                >
                    {logo ? (
                        <img src={logo} alt="Logo" className="w-32 h-32 mx-auto mb-6 object-contain drop-shadow-2xl" />
                    ) : (
                        <div 
                            className="w-24 h-24 backdrop-blur-md rounded-full border mx-auto flex items-center justify-center mb-6 shadow-2xl"
                            style={{ backgroundColor: `${secondaryColor}20`, borderColor: `${secondaryColor}40` }}
                        >
                            <span className="font-serif text-3xl" style={{ color: secondaryColor }}>{title?.[0] || 'E'}</span>
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    // Classic 3D Envelope
    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: primaryColor }}
        >
            <motion.div
                className="relative w-full max-w-sm aspect-[3/4] cursor-pointer perspective-1000"
                onClick={() => setIsOpen(true)}
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
            >
                {/* Back of envelope */}
                <div 
                    className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden"
                    style={{ backgroundColor: secondaryColor }}
                >
                    {/* Flap */}
                    <motion.div
                        className="absolute top-0 inset-x-0 h-1/2 origin-top shadow-md z-20 flex items-center justify-center"
                        style={{ 
                            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                            backgroundColor: '#e7e5e4' // slightly darker than stone-50
                        }}
                        whileHover={{ rotateX: 10 }}
                    >
                        {/* Wax Seal */}
                        <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center font-serif text-2xl shadow-inner mt-16 border"
                            style={{ 
                                backgroundColor: primaryColor, 
                                borderColor: primaryColor,
                                color: secondaryColor,
                                boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.3)'
                            }}
                        >
                            {title?.[0] || 'M'}
                        </div>
                    </motion.div>
                    
                    {/* Front cover design details */}
                    <div 
                        className="absolute bottom-10 left-0 right-0 text-center font-serif tracking-widest text-sm uppercase opacity-70"
                        style={{ color: primaryColor }}
                    >
                        Toque para abrir
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
