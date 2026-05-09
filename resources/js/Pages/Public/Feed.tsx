import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Send, X, Heart, MessageSquare, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Feed({ event, posts, guest }) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        event_id: event.id,
        guest_name: guest?.name || '',
        message: '',
        photo: null as File | null,
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('posts.store'), {
            onSuccess: () => {
                reset('message', 'photo');
                setPreview(null);
            },
        });
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans pb-20">
            <Head title={`Mural de Fotos - ${event.title}`} />

            {/* Header */}
            <div className="bg-white border-b border-stone-200 sticky top-0 z-30 px-4 py-4 flex items-center justify-between">
                <Link href={route('invitation.show', event.slug)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="text-center">
                    <h1 className="font-serif text-lg text-stone-900">Mural do Evento</h1>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">{event.title}</p>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-6">
                
                {/* Post Creator */}
                {guest ? (
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-100">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-white font-serif italic">
                                    {guest.name[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-stone-900">{guest.name}</p>
                                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">Postando como convidado</p>
                                </div>
                            </div>

                            <textarea 
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                placeholder="Compartilhe uma mensagem ou um momento..."
                                className="w-full bg-stone-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-stone-900 outline-none min-h-[100px] resize-none"
                                required
                            />

                            <AnimatePresence>
                                {preview && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="relative rounded-2xl overflow-hidden aspect-video bg-stone-100"
                                    >
                                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                        <button 
                                            type="button"
                                            onClick={() => { setPreview(null); setData('photo', null); }}
                                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full backdrop-blur-md"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between pt-2">
                                <button 
                                    type="button"
                                    onClick={() => fileInput.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                    Foto
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInput} 
                                    onChange={handlePhotoChange} 
                                    className="hidden" 
                                    accept="image/*"
                                />

                                <button 
                                    disabled={processing || (!data.message && !data.photo)}
                                    className="px-6 py-2.5 bg-stone-900 text-white rounded-full text-sm font-bold shadow-lg hover:bg-stone-800 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? 'Enviando...' : (
                                        <>
                                            Postar <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] text-center shadow-xl">
                        <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-serif text-xl mb-2">Quer participar do mural?</h3>
                        <p className="text-stone-400 text-sm font-light mb-6">
                            Escaneie o seu QR Code individual para poder postar mensagens e fotos neste evento.
                        </p>
                    </div>
                )}

                {/* Feed Posts */}
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <div className="text-center py-20 opacity-30">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                            <p className="font-serif italic text-lg">Seja o primeiro a postar...</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <motion.div 
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-stone-100"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 font-serif italic text-lg">
                                                {post.guest_name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-stone-900">{post.guest_name}</p>
                                                <p className="text-[10px] text-stone-400 font-medium">
                                                    {new Date(post.created_at).toLocaleDateString('pt-BR')} às {new Date(post.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-stone-700 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                                        {post.message}
                                    </p>
                                </div>

                                {post.photo_url && (
                                    <div className="px-6 pb-6">
                                        <img 
                                            src={post.photo_url} 
                                            className="w-full rounded-2xl shadow-inner border border-stone-100" 
                                            alt="Post" 
                                        />
                                    </div>
                                )}

                                <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center gap-6">
                                    <button className="flex items-center gap-1.5 text-stone-400 hover:text-rose-500 transition-colors">
                                        <Heart className="w-5 h-5" />
                                        <span className="text-xs font-bold">Amei</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-stone-400 hover:text-stone-900 transition-colors">
                                        <MessageSquare className="w-5 h-5" />
                                        <span className="text-xs font-bold">Comentar</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Bottom Nav Hint */}
            <div className="fixed bottom-0 left-0 right-0 p-4 z-40 pointer-events-none">
                <div className="max-w-md mx-auto flex justify-center">
                    <Link 
                        href={route('invitation.show', event.slug)}
                        className="bg-white/80 backdrop-blur-xl border border-stone-200 px-6 py-3 rounded-full shadow-2xl pointer-events-auto flex items-center gap-2 text-stone-900 font-bold text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Voltar ao Convite
                    </Link>
                </div>
            </div>
        </div>
    );
}
