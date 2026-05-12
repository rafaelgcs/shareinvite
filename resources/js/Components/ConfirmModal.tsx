import Modal from './Modal';
import { AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'info';
}

export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
}: ConfirmModalProps) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="relative overflow-hidden bg-white rounded-[3rem]">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-stone-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 p-10 sm:p-14">
                    {/* Header with Icon */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl rotate-3 ${
                                variant === 'danger' 
                                ? 'bg-red-50 text-red-500 shadow-red-100 border-2 border-red-100' 
                                : 'bg-[#0A0A0A] text-[#D4AF37] shadow-black/20 border-2 border-[#D4AF37]/20'
                            }`}
                        >
                            {variant === 'danger' ? <AlertTriangle className="w-10 h-10" /> : <Info className="w-10 h-10" />}
                        </motion.div>
                        
                        <h3 className="text-4xl font-serif font-black text-[#0A0A0A] tracking-tight mb-4">{title}</h3>
                        <p className="text-stone-500 text-lg leading-relaxed max-w-md mx-auto font-medium">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onClose}
                            className="flex-1 py-6 px-10 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-stone-400 hover:text-[#0A0A0A] hover:bg-stone-50 transition-all border-2 border-transparent hover:border-stone-100"
                        >
                            {cancelText}
                        </button>
                        
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`flex-[1.5] py-6 px-10 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 ${
                                variant === 'danger'
                                ? 'bg-red-600 text-white shadow-red-200'
                                : 'bg-[#0A0A0A] text-white shadow-black/20'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>

                {/* Close button for convenience */}
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 p-2 text-stone-300 hover:text-[#0A0A0A] transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </Modal>
    );
}
