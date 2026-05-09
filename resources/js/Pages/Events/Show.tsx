import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Settings, MapPin, Bell, Users, ExternalLink, Image as ImageIcon, Palette, Trash2, BookOpen, ShieldCheck, CheckCircle, Clock, Share2, Download, X, FileText, Upload } from 'lucide-react';
import Modal from '@/Components/Modal';
import DigitalTicket from '@/Components/Invitation/DigitalTicket';
import html2canvas from 'html2canvas';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import EnvelopeAnimation from '@/Components/Invitation/EnvelopeAnimation';

export default function Show({ event }) {
    const [activeTab, setActiveTab] = useState('settings');
    const [previewKey, setPreviewKey] = useState(0);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);
    const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
    const ticketRef = useRef<HTMLDivElement>(null);

    const handleOpenSharing = (guest: any) => {
        setSelectedGuest(guest);
        setIsSharingModalOpen(true);
    };

    const handleDownloadTicket = async () => {
        if (!ticketRef.current) return;
        try {
            const canvas = await html2canvas(ticketRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
                width: 320,
                onclone: (clonedDoc) => {
                    const ticket = clonedDoc.querySelector('[data-ticket="invitation"]');
                    if (ticket instanceof HTMLElement) {
                        ticket.style.transform = 'none';
                        ticket.style.margin = '0';
                        ticket.style.position = 'relative';
                    }
                }
            });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `convite-${selectedGuest.name.toLowerCase().replace(/\s+/g, '-')}.png`;
            link.click();
        } catch (error) {
            console.error("Error generating image:", error);
        }
    };

    const handleShareTicket = async () => {
        if (!ticketRef.current) return;
        try {
            const canvas = await html2canvas(ticketRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
                width: 320,
                onclone: (clonedDoc) => {
                    const ticket = clonedDoc.querySelector('[data-ticket="invitation"]');
                    if (ticket instanceof HTMLElement) {
                        ticket.style.transform = 'none';
                        ticket.style.margin = '0';
                        ticket.style.position = 'relative';
                    }
                }
            });
            
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                const file = new File([blob], 'convite.png', { type: 'image/png' });
                
                if (navigator.share) {
                    await navigator.share({
                        files: [file],
                        title: 'Convite Individual',
                        text: `Olá ${selectedGuest.name}, aqui está seu convite para o evento ${event.title}!`,
                    });
                } else {
                    const text = encodeURIComponent(`Olá ${selectedGuest.name}, aqui está seu convite para o evento ${event.title}!`);
                    window.open(`https://wa.me/${selectedGuest.phone?.replace(/\D/g, '')}?text=${text}`, '_blank');
                }
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const { data: designData, setData: setDesignData, post: postDesign, processing: processingDesign, recentlySuccessful: designSuccess } = useForm({
        _method: 'put',
        primary_color: event.primary_color || '#1c1917',
        secondary_color: event.secondary_color || '#fafaf9',
        text_color: event.text_color || '#1c1917',
        background_color: event.background_color || '#ffffff',
        animation_type: event.animation_type || 'envelope_3d',
        theme: event.theme || 'classic',
        rsvp_enabled: event.rsvp_enabled ?? true,
        rsvp_deadline: event.rsvp_deadline || '',
        allow_extra_guests: event.allow_extra_guests ?? true,
        max_extra_guests: event.max_extra_guests ?? 5,
        cover_image: null,
        logo: null,
    });

    const submitDesign = (e) => {
        e.preventDefault();
        postDesign(route('events.updateDesign', event.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const { data: locData, setData: setLocData, post: postLoc, processing: locProcessing, reset: resetLoc } = useForm({
        name: '',
        address: '',
        notes: '',
    });

    const submitLocation = (e) => {
        e.preventDefault();
        postLoc(route('events.locations.store', event.id), {
            onSuccess: () => resetLoc()
        });
    };

    const { data: notData, setData: setNotData, post: postNot, processing: notProcessing, reset: resetNot } = useForm({
        message: '',
        priority: 'normal',
    });

    const submitNotice = (e) => {
        e.preventDefault();
        postNot(route('events.notices.store', event.id), {
            onSuccess: () => resetNot()
        });
    };

    const { data: guideData, setData: setGuideData, post: postGuide, processing: guideProcessing, reset: resetGuide } = useForm({
        title: '',
        content: '',
        type: 'other',
        file: null as File | null,
    });

    const submitGuide = (e) => {
        e.preventDefault();
        postGuide(route('events.guides.store', event.id), {
            onSuccess: () => resetGuide()
        });
    };

    const deleteGuide = (id) => {
        if (confirm('Remover guia?')) {
            router.delete(route('events.guides.destroy', [event.id, id]));
        }
    };

    const deleteLocation = (id) => {
        if (confirm('Remover local?')) {
            router.delete(route('events.locations.destroy', [event.id, id]));
        }
    };

    const deleteNotice = (id) => {
        if (confirm('Remover aviso?')) {
            router.delete(route('events.notices.destroy', [event.id, id]));
        }
    };

    const tabs = [
        { id: 'settings', label: 'Design e Capa', icon: Palette },
        { id: 'locations', label: 'Locais', icon: MapPin },
        { id: 'notices', label: 'Avisos', icon: Bell },
        { id: 'guides', label: 'Guias e Dress Code', icon: BookOpen },
        { id: 'guests', label: 'Lista de Presença', icon: Users },
    ];

    const animationPreviews = {
        envelope_3d: 'https://cdn-icons-png.flaticon.com/512/3233/3233076.png', // placeholder for visual
        gate_fold: 'https://cdn-icons-png.flaticon.com/512/8205/8205322.png',
        slipcase: 'https://cdn-icons-png.flaticon.com/512/10332/10332309.png',
        wax_seal: 'https://cdn-icons-png.flaticon.com/512/2857/2857508.png',
        fade_in: 'https://cdn-icons-png.flaticon.com/512/3286/3286047.png',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                event.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-stone-200 text-stone-700'
                            }`}>
                                {event.status === 'active' ? 'Ativo' : 'Rascunho'}
                            </span>
                            <span className="text-sm text-stone-500 font-mono">
                                shareinvite.com/{event.slug}
                            </span>
                        </div>
                        <h2 className="font-serif text-3xl text-stone-900 leading-tight">
                            {event.title}
                        </h2>
                    </div>
                    <div className="flex gap-3">
                        <Link 
                            href={route('events.checkIn', event.id)}
                            className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Scanner de Entrada
                        </Link>
                        <Link 
                            href={`/${event.slug}`} 
                            target="_blank"
                            className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors shadow-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Ver Convite Real
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Gerenciar: ${event.title}`} />

            <div className="py-12 bg-stone-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Tabs Navigation */}
                    <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-stone-100">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                                        isActive 
                                        ? 'bg-stone-900 text-white shadow-md' 
                                        : 'text-stone-600 hover:bg-stone-100'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content Areas */}
                    <div className="bg-white shadow-xl rounded-3xl border border-stone-100 min-h-[500px] p-8">
                        {activeTab === 'settings' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                                
                                <form onSubmit={submitDesign} className="space-y-8">
                                    {/* Cores */}
                                    <div>
                                        <h3 className="font-serif text-2xl text-stone-900 mb-2">Paleta de Cores Expandida</h3>
                                        <p className="text-stone-500 mb-6">Defina as cores que irão compor todos os detalhes da identidade visual do seu convite.</p>
                                        
                                        {/* Combinações Sugeridas */}
                                        <div className="mb-8">
                                            <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
                                                <Palette className="w-4 h-4" />
                                                Combinações Elegantes Sugeridas
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {[
                                                    { name: 'Ouro Real', p: '#D4AF37', s: '#FCFBF8', t: '#2C2C2C', b: '#F0EEE4' },
                                                    { name: 'Rose Gold', p: '#B76E79', s: '#FDF5E6', t: '#4A3B3C', b: '#F5EBE1' },
                                                    { name: 'Azul Serenity', p: '#4A6FA5', s: '#F0F4F8', t: '#1F2E47', b: '#E1E8F0' },
                                                    { name: 'Verde Sálvia', p: '#7BA05B', s: '#F9FAED', t: '#3A4A28', b: '#ECEEDB' },
                                                    { name: 'Terracota', p: '#C85A43', s: '#FAF0E6', t: '#5C281D', b: '#F0DFD1' },
                                                    { name: 'Clássico Black', p: '#1C1917', s: '#FAFAF9', t: '#1C1917', b: '#EAEAEA' },
                                                ].map(palette => (
                                                    <button
                                                        key={palette.name}
                                                        type="button"
                                                        onClick={() => {
                                                            setDesignData({
                                                                ...designData,
                                                                primary_color: palette.p,
                                                                secondary_color: palette.s,
                                                                text_color: palette.t,
                                                                background_color: palette.b
                                                            });
                                                        }}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all shadow-sm hover:shadow-md ${
                                                            (designData.primary_color || '').toLowerCase() === palette.p.toLowerCase() && (designData.secondary_color || '').toLowerCase() === palette.s.toLowerCase() && (designData.text_color || '').toLowerCase() === palette.t.toLowerCase() && (designData.background_color || '').toLowerCase() === palette.b.toLowerCase()
                                                            ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900/10'
                                                            : 'border-stone-200 bg-white hover:border-stone-300'
                                                        }`}
                                                        title={`Aplicar paleta ${palette.name}`}
                                                    >
                                                        <div className="flex -space-x-1.5">
                                                            <div className="w-5 h-5 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1)] z-30" style={{ backgroundColor: palette.p }} />
                                                            <div className="w-5 h-5 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1)] z-20" style={{ backgroundColor: palette.s }} />
                                                            <div className="w-5 h-5 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1)] z-10" style={{ backgroundColor: palette.t }} />
                                                            <div className="w-5 h-5 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1)] z-0" style={{ backgroundColor: palette.b }} />
                                                        </div>
                                                        <span className="text-xs font-medium text-stone-700 whitespace-nowrap">{palette.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="border border-stone-200 p-6 rounded-3xl bg-white flex flex-col gap-4 shadow-sm hover:border-stone-300 transition-colors">
                                                <div>
                                                    <InputLabel value="Cor Principal (Destaques e Cera)" />
                                                    <p className="text-xs text-stone-400 mt-1">Selo de cera e botões de destaque.</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm border border-stone-200 shrink-0 cursor-pointer" style={{ backgroundColor: designData.primary_color }}>
                                                        <input 
                                                            type="color" 
                                                            value={/^#[0-9A-Fa-f]{6}$/i.test(designData.primary_color) ? designData.primary_color : '#000000'}
                                                            onChange={e => setDesignData('primary_color', e.target.value)}
                                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 bg-transparent p-0 opacity-0"
                                                        />
                                                    </div>
                                                    <TextInput 
                                                        className="w-full font-mono text-sm uppercase bg-stone-50"
                                                        value={designData.primary_color}
                                                        onChange={e => {
                                                            let val = e.target.value;
                                                            if (val.length > 0 && !val.startsWith('#')) val = '#' + val;
                                                            setDesignData('primary_color', val);
                                                        }}
                                                        maxLength={7}
                                                        placeholder="#000000"
                                                    />
                                                </div>
                                            </div>
                                            <div className="border border-stone-200 p-6 rounded-3xl bg-white flex flex-col gap-4 shadow-sm hover:border-stone-300 transition-colors">
                                                <div>
                                                    <InputLabel value="Cor Secundária (Fundo e Envelope)" />
                                                    <p className="text-xs text-stone-400 mt-1">Cor do papel interno e do envelope virtual.</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm border border-stone-200 shrink-0 cursor-pointer" style={{ backgroundColor: designData.secondary_color }}>
                                                        <input 
                                                            type="color" 
                                                            value={/^#[0-9A-Fa-f]{6}$/i.test(designData.secondary_color) ? designData.secondary_color : '#ffffff'}
                                                            onChange={e => setDesignData('secondary_color', e.target.value)}
                                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 bg-transparent p-0 opacity-0"
                                                        />
                                                    </div>
                                                    <TextInput 
                                                        className="w-full font-mono text-sm uppercase bg-stone-50"
                                                        value={designData.secondary_color}
                                                        onChange={e => {
                                                            let val = e.target.value;
                                                            if (val.length > 0 && !val.startsWith('#')) val = '#' + val;
                                                            setDesignData('secondary_color', val);
                                                        }}
                                                        maxLength={7}
                                                        placeholder="#FFFFFF"
                                                    />
                                                </div>
                                            </div>
                                            <div className="border border-stone-200 p-6 rounded-3xl bg-white flex flex-col gap-4 shadow-sm hover:border-stone-300 transition-colors">
                                                <div>
                                                    <InputLabel value="Cor do Texto" />
                                                    <p className="text-xs text-stone-400 mt-1">Textos principais, títulos e informações do evento.</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm border border-stone-200 shrink-0 cursor-pointer" style={{ backgroundColor: designData.text_color }}>
                                                        <input 
                                                            type="color" 
                                                            value={/^#[0-9A-Fa-f]{6}$/i.test(designData.text_color) ? designData.text_color : '#000000'}
                                                            onChange={e => setDesignData('text_color', e.target.value)}
                                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 bg-transparent p-0 opacity-0"
                                                        />
                                                    </div>
                                                    <TextInput 
                                                        className="w-full font-mono text-sm uppercase bg-stone-50"
                                                        value={designData.text_color}
                                                        onChange={e => {
                                                            let val = e.target.value;
                                                            if (val.length > 0 && !val.startsWith('#')) val = '#' + val;
                                                            setDesignData('text_color', val);
                                                        }}
                                                        maxLength={7}
                                                        placeholder="#000000"
                                                    />
                                                </div>
                                            </div>
                                            <div className="border border-stone-200 p-6 rounded-3xl bg-white flex flex-col gap-4 shadow-sm hover:border-stone-300 transition-colors">
                                                <div>
                                                    <InputLabel value="Cor de Fundo da Página" />
                                                    <p className="text-xs text-stone-400 mt-1">Fundo visível fora do envelope/papel.</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm border border-stone-200 shrink-0 cursor-pointer" style={{ backgroundColor: designData.background_color }}>
                                                        <input 
                                                            type="color" 
                                                            value={/^#[0-9A-Fa-f]{6}$/i.test(designData.background_color) ? designData.background_color : '#ffffff'}
                                                            onChange={e => setDesignData('background_color', e.target.value)}
                                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 bg-transparent p-0 opacity-0"
                                                        />
                                                    </div>
                                                    <TextInput 
                                                        className="w-full font-mono text-sm uppercase bg-stone-50"
                                                        value={designData.background_color}
                                                        onChange={e => {
                                                            let val = e.target.value;
                                                            if (val.length > 0 && !val.startsWith('#')) val = '#' + val;
                                                            setDesignData('background_color', val);
                                                        }}
                                                        maxLength={7}
                                                        placeholder="#FFFFFF"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tema Visual (Pós-Envelope) */}
                                    <div className="pt-8 border-t border-stone-100">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="font-serif text-2xl text-stone-900 mb-2">Tema do Convite</h3>
                                                <p className="text-stone-500">Escolha o layout e a identidade visual da página interna do convite.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {[
                                                { id: 'classic', label: 'Clássico', desc: 'Tradicional.', icon: '📜' },
                                                { id: 'modern', label: 'Moderno', desc: 'Clean.', icon: '✨' },
                                                { id: 'floral', label: 'Floral', desc: 'Romântico.', icon: '🌸' },
                                                { id: 'dark', label: 'Dark Mode', desc: 'Sleek.', icon: '🌙' },
                                                { id: 'vintage', label: 'Vintage', desc: 'Nostálgico.', icon: '🕰️' },
                                            ].map((themeOpt) => (
                                                <div 
                                                    key={themeOpt.id}
                                                    onClick={() => setDesignData('theme', themeOpt.id)}
                                                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex flex-col items-center text-center ${
                                                        designData.theme === themeOpt.id 
                                                        ? 'border-stone-900 bg-stone-50 shadow-sm' 
                                                        : 'border-stone-200 hover:border-stone-300'
                                                    }`}
                                                >
                                                    <div className="text-2xl mb-2">{themeOpt.icon}</div>
                                                    <span className="font-medium text-stone-900 block text-sm mb-1">{themeOpt.label}</span>
                                                    <span className="text-xs text-stone-500">{themeOpt.desc}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-stone-50 rounded-[40px] p-8 md:p-12 border border-stone-200 mt-12">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                <div>
                                                    <h3 className="font-serif text-2xl text-stone-900 mb-2">Configurações de RSVP</h3>
                                                    <p className="text-stone-500">Controle como e até quando seus convidados podem confirmar presença.</p>
                                                </div>
                                                
                                                <div className="flex items-center gap-4">
                                                     <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={designData.rsvp_enabled}
                                                            onChange={e => setDesignData('rsvp_enabled', e.target.checked)}
                                                        />
                                                        <div className="w-14 h-7 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-stone-900"></div>
                                                        <span className="ms-3 text-sm font-medium text-stone-900">
                                                            {designData.rsvp_enabled ? 'RSVP Habilitado' : 'RSVP Desabilitado'}
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            {designData.rsvp_enabled && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-8 pt-8 border-t border-stone-200"
                                                >
                                                    <div className="max-w-xs">
                                                        <InputLabel value="Data Limite para Confirmação" />
                                                        <input 
                                                            type="date"
                                                            className="mt-1 block w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none"
                                                            value={designData.rsvp_deadline}
                                                            onChange={e => setDesignData('rsvp_deadline', e.target.value)}
                                                        />
                                                        <p className="mt-2 text-xs text-stone-500 italic">Após esta data, o botão de confirmação ficará desabilitado no convite.</p>
                                                    </div>

                                                    <div className="mt-8 pt-8 border-t border-stone-100 grid md:grid-cols-2 gap-8">
                                                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
                                                            <div>
                                                                <InputLabel value="Permitir Acompanhantes" />
                                                                <p className="text-xs text-stone-500">Habilita o campo de convidados extras.</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="sr-only peer" 
                                                                    checked={designData.allow_extra_guests}
                                                                    onChange={e => setDesignData('allow_extra_guests', e.target.checked)}
                                                                />
                                                                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                                                            </label>
                                                        </div>

                                                        {designData.allow_extra_guests && (
                                                            <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
                                                                <InputLabel value="Máximo de Acompanhantes" />
                                                                <select 
                                                                    className="mt-1 block w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none bg-stone-50 text-sm"
                                                                    value={designData.max_extra_guests}
                                                                    onChange={e => setDesignData('max_extra_guests', parseInt(e.target.value))}
                                                                >
                                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                                        <option key={n} value={n}>{n} acompanhante{n > 1 ? 's' : ''}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                    </div>


                                    {/* Animação com Preview Integrado */}
                                    <div className="pt-8 border-t border-stone-100">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="font-serif text-2xl text-stone-900 mb-2">Estilo de Abertura (Papelaria Fina)</h3>
                                                <p className="text-stone-500">Como seus convidados serão recebidos ao abrir o link. Veja o preview na lateral.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-3 gap-8">
                                            {/* Coluna de Seleção */}
                                            <div className="md:col-span-2 space-y-3">
                                                {[
                                                    { id: 'envelope_3d', label: 'Envelope Clássico 3D', desc: 'Envelope virtual tradicional com aba superior que se abre.' },
                                                    { id: 'gate_fold', label: 'Convite em Janela (Portão)', desc: 'Duas abas que se abrem horizontalmente revelando o interior.' },
                                                    { id: 'slipcase', label: 'Luva Deslizante', desc: 'O convite é puxado elegantemente para cima de dentro de um estojo.' },
                                                    { id: 'wax_seal', label: 'Quebra de Selo de Cera', desc: 'Foco no selo de cera que se rompe antes da abertura.' },
                                                    { id: 'fade_in', label: 'Fade Minimalista', desc: 'Transição suave, limpa e direta para a capa do convite.' },
                                                ].map((anim) => (
                                                    <div 
                                                        key={anim.id}
                                                        onClick={() => {
                                                            setDesignData('animation_type', anim.id);
                                                            setPreviewKey(prev => prev + 1);
                                                        }}
                                                        className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                                                            designData.animation_type === anim.id 
                                                            ? 'border-stone-900 bg-stone-50' 
                                                            : 'border-stone-200 hover:border-stone-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${designData.animation_type === anim.id ? 'border-stone-900' : 'border-stone-300'}`}>
                                                                {designData.animation_type === anim.id && <div className="w-2.5 h-2.5 bg-stone-900 rounded-full" />}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-stone-900 block">{anim.label}</span>
                                                                <span className="text-sm text-stone-500">{anim.desc}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Preview Simulator */}
                                            <div className="bg-stone-100 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden h-[400px]">
                                                <EnvelopeAnimation 
                                                    key={previewKey}
                                                    isPreview={true}
                                                    animationType={designData.animation_type}
                                                    primaryColor={designData.primary_color}
                                                    secondaryColor={designData.secondary_color}
                                                    textColor={designData.text_color}
                                                    backgroundColor={designData.background_color}
                                                    title={event.title}
                                                    logo={designData.logo ? URL.createObjectURL(designData.logo) : event.logo}
                                                >
                                                    <div className="w-full h-full flex items-center justify-center bg-white p-4 text-xs font-serif text-stone-400 text-center">
                                                        Este é o conteúdo do convite (RSVP, Endereços, etc).
                                                    </div>
                                                </EnvelopeAnimation>
                                                
                                                <div className="absolute top-4 left-0 right-0 z-50 pointer-events-none">
                                                    <p className="text-stone-900 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full inline-block font-serif text-xs uppercase tracking-widest shadow-sm">Preview Interativo</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Imagens */}
                                    <div className="pt-8 border-t border-stone-100">
                                        <h3 className="font-serif text-2xl text-stone-900 mb-2">Imagens do Convite</h3>
                                        <p className="text-stone-500 mb-6">Configure as imagens que aparecerão no envelope e na capa principal.</p>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Cover Image Upload */}
                                            <label className="border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer relative overflow-hidden group min-h-[250px]">
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={e => setDesignData('cover_image', e.target.files[0])}
                                                />
                                                {(designData.cover_image || event.cover_image) ? (
                                                    <>
                                                        <img 
                                                            src={designData.cover_image ? URL.createObjectURL(designData.cover_image) : event.cover_image} 
                                                            alt="Capa" 
                                                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity"
                                                        />
                                                        <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-medium text-sm text-stone-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Trocar Capa
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                                            <ImageIcon className="w-8 h-8 text-stone-400" />
                                                        </div>
                                                        <p className="font-medium text-stone-900">Upload Capa Principal</p>
                                                        <p className="text-sm text-stone-500 mt-1">Recomendado: 1080x1920px (Vertical)</p>
                                                    </>
                                                )}
                                            </label>

                                            {/* Logo/Seal Upload */}
                                            <label className="border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer relative overflow-hidden group min-h-[250px]">
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={e => setDesignData('logo', e.target.files[0])}
                                                />
                                                {(designData.logo || event.logo) ? (
                                                    <>
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                            <img 
                                                                src={designData.logo ? URL.createObjectURL(designData.logo) : event.logo} 
                                                                alt="Logo" 
                                                                className="w-32 h-32 object-cover rounded-full shadow-md opacity-80 group-hover:opacity-50 transition-opacity"
                                                            />
                                                        </div>
                                                        <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-medium text-sm text-stone-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Trocar Monograma
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-serif font-bold text-2xl text-stone-300">
                                                            {event.title?.[0] || 'M'}
                                                        </div>
                                                        <p className="font-medium text-stone-900">Upload do Monograma/Selo</p>
                                                        <p className="text-sm text-stone-500 mt-1">Será usado no selo de cera e capa (Fundo transparente).</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-stone-100 flex items-center gap-4">
                                        <PrimaryButton disabled={processingDesign}>
                                            {processingDesign ? 'Salvando...' : 'Salvar Design'}
                                        </PrimaryButton>
                                        {designSuccess && (
                                            <span className="text-sm text-green-600 font-medium">Salvo com sucesso!</span>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'locations' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="mb-8">
                                    <h3 className="font-serif text-2xl text-stone-900 mb-2">Locais do Evento</h3>
                                    <p className="text-stone-500">Adicione os endereços onde seu evento ocorrerá (Cerimônia, Festa, etc).</p>
                                </div>

                                <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 mb-8">
                                    <h4 className="font-medium text-stone-900 mb-4">Novo Endereço</h4>
                                    <form onSubmit={submitLocation} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel value="Nome do Local (ex: Cerimônia Religiosa)" />
                                                <TextInput className="mt-1 w-full" value={locData.name} onChange={e => setLocData('name', e.target.value)} required />
                                            </div>
                                            <div>
                                                <InputLabel value="Endereço Completo" />
                                                <TextInput className="mt-1 w-full" value={locData.address} onChange={e => setLocData('address', e.target.value)} required />
                                            </div>
                                            <div className="md:col-span-2">
                                                <InputLabel value="Anotações / Dicas de Chegada" />
                                                <TextInput className="mt-1 w-full" value={locData.notes} onChange={e => setLocData('notes', e.target.value)} />
                                            </div>
                                        </div>
                                        <PrimaryButton disabled={locProcessing}>Adicionar Local</PrimaryButton>
                                    </form>
                                </div>

                                {event.locations?.length === 0 ? (
                                    <div className="text-center py-12 border border-stone-200 rounded-3xl bg-stone-50">
                                        <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                                        <p className="text-stone-500">Nenhum local cadastrado ainda.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {event.locations?.map((loc) => (
                                            <div key={loc.id} className="flex justify-between items-center p-5 border border-stone-200 rounded-2xl bg-white hover:border-stone-300 transition-all">
                                                <div>
                                                    <h5 className="font-medium text-stone-900">{loc.name}</h5>
                                                    <p className="text-sm text-stone-500 mt-1">{loc.address}</p>
                                                    {loc.notes && <p className="text-xs text-stone-400 mt-1 italic">{loc.notes}</p>}
                                                </div>
                                                <button onClick={() => deleteLocation(loc.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'notices' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="mb-8">
                                    <h3 className="font-serif text-2xl text-stone-900 mb-2">Avisos Importantes</h3>
                                    <p className="text-stone-500">Alertas que aparecerão logo no início do convite (Ex: Traje Obrigatório).</p>
                                </div>

                                <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 mb-8">
                                    <form onSubmit={submitNotice} className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="flex-1 w-full">
                                            <InputLabel value="Mensagem do Aviso" />
                                            <TextInput className="mt-1 w-full" value={notData.message} onChange={e => setNotData('message', e.target.value)} required placeholder="Ex: Estacionamento com manobrista gratuito." />
                                        </div>
                                        <div className="w-full md:w-48">
                                            <InputLabel value="Prioridade" />
                                            <select 
                                                className="mt-1 block w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none"
                                                value={notData.priority} 
                                                onChange={e => setNotData('priority', e.target.value)}
                                            >
                                                <option value="low">Baixa</option>
                                                <option value="normal">Normal</option>
                                                <option value="high">Alta (Urgente)</option>
                                            </select>
                                        </div>
                                        <PrimaryButton disabled={notProcessing}>Adicionar</PrimaryButton>
                                    </form>
                                </div>

                                {event.notices?.length === 0 ? (
                                    <div className="text-center py-12 border border-stone-200 rounded-3xl bg-stone-50">
                                        <Bell className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                                        <p className="text-stone-500">Nenhum aviso configurado.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {event.notices?.map((notice) => (
                                            <div key={notice.id} className="flex justify-between items-center p-5 border border-stone-200 rounded-2xl bg-white">
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${
                                                        notice.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                                        notice.priority === 'normal' ? 'bg-stone-200 text-stone-800' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {notice.priority}
                                                    </span>
                                                    <p className="text-stone-900">{notice.message}</p>
                                                </div>
                                                <button onClick={() => deleteNotice(notice.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                        {activeTab === 'guides' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="mb-8">
                                    <h3 className="font-serif text-2xl text-stone-900 mb-2">Guias e Dress Code</h3>
                                    <p className="text-stone-500">Crie guias informativos para seus convidados, padrinhos e madrinhas.</p>
                                </div>

                                <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 mb-8">
                                    <form onSubmit={submitGuide} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="w-full">
                                                <InputLabel value="Título do Guia" />
                                                <TextInput className="mt-1 w-full" value={guideData.title} onChange={e => setGuideData('title', e.target.value)} required placeholder="Ex: Dress Code / Traje" />
                                            </div>
                                            <div className="w-full">
                                                <InputLabel value="Tipo de Guia" />
                                                <select 
                                                    className="mt-1 block w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none"
                                                    value={guideData.type} 
                                                    onChange={e => setGuideData('type', e.target.value)}
                                                >
                                                    <option value="dress_code">Dress Code</option>
                                                    <option value="best_man">Padrinhos</option>
                                                    <option value="bridesmaid">Madrinhas</option>
                                                    <option value="other">Outro Guia</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <InputLabel value="Conteúdo do Guia" />
                                                <textarea 
                                                    className="mt-1 block w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none min-h-[120px]"
                                                    value={guideData.content}
                                                    onChange={e => setGuideData('content', e.target.value)}
                                                    required
                                                    placeholder="Descreva as orientações aqui..."
                                                ></textarea>
                                            </div>

                                            <div className="md:col-span-2">
                                                <InputLabel value="Anexo (Imagem ou PDF)" />
                                                <div className="mt-2 flex items-center gap-4">
                                                    <label className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors shadow-sm">
                                                        <Upload className="w-4 h-4 text-stone-500" />
                                                        <span className="text-sm text-stone-600">
                                                            {guideData.file ? guideData.file.name : 'Selecionar arquivo...'}
                                                        </span>
                                                        <input 
                                                            type="file" 
                                                            className="hidden" 
                                                            accept="image/*,.pdf"
                                                            onChange={e => setGuideData('file', e.target.files?.[0] || null)}
                                                        />
                                                    </label>
                                                    {guideData.file && (
                                                        <button 
                                                            type="button"
                                                            onClick={() => setGuideData('file', null)}
                                                            className="text-xs text-red-500 hover:underline"
                                                        >
                                                            Remover
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs text-stone-400 italic">Opcional. Ideal para mapas, inspirações de traje ou manuais detalhados.</p>
                                            </div>
                                        </div>
                                        <PrimaryButton disabled={guideProcessing}>Adicionar Guia</PrimaryButton>
                                    </form>
                                </div>

                                {event.guides?.length === 0 ? (
                                    <div className="text-center py-12 border border-stone-200 rounded-3xl bg-stone-50">
                                        <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                                        <p className="text-stone-500">Nenhum guia criado ainda.</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {event.guides?.map((guide) => (
                                            <div key={guide.id} className="p-6 border border-stone-200 rounded-3xl bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                                                <div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                                                            {guide.type.replace('_', ' ')}
                                                        </span>
                                                        <button onClick={() => deleteGuide(guide.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <h4 className="font-serif text-xl text-stone-900 mb-3">{guide.title}</h4>
                                                    <p className="text-stone-600 text-sm whitespace-pre-wrap">{guide.content}</p>
                                                    
                                                    {guide.file_path && (
                                                        <div className="mt-4 pt-4 border-t border-stone-100">
                                                            <a 
                                                                href={guide.file_path} 
                                                                target="_blank" 
                                                                className="flex items-center gap-2 text-stone-900 hover:text-stone-600 transition-colors group"
                                                            >
                                                                <div className="w-10 h-10 bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-stone-100">
                                                                    {guide.file_path.toLowerCase().endsWith('.pdf') ? (
                                                                        <FileText className="w-5 h-5 text-red-500" />
                                                                    ) : (
                                                                        <ImageIcon className="w-5 h-5 text-blue-500" />
                                                                    )}
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-xs font-bold uppercase tracking-wider">Ver Anexo</p>
                                                                    <p className="text-[10px] text-stone-400">Clique para abrir</p>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'guests' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div>
                                    <h3 className="font-serif text-2xl text-stone-900 mb-2">Lista de Presença (RSVP)</h3>
                                    <p className="text-stone-500">Acompanhe quem confirmou presença no seu evento.</p>
                                </div>
                                <div className="mt-8 overflow-x-auto border border-stone-200 rounded-2xl">
                                    <table className="w-full text-left text-sm text-stone-600">
                                        <thead className="bg-stone-50 border-b border-stone-200 text-stone-900 uppercase text-xs font-semibold">
                                            <tr>
                                                <th className="px-6 py-4">Nome do Convidado</th>
                                                <th className="px-6 py-4 text-center">Acompanhantes</th>
                                                <th className="px-6 py-4">Data da Confirmação</th>
                                                <th className="px-6 py-4">Status de Entrada</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {event.guests?.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-stone-500">
                                                        Nenhuma confirmação recebida até agora.
                                                    </td>
                                                </tr>
                                            ) : (
                                                event.guests?.map((guest) => (
                                                    <tr key={guest.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-stone-900">{guest.name}</div>
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="text-[10px] text-stone-400">{guest.email || 'E-mail não informado'}</div>
                                                                {guest.phone && <div className="text-[10px] text-stone-400 flex items-center gap-1">📱 {guest.phone}</div>}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-md text-xs font-bold">
                                                                +{guest.extra_guests}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-stone-500 text-xs">
                                                            {new Date(guest.confirmed_at).toLocaleDateString('pt-BR')} às {new Date(guest.confirmed_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {guest.checked_in_at ? (
                                                                <div className="flex items-center gap-2 text-green-600">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    <span className="text-xs font-bold uppercase tracking-wider">Presente</span>
                                                                    <span className="text-[10px] text-green-400 font-normal">
                                                                        ({new Date(guest.checked_in_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center gap-2 text-stone-300">
                                                                        <Clock className="w-4 h-4" />
                                                                        <span className="text-xs font-bold uppercase tracking-wider">Aguardando</span>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => handleOpenSharing(guest)}
                                                                        className="ml-auto p-2 text-stone-400 hover:text-stone-900 transition-colors"
                                                                        title="Compartilhar Convite"
                                                                    >
                                                                        <Share2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </div>

                </div>
            </div>

            <Modal show={isSharingModalOpen} onClose={() => setIsSharingModalOpen(false)} maxWidth="full">
                <div className="flex flex-col h-screen sm:h-[90vh]">
                    <div className="p-8 pb-4 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-30">
                        <div>
                            <h3 className="font-serif text-3xl text-stone-900">Enviar Convite Individual</h3>
                            <p className="text-stone-500 text-base">Compartilhe o convite personalizado com {selectedGuest?.name}</p>
                        </div>
                        <button onClick={() => setIsSharingModalOpen(false)} className="p-3 text-stone-400 hover:text-stone-600 transition-colors bg-stone-50 rounded-full">
                            <X className="w-8 h-8" />
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto flex-1 bg-stone-50">
                        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            {/* Left Side: Ticket Preview */}
                            <div className="flex flex-col items-center">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-6">Pré-visualização do Convite</p>
                                <div className="shadow-2xl rounded-[2.5rem] bg-white p-2">
                                    <DigitalTicket 
                                        ref={ticketRef}
                                        guest={selectedGuest}
                                        event={event}
                                    />
                                </div>
                            </div>

                            {/* Right Side: Actions */}
                            <div className="space-y-10 py-4">
                                <section>
                                    <h4 className="text-stone-900 font-bold mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
                                        Ações de Arquivo
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={handleDownloadTicket}
                                            className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-stone-100 text-stone-700 p-8 rounded-3xl font-bold hover:border-stone-200 transition-all shadow-sm group"
                                        >
                                            <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                                                <Download className="w-6 h-6" />
                                            </div>
                                            <span>Baixar Imagem</span>
                                        </button>
                                        <button
                                            onClick={handleShareTicket}
                                            className="flex flex-col items-center justify-center gap-3 bg-stone-900 text-white p-8 rounded-3xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 group"
                                        >
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                <Share2 className="w-6 h-6" />
                                            </div>
                                            <span>{navigator.share ? 'Compartilhar' : 'WhatsApp'}</span>
                                        </button>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-stone-900 font-bold mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
                                        Atalhos Rápidos de Envio
                                    </h4>
                                    <div className="space-y-3">
                                        <a 
                                            href={`https://wa.me/${selectedGuest?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selectedGuest?.name}, segue seu convite para ${event.title}: `)}`}
                                            target="_blank"
                                            className="flex items-center justify-between p-6 bg-white border border-stone-100 rounded-2xl hover:bg-stone-50 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                                    <Share2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-stone-800">WhatsApp</p>
                                                    <p className="text-xs text-stone-400">{selectedGuest?.phone || 'Número não informado'}</p>
                                                </div>
                                            </div>
                                            <ExternalLink className="w-5 h-5 text-stone-300 group-hover:text-stone-900 transition-colors" />
                                        </a>

                                        <a 
                                            href={`mailto:${selectedGuest?.email}?subject=${encodeURIComponent(`Seu convite para ${event.title}`)}&body=${encodeURIComponent(`Olá ${selectedGuest?.name}, segue seu convite individual para o evento.`)}`}
                                            className="flex items-center justify-between p-6 bg-white border border-stone-100 rounded-2xl hover:bg-stone-50 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                                    <ExternalLink className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-stone-800">E-mail</p>
                                                    <p className="text-xs text-stone-400">{selectedGuest?.email || 'E-mail não informado'}</p>
                                                </div>
                                            </div>
                                            <ExternalLink className="w-5 h-5 text-stone-300 group-hover:text-stone-900 transition-colors" />
                                        </a>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
