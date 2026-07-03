import { Head, useForm, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Send, X, Heart, MessageSquare, Image as ImageIcon, ArrowLeft, QrCode, Loader2, Upload } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { formatDateTime } from '@/Utils/dateUtils';

function PostItem({ post, guest }) {
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [isLiking, setIsLiking] = useState(false);

    const handleLike = () => {
        if (!guest || isLiking) return;
        setIsLiking(true);
        router.post(route('posts.like', post.id), {}, {
            preserveScroll: true,
            onFinish: () => setIsLiking(false)
        });
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !guest) return;
        
        router.post(route('posts.comments.store', post.id), {
            content: comment
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setComment('');
            }
        });
    };

    return (
        <motion.div 
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
                                {formatDateTime(post.created_at)}
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
                <button 
                    onClick={handleLike}
                    disabled={!guest || isLiking}
                    className={`flex items-center gap-1.5 transition-all active:scale-125 ${post.is_liked ? 'text-rose-500' : 'text-stone-400 hover:text-rose-500'}`}
                >
                    <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                    <span className="text-xs font-bold">{post.likes_count > 0 ? post.likes_count : ''} Amei</span>
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-1.5 transition-colors ${showComments ? 'text-stone-900' : 'text-stone-400 hover:text-stone-900'}`}
                >
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-xs font-bold">{post.comments_count > 0 ? post.comments_count : ''} Comentar</span>
                </button>
            </div>

            <AnimatePresence>
                {showComments && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-stone-50/50 border-t border-stone-100"
                    >
                        <div className="p-6 space-y-4">
                            {post.comments.map((c) => (
                                <div key={c.id} className="flex gap-3">
                                    <div className="w-8 h-8 bg-stone-200 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-stone-500">
                                        {c.guest_name[0]}
                                    </div>
                                    <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-stone-100 flex-1">
                                        <p className="text-[11px] font-bold text-stone-900 mb-0.5">{c.guest_name}</p>
                                        <p className="text-sm text-stone-600 leading-snug">{c.content}</p>
                                    </div>
                                </div>
                            ))}

                            {guest ? (
                                <form onSubmit={handleComment} className="flex gap-2 pt-2">
                                    <input 
                                        type="text"
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder="Escreva um comentário..."
                                        className="flex-1 bg-white border-stone-200 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-stone-900 outline-none border"
                                    />
                                    <button 
                                        disabled={!comment.trim()}
                                        className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-all hover:bg-stone-800"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            ) : (
                                <p className="text-center text-[10px] text-stone-400 py-2">
                                    Escaneie o QR Code para poder comentar.
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function Feed({ event, posts, guest }) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const qrFileInput = useRef<HTMLInputElement>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [isProcessingQR, setIsProcessingQR] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        event_id: event.id,
        guest_name: guest?.name || '',
        message: '',
        photo: null as File | null,
    });

    const extractUuid = (text: string) => {
        // Match UUID pattern in a URL or raw
        const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        const match = text.match(uuidRegex);
        return match ? match[0] : text;
    };

    const handleQrSuccess = (decodedText: string) => {
        const uuid = extractUuid(decodedText);
        if (uuid) {
            window.location.href = route('guest.login', uuid);
        } else {
            setScanError("QR Code inválido ou não reconhecido.");
        }
    };

    useEffect(() => {
        if (isScanning && !guest) {
            const startScanner = async () => {
                try {
                    if (!scannerRef.current) {
                        scannerRef.current = new Html5Qrcode("qr-reader");
                    }
                    await scannerRef.current.start(
                        { facingMode: "environment" },
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        handleQrSuccess,
                        () => {}
                    );
                } catch (err) {
                    setScanError("Não foi possível acessar a câmera.");
                    setIsScanning(false);
                }
            };
            startScanner();
        } else {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        }

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, [isScanning, guest]);

    const handleQrFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessingQR(true);
        setScanError(null);

        try {
            const scanner = new Html5Qrcode("qr-reader-hidden");
            const result = await scanner.scanFile(file, true);
            handleQrSuccess(result);
        } catch (err) {
            setScanError("Não foi possível ler um QR Code nesta imagem.");
        } finally {
            setIsProcessingQR(false);
        }
    };

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

            {/* Hidden reader for file scanning */}
            <div id="qr-reader-hidden" className="hidden"></div>

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
                
                {/* Post Creator / Auth */}
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
                    <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-xl overflow-hidden">
                        <AnimatePresence mode="wait">
                            {!isScanning && !isProcessingQR ? (
                                <motion.div 
                                    key="auth-prompt"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center"
                                >
                                    <QrCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <h3 className="font-serif text-xl mb-2">Quer participar do mural?</h3>
                                    <p className="text-stone-400 text-sm font-light mb-6">
                                        Escaneie o seu QR Code individual ou envie uma foto dele para poder postar.
                                    </p>
                                    
                                    <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => { setIsScanning(true); setScanError(null); }}
                                            className="w-full py-4 bg-white text-stone-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-100 transition-all shadow-lg"
                                        >
                                            <Camera className="w-5 h-5" />
                                            Abrir Scanner
                                        </button>
                                        
                                        <button 
                                            onClick={() => qrFileInput.current?.click()}
                                            className="w-full py-4 bg-stone-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-700 transition-all"
                                        >
                                            <Upload className="w-5 h-5" />
                                            Enviar Foto do QR Code
                                        </button>
                                        <input 
                                            type="file" 
                                            ref={qrFileInput} 
                                            onChange={handleQrFileChange} 
                                            className="hidden" 
                                            accept="image/*"
                                        />
                                    </div>
                                    
                                    {scanError && (
                                        <p className="mt-4 text-rose-400 text-xs font-medium">{scanError}</p>
                                    )}
                                </motion.div>
                            ) : isProcessingQR ? (
                                <motion.div 
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-8 text-center"
                                >
                                    <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin opacity-50" />
                                    <p className="text-stone-400 text-sm">Lendo QR Code...</p>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="scanner"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <div id="qr-reader" className="w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden border-2 border-stone-800 mb-6 bg-stone-950"></div>
                                    <button 
                                        onClick={() => setIsScanning(false)}
                                        className="text-stone-400 text-sm hover:text-white underline"
                                    >
                                        Cancelar Scanner
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                            <PostItem key={post.id} post={post} guest={guest} />
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

            <style>{`
                #qr-reader__scan_region {
                    background: #000 !important;
                }
                #qr-reader__dashboard_section_csr button {
                    display: none;
                }
                #qr-reader video {
                    object-fit: cover !important;
                    width: 100% !important;
                    height: 100% !important;
                }
            `}</style>
        </div>
    );
}
