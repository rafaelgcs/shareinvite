import { motion } from 'framer-motion';
import { useState } from 'react';

export default function EnvelopeAnimation({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    if (isOpen) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="min-h-screen bg-stone-50"
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-stone-900 z-50">
            <motion.div
                className="relative w-full max-w-sm aspect-[3/4] cursor-pointer perspective-1000"
                onClick={() => setIsOpen(true)}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
            >
                {/* Back of envelope */}
                <div className="absolute inset-0 bg-stone-200 rounded-lg shadow-xl overflow-hidden">
                    {/* Flap */}
                    <motion.div
                        className="absolute top-0 inset-x-0 h-1/2 bg-stone-300 origin-top shadow-sm z-20 flex items-center justify-center"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                        whileHover={{ rotateX: 10 }}
                    >
                        {/* Wax Seal */}
                        <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center text-white/80 font-serif text-2xl shadow-inner mt-16 border border-red-900">
                            M
                        </div>
                    </motion.div>
                    
                    {/* Front cover design details */}
                    <div className="absolute bottom-10 left-0 right-0 text-center text-stone-500 font-serif tracking-widest text-sm uppercase">
                        Toque para abrir
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
