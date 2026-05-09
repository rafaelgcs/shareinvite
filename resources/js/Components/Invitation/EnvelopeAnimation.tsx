import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface EnvelopeProps {
    children: React.ReactNode;
    animationType?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
    backgroundColor?: string;
    logo?: string | null;
    title?: string;
    isPreview?: boolean;
}

export default function EnvelopeAnimation({ 
    children, 
    animationType = 'envelope_3d',
    primaryColor = '#1c1917',
    secondaryColor = '#fafaf9',
    textColor = '#1c1917',
    backgroundColor = '#ffffff',
    logo,
    title,
    isPreview = false
}: EnvelopeProps) {
    // isOpened means the user clicked it. It triggers the physical animation (doors opening, flap opening).
    const [isOpened, setIsOpened] = useState(false);
    // isFinished means the physical animation is done and we can show the actual invitation content.
    const [isFinished, setIsFinished] = useState(false);

    // Auto-open logic for fade/seal
    useEffect(() => {
        if (animationType === 'fade_in' || animationType === 'wax_seal') {
            const timer = setTimeout(() => {
                setIsOpened(true);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [animationType]);

    // Handle the transition to the actual invitation content
    useEffect(() => {
        if (isOpened) {
            let delay = 1500;
            if (animationType === 'gate_fold') delay = 1500;
            if (animationType === 'slipcase') delay = 1200;
            if (animationType === 'envelope_3d') delay = 1800; // time for flap to open then envelope to drop
            
            const timer = setTimeout(() => {
                setIsFinished(true);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [isOpened, animationType]);

    const handleOpen = () => {
        if (!isOpened) {
            setIsOpened(true);
        }
    };

    const renderLogoOrInitial = () => {
        if (logo) {
            return <img src={logo} alt="Logo" className="w-24 h-24 mx-auto object-cover drop-shadow-md rounded-full overflow-hidden" />;
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

    // The inner content entrance animation
    if (isFinished) {
        let initialAnim = { opacity: 0, y: 100, scale: 0.95 };
        let animateAnim = { opacity: 1, y: 0, scale: 1 };
        let transitionAnim = { duration: 1.2, ease: [0.16, 1, 0.3, 1] };

        if (animationType === 'gate_fold') {
            initialAnim = { opacity: 0, scale: 0.95 };
            animateAnim = { opacity: 1, scale: 1 };
            transitionAnim = { duration: 1, ease: "easeOut" };
        } else if (animationType === 'slipcase') {
            initialAnim = { opacity: 0, y: 200 };
            animateAnim = { opacity: 1, y: 0 };
            transitionAnim = { duration: 1, ease: "easeOut" };
        } else if (animationType === 'wax_seal') {
            initialAnim = { opacity: 0, scale: 1.05 };
            animateAnim = { opacity: 1, scale: 1 };
            transitionAnim = { duration: 1.5, ease: "easeOut" };
        } else if (animationType === 'fade_in') {
            initialAnim = { opacity: 0 };
            animateAnim = { opacity: 1 };
            transitionAnim = { duration: 2, ease: "easeInOut" };
        }

        return (
            <motion.div
                initial={initialAnim}
                animate={animateAnim}
                transition={transitionAnim}
                className={`${isPreview ? 'h-full w-full' : 'min-h-screen'} origin-bottom`}
                style={{ backgroundColor: secondaryColor, color: textColor }}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div 
            className={`${isPreview ? 'absolute inset-0' : 'fixed inset-0'} flex items-center justify-center z-50 overflow-hidden`}
            style={{ backgroundColor: backgroundColor }}
        >
            <div className="w-full h-full flex items-center justify-center perspective-1000 transform scale-75 md:scale-100">
                
                {/* 1. ENVELOPE CLÁSSICO 3D */}
                {animationType === 'envelope_3d' && (
                    <motion.div
                        className="relative w-full max-w-sm aspect-[3/4] cursor-pointer"
                        onClick={handleOpen}
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={isOpened ? { y: 1000, opacity: 0 } : { scale: 1, opacity: 1, y: 0 }}
                        transition={isOpened ? { duration: 1, delay: 0.8, ease: "anticipate" } : { duration: 0.8, ease: "easeOut" }}
                        whileHover={!isOpened ? { scale: 1.02 } : {}}
                    >
                        {/* Invitation Card peeking out */}
                        <motion.div 
                            className="absolute inset-x-4 top-4 bottom-10 rounded-t-lg bg-white shadow-inner flex pt-8 justify-center border border-stone-200 z-10"
                            animate={isOpened ? { y: -150 } : { y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <span className="font-serif text-xl opacity-30" style={{ color: primaryColor }}>Convite</span>
                        </motion.div>

                        <div 
                            className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden z-20"
                            style={{ backgroundColor: secondaryColor }}
                        >
                            {/* Flap */}
                            <motion.div
                                className="absolute top-0 inset-x-0 h-[60%] origin-top shadow-md z-30 flex flex-col items-center justify-end pb-8"
                                style={{ 
                                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                    backgroundColor: '#e7e5e4'
                                }}
                                animate={isOpened ? { rotateX: 180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <div className="translate-y-12">
                                    {renderLogoOrInitial()}
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="absolute bottom-10 left-0 right-0 text-center font-serif tracking-widest text-sm uppercase opacity-70"
                                style={{ color: primaryColor }}
                                animate={isOpened ? { opacity: 0 } : { opacity: 0.7 }}
                            >
                                Toque para abrir
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* 2. GATE FOLD (Janela) */}
                {animationType === 'gate_fold' && (
                    <motion.div
                        className="relative w-full max-w-md aspect-[4/3] cursor-pointer shadow-2xl flex"
                        onClick={handleOpen}
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={isOpened ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1, y: 0 }}
                        transition={isOpened ? { duration: 1, delay: 0.5, ease: "easeIn" } : { duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Background card (inside) */}
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-0">
                            <span className="font-serif text-2xl opacity-30" style={{ color: primaryColor }}>Abrindo...</span>
                        </div>

                        {/* Left Gate */}
                        <motion.div 
                            className="w-1/2 h-full origin-left z-10 flex items-center justify-end pr-2 border-r border-black/10 shadow-[5px_0_15px_rgba(0,0,0,0.1)]"
                            style={{ backgroundColor: '#e7e5e4' }}
                            animate={isOpened ? { rotateY: -110 } : { rotateY: 0 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        >
                            <div className="w-full h-8 absolute top-1/2 -translate-y-1/2 bg-stone-800/20" />
                        </motion.div>

                        {/* Right Gate */}
                        <motion.div 
                            className="w-1/2 h-full origin-right z-10 flex items-center justify-start pl-2 border-l border-white/50 shadow-[-5px_0_15px_rgba(0,0,0,0.1)]"
                            style={{ backgroundColor: '#e7e5e4' }}
                            animate={isOpened ? { rotateY: 110 } : { rotateY: 0 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        >
                            <div className="w-full h-8 absolute top-1/2 -translate-y-1/2 bg-stone-800/20" />
                        </motion.div>

                        {/* Center Seal */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                            <motion.div 
                                animate={isOpened ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {renderLogoOrInitial()}
                            </motion.div>
                        </div>
                        
                        <motion.div 
                            className="absolute -bottom-10 left-0 right-0 text-center font-serif tracking-widest text-sm uppercase opacity-70 text-white"
                            animate={isOpened ? { opacity: 0 } : { opacity: 0.7 }}
                        >
                            Toque para abrir
                        </motion.div>
                    </motion.div>
                )}

                {/* 3. SLIPCASE (Luva Deslizante) */}
                {animationType === 'slipcase' && (
                    <motion.div
                        className="relative w-full max-w-sm aspect-[3/4] cursor-pointer"
                        onClick={handleOpen}
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={isOpened ? { y: 1000, opacity: 0 } : { scale: 1, opacity: 1, y: 0 }}
                        transition={isOpened ? { duration: 1, delay: 0.5, ease: "easeIn" } : { duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Inner Card (slides up out of the slipcase) */}
                        <motion.div 
                            className="absolute inset-x-4 top-4 bottom-10 rounded-t-lg bg-white shadow-inner flex items-top justify-center pt-8 border border-stone-200 z-10"
                            animate={isOpened ? { y: -300 } : { y: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            <span className="font-serif text-xl opacity-30" style={{ color: primaryColor }}>Convite</span>
                        </motion.div>

                        {/* Outer Slipcase */}
                        <div 
                            className="absolute inset-0 rounded-b-lg shadow-2xl flex flex-col items-center justify-center border-t border-white/20 z-20"
                            style={{ 
                                backgroundColor: '#d6d3d1',
                                clipPath: 'polygon(0 20%, 100% 20%, 100% 100%, 0 100%)'
                            }}
                        >
                            <motion.div animate={isOpened ? { opacity: 0 } : { opacity: 1 }}>
                                {renderLogoOrInitial()}
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* 4. WAX SEAL (Foco no Selo e Quebra) */}
                {animationType === 'wax_seal' && (
                    <motion.div
                        className="flex flex-col items-center justify-center cursor-pointer"
                        onClick={handleOpen}
                        animate={isOpened ? { scale: 5, opacity: 0 } : { scale: 1, opacity: 1 }}
                        transition={isOpened ? { duration: 1, ease: "easeIn" } : { duration: 0.5 }}
                    >
                        <motion.div 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 2, rotate: 0 }}
                            transition={{ type: 'spring', bounce: 0.5, duration: 1.5 }}
                            whileHover={!isOpened ? { scale: 2.2 } : {}}
                        >
                            {renderLogoOrInitial()}
                        </motion.div>
                    </motion.div>
                )}

                {/* 5. FADE IN (Minimalista) */}
                {animationType === 'fade_in' && (
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={isOpened ? { opacity: 0, scale: 1.1, filter: 'blur(20px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
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
            </div>
        </div>
    );
}
