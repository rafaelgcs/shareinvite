import { motion, AnimatePresence } from 'framer-motion';
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
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    // Auto-open logic for fade/seal
    useEffect(() => {
        if (animationType === 'fade_in' || animationType === 'wax_seal') {
            const timer = setTimeout(() => {
                setIsAnimatingOut(true);
                setTimeout(() => setIsOpen(true), 1500); // Wait for exit animation to finish
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [animationType]);

    const handleOpen = () => {
        setIsAnimatingOut(true);
        setTimeout(() => setIsOpen(true), 1500);
    };

    // Customized entrance animation based on the opening type
    if (isOpen) {
        let initialAnim = { opacity: 0, y: 100, scale: 0.95 };
        let animateAnim = { opacity: 1, y: 0, scale: 1 };
        let transitionAnim = { duration: 1.2, ease: [0.16, 1, 0.3, 1] };

        if (animationType === 'gate_fold') {
            initialAnim = { opacity: 0, y: 0, scale: 0.9 };
            animateAnim = { opacity: 1, y: 0, scale: 1 };
            transitionAnim = { duration: 1.5, ease: "easeOut" };
        } else if (animationType === 'slipcase') {
            initialAnim = { opacity: 0, y: 300, scale: 1 };
            animateAnim = { opacity: 1, y: 0, scale: 1 };
            transitionAnim = { duration: 1.2, type: "spring", bounce: 0.2 };
        } else if (animationType === 'wax_seal') {
            initialAnim = { opacity: 0, y: 0, scale: 1.1 };
            animateAnim = { opacity: 1, y: 0, scale: 1 };
            transitionAnim = { duration: 1.5, ease: "easeOut" };
        } else if (animationType === 'fade_in') {
            initialAnim = { opacity: 0, y: 0, scale: 1 };
            animateAnim = { opacity: 1, y: 0, scale: 1 };
            transitionAnim = { duration: 2, ease: "easeInOut" };
        }

        return (
            <motion.div
                initial={initialAnim}
                animate={animateAnim}
                transition={transitionAnim}
                className="min-h-screen origin-bottom"
                style={{ backgroundColor: secondaryColor }}
            >
                {children}
            </motion.div>
        );
    }

    const renderLogoOrInitial = () => {
        if (logo) {
            return <img src={logo} alt="Logo" className="w-24 h-24 mx-auto object-contain drop-shadow-md" />;
        }
        return (
            <div 
                className="w-20 h-20 rounded-full flex items-center justify-center font-serif text-4xl shadow-inner border"
                style={{ 
                    backgroundColor: primaryColor, 
                    borderColor: primaryColor,
                    color: secondaryColor,
                    boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)'
                }}
            >
                {title?.[0] || 'M'}
            </div>
        );
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
            style={{ backgroundColor: primaryColor }}
        >
            <AnimatePresence>
                {!isAnimatingOut && (
                    <motion.div
                        exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="w-full flex items-center justify-center perspective-1000"
                    >
                        
                        {/* 1. ENVELOPE CLÁSSICO 3D */}
                        {animationType === 'envelope_3d' && (
                            <motion.div
                                className="relative w-full max-w-sm aspect-[3/4] cursor-pointer"
                                onClick={handleOpen}
                                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div 
                                    className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden"
                                    style={{ backgroundColor: secondaryColor }}
                                >
                                    {/* Flap */}
                                    <motion.div
                                        className="absolute top-0 inset-x-0 h-[60%] origin-top shadow-md z-20 flex flex-col items-center justify-end pb-8"
                                        style={{ 
                                            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                            backgroundColor: '#e7e5e4'
                                        }}
                                        whileHover={{ rotateX: 10 }}
                                    >
                                        <div className="translate-y-12">
                                            {renderLogoOrInitial()}
                                        </div>
                                    </motion.div>
                                    
                                    <div 
                                        className="absolute bottom-10 left-0 right-0 text-center font-serif tracking-widest text-sm uppercase opacity-70"
                                        style={{ color: primaryColor }}
                                    >
                                        Toque para abrir
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 2. GATE FOLD (Janela) */}
                        {animationType === 'gate_fold' && (
                            <motion.div
                                className="relative w-full max-w-md aspect-[4/3] cursor-pointer shadow-2xl flex"
                                onClick={handleOpen}
                                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                {/* Background card (inside) */}
                                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: secondaryColor }}>
                                    <span className="font-serif text-2xl opacity-30" style={{ color: primaryColor }}>Abrindo...</span>
                                </div>

                                {/* Left Gate */}
                                <motion.div 
                                    className="w-1/2 h-full origin-left z-10 flex items-center justify-end pr-2 border-r border-black/10 shadow-[5px_0_15px_rgba(0,0,0,0.1)]"
                                    style={{ backgroundColor: '#e7e5e4' }}
                                    whileHover={{ rotateY: -15 }}
                                >
                                    {/* Half ribbon */}
                                    <div className="w-full h-8 absolute top-1/2 -translate-y-1/2 bg-stone-800/20" />
                                </motion.div>

                                {/* Right Gate */}
                                <motion.div 
                                    className="w-1/2 h-full origin-right z-10 flex items-center justify-start pl-2 border-l border-white/50 shadow-[-5px_0_15px_rgba(0,0,0,0.1)]"
                                    style={{ backgroundColor: '#e7e5e4' }}
                                    whileHover={{ rotateY: 15 }}
                                >
                                    <div className="w-full h-8 absolute top-1/2 -translate-y-1/2 bg-stone-800/20" />
                                </motion.div>

                                {/* Center Seal */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                                    {renderLogoOrInitial()}
                                </div>
                                
                                <div className="absolute -bottom-10 left-0 right-0 text-center font-serif tracking-widest text-sm uppercase opacity-70 text-white">
                                    Toque para abrir
                                </div>
                            </motion.div>
                        )}

                        {/* 3. SLIPCASE (Luva Deslizante) */}
                        {animationType === 'slipcase' && (
                            <motion.div
                                className="relative w-full max-w-sm aspect-[3/4] cursor-pointer"
                                onClick={handleOpen}
                                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                {/* Inner Card (slides up on hover) */}
                                <motion.div 
                                    className="absolute inset-x-4 top-4 bottom-10 rounded-t-lg shadow-inner flex items-top justify-center pt-8 border border-stone-200"
                                    style={{ backgroundColor: secondaryColor }}
                                    whileHover={{ y: -60 }}
                                    transition={{ type: 'spring', bounce: 0.4 }}
                                >
                                    <span className="font-serif text-xl opacity-50" style={{ color: primaryColor }}>Puxe-me</span>
                                </motion.div>

                                {/* Outer Slipcase */}
                                <div 
                                    className="absolute inset-0 rounded-b-lg shadow-2xl flex flex-col items-center justify-center border-t border-white/20"
                                    style={{ 
                                        backgroundColor: '#d6d3d1',
                                        clipPath: 'polygon(0 20%, 100% 20%, 100% 100%, 0 100%)'
                                    }}
                                >
                                    {renderLogoOrInitial()}
                                </div>
                            </motion.div>
                        )}

                        {/* 4. WAX SEAL (Foco no Selo e Quebra) */}
                        {animationType === 'wax_seal' && (
                            <motion.div
                                className="flex flex-col items-center justify-center cursor-pointer"
                                onClick={handleOpen}
                            >
                                <motion.div 
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 2, rotate: 0 }}
                                    transition={{ type: 'spring', bounce: 0.5, duration: 1.5 }}
                                    whileHover={{ scale: 2.2 }}
                                >
                                    {renderLogoOrInitial()}
                                </motion.div>
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="mt-16 font-serif tracking-widest text-sm uppercase opacity-70 text-white"
                                >
                                    O selo se romperá em breve...
                                </motion.p>
                            </motion.div>
                        )}

                        {/* 5. FADE IN (Minimalista) */}
                        {animationType === 'fade_in' && (
                            <motion.div
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            >
                                {logo ? (
                                    <img src={logo} alt="Logo" className="w-48 h-48 mx-auto mb-8 object-contain drop-shadow-2xl" />
                                ) : (
                                    <div 
                                        className="w-32 h-32 backdrop-blur-md rounded-full border mx-auto flex items-center justify-center mb-8 shadow-2xl"
                                        style={{ backgroundColor: `${secondaryColor}20`, borderColor: `${secondaryColor}40` }}
                                    >
                                        <span className="font-serif text-5xl" style={{ color: secondaryColor }}>{title?.[0] || 'E'}</span>
                                    </div>
                                )}
                                <h1 className="font-serif text-3xl tracking-widest text-white uppercase opacity-80">
                                    {title}
                                </h1>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
