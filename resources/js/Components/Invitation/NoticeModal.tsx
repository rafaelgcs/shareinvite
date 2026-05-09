import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface NoticeModalProps {
    notices: Array<{ id: number; message: string; priority: string }>;
}

export default function NoticeModal({ notices }: NoticeModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (notices.length > 0) {
            // Slight delay to show after envelope opens
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [notices]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-serif text-stone-800 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-stone-600" />
                                    Avisos Importantes
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {notices.map((notice) => (
                                    <div 
                                        key={notice.id} 
                                        className={`p-4 rounded-xl text-sm ${
                                            notice.priority === 'high' 
                                                ? 'bg-red-50 text-red-800 border border-red-100' 
                                                : 'bg-stone-50 text-stone-700 border border-stone-100'
                                        }`}
                                    >
                                        {notice.message}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="mt-6 w-full py-3 px-4 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
                            >
                                Ciente
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
