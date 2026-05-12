import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { 
    Settings, MapPin, Bell, Users, ExternalLink, Image as ImageIcon, 
    Palette, Trash2, BookOpen, ShieldCheck, CheckCircle, Clock, 
    Share2, Download, X, FileText, Upload, Search, ChevronUp, 
    ChevronDown, ArrowUpDown, Filter, Sparkles, LayoutDashboard 
} from 'lucide-react';
import Modal from '@/Components/Modal';
import DigitalTicket from '@/Components/Invitation/DigitalTicket';
import html2canvas from 'html2canvas';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import EnvelopeAnimation from '@/Components/Invitation/EnvelopeAnimation';

import { Event, Guest } from '@/types';

const SortIcon = ({ sortConfig, columnKey }: { sortConfig: any, columnKey: string }) => {
    if (sortConfig.key !== columnKey) {
        return <ArrowUpDown className="w-3.5 h-3.5 text-stone-300 opacity-0 group-hover:opacity-100 transition-all" />;
    }
    return sortConfig.direction === 'asc' 
        ? <ChevronUp className="w-3.5 h-3.5 text-[#D4AF37] animate-in fade-in zoom-in duration-300" /> 
        : <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] animate-in fade-in zoom-in duration-300" />;
};

export default function Show({ event }: { event: Event }) {
    const guestList = Array.isArray(event.guests) ? event.guests : [] as Guest[];
    const [activeTab, setActiveTab] = useState('settings');
    const [previewKey, setPreviewKey] = useState(0);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);
    const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'confirmed_at', direction: 'desc' });
    const ticketRef = useRef<HTMLDivElement>(null);

    const handleSort = (key: string) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const filteredAndSortedGuests = guestList
        .filter((guest) => {
            const matchesSearch = 
                guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (guest.email && guest.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (guest.phone && guest.phone.includes(searchQuery));
            
            const matchesStatus = 
                statusFilter === 'all' ||
                (statusFilter === 'present' && guest.checked_in_at) ||
                (statusFilter === 'waiting' && !guest.checked_in_at);

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const { key, direction } = sortConfig;
            let valA: any = a[key];
            let valB: any = b[key];

            if (key === 'confirmed_at' || key === 'checked_in_at') {
                valA = valA ? new Date(valA).getTime() : 0;
                valB = valB ? new Date(valB).getTime() : 0;
            }

            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

    const { data: basicData, setData: setBasicData, put: putBasic, processing: basicProcessing, recentlySuccessful: basicSuccess, errors: basicErrors } = useForm({
        title: event.title,
        slug: event.slug,
        event_date: event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '',
    });

    const submitBasics = (e) => {
        e.preventDefault();
        putBasic(route('events.update', event.id), {
            preserveScroll: true,
        });
    };

    const counts = {
        all: guestList.length,
        present: guestList.filter(g => g.checked_in_at).length,
        waiting: guestList.filter(g => !g.checked_in_at).length
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

    const deleteGuest = (id) => {
        if (confirm('Remover convidado da lista? Esta ação não pode ser desfeita.')) {
            router.delete(route('guests.destroy', id));
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
        { id: 'basics', label: 'Informações Básicas', icon: FileText },
        { id: 'settings', label: 'Design e Estilo', icon: Palette },
        { id: 'locations', label: 'Endereços', icon: MapPin },
        { id: 'notices', label: 'Avisos', icon: Bell },
        { id: 'guides', label: 'Guias Informativos', icon: BookOpen },
        { id: 'guests', label: 'Lista de Presença', icon: Users },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-4">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                event.status === 'active' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-stone-200 text-stone-600 border border-stone-300'
                            }`}>
                                {event.status === 'active' ? 'Evento Ativo' : 'Rascunho'}
                            </span>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-stone-100 rounded-full shadow-sm">
                                <span className="text-[10px] text-stone-400 font-bold uppercase">Slug:</span>
                                <span className="text-[10px] text-[#0A0A0A] font-black">{event.slug}</span>
                            </div>
                        </div>
                        <h2 className="font-serif text-5xl text-[#0A0A0A] tracking-tighter leading-none premium-serif">
                            {event.title}
                        </h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <Link 
                            href={route('events.checkIn', event.id)}
                            className="premium-button flex items-center justify-center gap-3 bg-[#0A0A0A] text-white px-8 py-4 rounded-2xl text-sm font-black shadow-xl shadow-black/10 w-full sm:w-auto"
                        >
                            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                            Scanner de Entrada
                        </Link>
                        <Link 
                            href={`/${event.slug}`} 
                            target="_blank"
                            className="premium-button flex items-center justify-center gap-3 bg-white border border-stone-200 text-[#0A0A0A] px-8 py-4 rounded-2xl text-sm font-black shadow-sm hover:border-[#D4AF37] transition-all w-full sm:w-auto"
                        >
                            <ExternalLink className="w-5 h-5" />
                            Ver Convite Real
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Gerenciar: ${event.title}`} />

            <div className="py-12 bg-[#F9F8F6] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Tabs Navigation */}
                    <div className="flex overflow-x-auto no-scrollbar gap-2 mb-10 bg-white p-2.5 rounded-[2rem] shadow-sm border border-stone-100 ambient-shadow">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all duration-300 whitespace-nowrap ${
                                        isActive 
                                        ? 'bg-[#0A0A0A] text-white shadow-xl shadow-black/10 scale-105 z-10' 
                                        : 'text-stone-500 hover:text-[#0A0A0A] hover:bg-stone-50'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-stone-400'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content Areas */}
                    <div className="bg-white shadow-2xl rounded-[3rem] border border-stone-100 min-h-[600px] p-6 sm:p-12 ambient-shadow relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                {activeTab === 'basics' && (
                                    <div className="space-y-16">
                                        <form onSubmit={submitBasics} className="space-y-12">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <FileText className="w-6 h-6 text-[#D4AF37]" />
                                                    <h3 className="font-serif text-3xl text-[#0A0A0A] font-black tracking-tight">Dados do Evento</h3>
                                                </div>
                                                <p className="text-stone-500 mb-10 max-w-2xl">Configure os detalhes fundamentais que identificam sua celebração.</p>
                                                
                                                <div className="grid md:grid-cols-2 gap-10">
                                                    <div className="space-y-4">
                                                        <InputLabel htmlFor="title" value="Título do Evento" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                                                        <TextInput
                                                            id="title"
                                                            className="w-full"
                                                            value={basicData.title}
                                                            onChange={(e) => setBasicData('title', e.target.value)}
                                                            required
                                                            placeholder="Ex: Casamento de Maria e João"
                                                        />
                                                        <InputError message={basicErrors.title} />
                                                    </div>

                                                    <div className="space-y-4">
                                                        <InputLabel htmlFor="slug" value="Link Personalizado (URL)" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-stone-300 font-bold text-xs">
                                                                miuinvites.com/
                                                            </div>
                                                            <TextInput
                                                                id="slug"
                                                                className="w-full pl-[110px]"
                                                                value={basicData.slug}
                                                                onChange={(e) => setBasicData('slug', e.target.value)}
                                                                required
                                                                placeholder="maria-e-joao"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-stone-400 font-medium">Este é o endereço que seus convidados usarão para acessar o convite.</p>
                                                        <InputError message={basicErrors.slug} />
                                                    </div>

                                                    <div className="space-y-4">
                                                        <InputLabel htmlFor="event_date" value="Data da Celebração" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                                                        <TextInput
                                                            id="event_date"
                                                            type="date"
                                                            className="w-full"
                                                            value={basicData.event_date}
                                                            onChange={(e) => setBasicData('event_date', e.target.value)}
                                                            required
                                                        />
                                                        <InputError message={basicErrors.event_date} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-12 border-t border-stone-50 flex items-center gap-6">
                                                <PrimaryButton disabled={basicProcessing} className="premium-button bg-[#0A0A0A] text-white px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-black/20">
                                                    {basicProcessing ? 'Atualizando...' : 'Salvar Alterações'}
                                                </PrimaryButton>
                                                {basicSuccess && (
                                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Informações Gravadas
                                                    </motion.div>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                )}
                                {activeTab === 'settings' && (
                                    <div className="space-y-16">
                                        <form onSubmit={submitDesign} className="space-y-12">
                                            {/* Cores */}
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Palette className="w-6 h-6 text-[#D4AF37]" />
                                                    <h3 className="font-serif text-3xl text-[#0A0A0A] font-black tracking-tight">Identidade Visual</h3>
                                                </div>
                                                <p className="text-stone-500 mb-10 max-w-2xl">Configure a paleta de cores e o tema que darão vida ao seu convite digital de alta papelaria.</p>
                                                
                                                {/* Combinações Sugeridas */}
                                                <div className="mb-12">
                                                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4">Combinações Sugeridas pelo Ateliê</h4>
                                                    <div className="flex flex-wrap gap-4">
                                                        {[
                                                            { name: 'Ouro Real', p: '#D4AF37', s: '#FCFBF8', t: '#2C2C2C', b: '#F0EEE4' },
                                                            { name: 'Rose Gold', p: '#B76E79', s: '#FDF5E6', t: '#4A3B3C', b: '#F5EBE1' },
                                                            { name: 'Azul Serenity', p: '#4A6FA5', s: '#F0F4F8', t: '#1F2E47', b: '#E1E8F0' },
                                                            { name: 'Verde Sálvia', p: '#7BA05B', s: '#F9FAED', t: '#3A4A28', b: '#ECEEDB' },
                                                            { name: 'Terracota', p: '#C85A43', s: '#FAF0E6', t: '#5C281D', b: '#F0DFD1' },
                                                            { name: 'Noir & Stone', p: '#1C1917', s: '#FAFAF9', t: '#1C1917', b: '#EAEAEA' },
                                                        ].map(palette => (
                                                            <button
                                                                key={palette.name}
                                                                type="button"
                                                                onClick={() => setDesignData({ ...designData, primary_color: palette.p, secondary_color: palette.s, text_color: palette.t, background_color: palette.b })}
                                                                className={`group flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all shadow-sm hover:shadow-lg ${
                                                                    designData.primary_color.toLowerCase() === palette.p.toLowerCase()
                                                                    ? 'border-[#0A0A0A] bg-stone-50 ring-1 ring-[#0A0A0A]/5'
                                                                    : 'border-stone-100 bg-white hover:border-stone-200'
                                                                }`}
                                                            >
                                                                <div className="flex -space-x-2">
                                                                    <div className="w-6 h-6 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: palette.p }} />
                                                                    <div className="w-6 h-6 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: palette.s }} />
                                                                </div>
                                                                <span className="text-xs font-black text-[#0A0A0A] uppercase tracking-wider">{palette.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                    {[
                                                        { label: 'Cor Principal', desc: 'Selo e Botões', key: 'primary_color' },
                                                        { label: 'Cor Secundária', desc: 'Envelope e Papel', key: 'secondary_color' },
                                                        { label: 'Cor do Texto', desc: 'Títulos e Textos', key: 'text_color' },
                                                        { label: 'Cor de Fundo', desc: 'Fundo Externo', key: 'background_color' },
                                                    ].map((item) => (
                                                        <div key={item.key} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm hover:border-[#D4AF37] transition-all group">
                                                            <div className="mb-4">
                                                                <p className="text-xs font-black text-[#0A0A0A] uppercase tracking-wider">{item.label}</p>
                                                                <p className="text-[10px] text-stone-400 font-medium">{item.desc}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-inner border border-stone-100 cursor-pointer" style={{ backgroundColor: designData[item.key] }}>
                                                                    <input 
                                                                        type="color" 
                                                                        value={designData[item.key]} 
                                                                        onChange={e => setDesignData(item.key, e.target.value)}
                                                                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                                                    />
                                                                </div>
                                                                <input 
                                                                    type="text" 
                                                                    value={designData[item.key]} 
                                                                    onChange={e => setDesignData(item.key, e.target.value)}
                                                                    className="w-full font-mono text-[10px] font-black uppercase bg-stone-50 border-stone-100 rounded-xl px-3 py-2 focus:ring-0 focus:border-[#D4AF37]"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Imagens de Marca */}
                                            <div className="pt-12 border-t border-stone-50">
                                                <div className="flex items-center gap-3 mb-10">
                                                    <ImageIcon className="w-6 h-6 text-[#D4AF37]" />
                                                    <h3 className="font-serif text-3xl text-[#0A0A0A] font-black tracking-tight">Imagens e Identidade</h3>
                                                </div>
                                                
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <p className="text-xs font-black text-[#0A0A0A] uppercase tracking-widest">Logo do Evento</p>
                                                        <div className="relative group aspect-square max-w-[200px] bg-stone-50 rounded-[2rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center p-6 transition-all hover:border-[#D4AF37] hover:bg-white">
                                                            {event.logo && !designData.logo ? (
                                                                <img src={event.logo} className="w-full h-full object-contain" alt="Logo" />
                                                            ) : designData.logo ? (
                                                                <p className="text-[10px] font-black text-green-600 uppercase">Novo arquivo selecionado</p>
                                                            ) : (
                                                                <Upload className="w-8 h-8 text-stone-300 mb-2" />
                                                            )}
                                                            <input 
                                                                type="file" 
                                                                onChange={e => setDesignData('logo', e.target.files[0])}
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                            />
                                                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-tighter mt-2">Clique para trocar</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <p className="text-xs font-black text-[#0A0A0A] uppercase tracking-widest">Imagem de Capa</p>
                                                        <div className="relative group aspect-video bg-stone-50 rounded-[2rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center p-6 transition-all hover:border-[#D4AF37] hover:bg-white overflow-hidden">
                                                            {event.cover_image && !designData.cover_image ? (
                                                                <img src={event.cover_image} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Capa" />
                                                            ) : designData.cover_image ? (
                                                                <p className="text-[10px] font-black text-green-600 uppercase z-10">Nova capa selecionada</p>
                                                            ) : (
                                                                <Upload className="w-8 h-8 text-stone-300 mb-2" />
                                                            )}
                                                            <input 
                                                                type="file" 
                                                                onChange={e => setDesignData('cover_image', e.target.files[0])}
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                                            />
                                                            <span className="relative z-10 text-[10px] font-black text-[#0A0A0A] uppercase tracking-tighter mt-2">Upload de Capa</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Estilo Visual (Temas) */}
                                            <div className="pt-12 border-t border-stone-50">
                                                <div className="flex items-center gap-3 mb-10">
                                                    <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                                                    <h3 className="font-serif text-3xl text-[#0A0A0A] font-black tracking-tight">Estilo Visual</h3>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                    {[
                                                        { id: 'classic', label: 'Clássico', desc: 'Elegância atemporal' },
                                                        { id: 'modern', label: 'Moderno', desc: 'Minimalista' },
                                                        { id: 'floral', label: 'Floral', desc: 'Romantismo' },
                                                        { id: 'dark', label: 'Noir', desc: 'Noturno' },
                                                        { id: 'vintage', label: 'Vintage', desc: 'Papelaria Antiga' },
                                                    ].map((theme) => (
                                                        <div 
                                                            key={theme.id}
                                                            onClick={() => setDesignData('theme', theme.id)}
                                                            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all text-center group ${
                                                                designData.theme === theme.id 
                                                                ? 'border-[#0A0A0A] bg-stone-50' 
                                                                : 'border-stone-100 hover:border-stone-200 bg-white'
                                                            }`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-full mx-auto mb-3 border-4 flex items-center justify-center ${designData.theme === theme.id ? 'border-[#D4AF37] bg-[#0A0A0A]' : 'border-stone-100 bg-stone-50'}`}>
                                                                {designData.theme === theme.id && <CheckCircle className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <p className="font-black text-[10px] uppercase tracking-widest text-[#0A0A0A] mb-1">{theme.label}</p>
                                                            <p className="text-[9px] text-stone-400 font-medium leading-tight">{theme.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Tipo de Animação */}
                                            <div className="pt-12 border-t border-stone-50">
                                                <div className="flex items-center gap-3 mb-10">
                                                    <ExternalLink className="w-6 h-6 text-[#D4AF37]" />
                                                    <h3 className="font-serif text-3xl text-[#0A0A0A] font-black tracking-tight">Experiência de Abertura</h3>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    {[
                                                        { id: 'envelope_3d', label: 'Envelope 3D Premium', desc: 'Abertura física realista' },
                                                        { id: 'gate_fold', label: 'Janela (Gate Fold)', desc: 'Portas que se abrem ao meio' },
                                                        { id: 'slipcase', label: 'Luva Deslizante (Slipcase)', desc: 'Convite desliza para fora' },
                                                        { id: 'wax_seal', label: 'Selo de Cera (Wax Seal)', desc: 'Foco no selo de marca' },
                                                        { id: 'fade_in', label: 'Minimalista (Fade)', desc: 'Surgimento suave e etéreo' },
                                                    ].map((anim) => (
                                                        <div 
                                                            key={anim.id}
                                                            className={`group p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-4 ${
                                                                designData.animation_type === anim.id 
                                                                ? 'border-[#0A0A0A] bg-stone-50' 
                                                                : 'border-stone-100 hover:border-stone-200 bg-white'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div 
                                                                    onClick={() => setDesignData('animation_type', anim.id)}
                                                                    className="cursor-pointer flex-1"
                                                                >
                                                                    <p className="font-black text-xs uppercase tracking-widest text-[#0A0A0A] mb-1">{anim.label}</p>
                                                                    <p className="text-[10px] text-stone-400 font-medium">{anim.desc}</p>
                                                                </div>
                                                                <div 
                                                                    onClick={() => setDesignData('animation_type', anim.id)}
                                                                    className={`w-6 h-6 rounded-full border-4 cursor-pointer ${designData.animation_type === anim.id ? 'border-[#D4AF37]' : 'border-stone-100'}`} 
                                                                />
                                                            </div>
                                                            <button 
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedGuest({ type: 'anim_preview', animId: anim.id });
                                                                    setIsSharingModalOpen(true);
                                                                }}
                                                                className="w-full py-3 bg-white border border-stone-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-[#0A0A0A] hover:border-[#D4AF37] transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <ExternalLink className="w-3 h-3" />
                                                                Visualizar Demonstração
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* RSVP Settings */}
                                            <div className="pt-12 border-t border-stone-50">
                                                <div className="bg-[#0A0A0A] rounded-[3rem] p-10 sm:p-16 text-white shadow-2xl relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-10 rounded-full blur-[100px] -mr-32 -mt-32" />
                                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                                        <div>
                                                            <h3 className="font-serif text-3xl font-black mb-3">Configurações de RSVP</h3>
                                                            <p className="text-stone-400 font-medium">Controle as confirmações de presença com precisão.</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer group">
                                                            <input 
                                                                type="checkbox" 
                                                                className="sr-only peer" 
                                                                checked={designData.rsvp_enabled}
                                                                onChange={e => setDesignData('rsvp_enabled', e.target.checked)}
                                                            />
                                                            <div className="w-16 h-8 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#D4AF37] after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all border border-white/10 group-hover:border-[#D4AF37]/50" />
                                                            <span className="ms-4 text-sm font-black uppercase tracking-widest">
                                                                {designData.rsvp_enabled ? 'Habilitado' : 'Desabilitado'}
                                                            </span>
                                                        </label>
                                                    </div>

                                                    {designData.rsvp_enabled && (
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-12 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12">
                                                            <div className="space-y-4">
                                                                <InputLabel value="Data Limite para Confirmação" className="text-white opacity-60 uppercase tracking-widest text-[10px] font-black" />
                                                                <input 
                                                                    type="date"
                                                                    className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all"
                                                                    value={designData.rsvp_deadline}
                                                                    onChange={e => setDesignData('rsvp_deadline', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="space-y-6">
                                                                <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                                    <div>
                                                                        <p className="text-sm font-black uppercase tracking-widest">Permitir Acompanhantes</p>
                                                                        <p className="text-xs text-stone-500 font-medium">Convidados extras permitidos.</p>
                                                                    </div>
                                                                    <input type="checkbox" checked={designData.allow_extra_guests} onChange={e => setDesignData('allow_extra_guests', e.target.checked)} className="w-6 h-6 rounded-lg bg-white/10 border-white/20 text-[#D4AF37] focus:ring-[#D4AF37]" />
                                                                </div>
                                                                {designData.allow_extra_guests && (
                                                                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                                        <p className="text-sm font-black uppercase tracking-widest mb-4">Limite Máximo</p>
                                                                        <div className="flex gap-2 flex-wrap">
                                                                            {[1, 2, 3, 4, 5, 10].map(n => (
                                                                                <button 
                                                                                    key={n} 
                                                                                    type="button" 
                                                                                    onClick={() => setDesignData('max_extra_guests', n)}
                                                                                    className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${designData.max_extra_guests === n ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0A0A0A]' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
                                                                                >
                                                                                    +{n}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-12 border-t border-stone-50 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <PrimaryButton disabled={processingDesign} className="premium-button bg-[#0A0A0A] text-white px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-black/20">
                                                        {processingDesign ? 'Gravando Alterações...' : 'Salvar Novo Design'}
                                                    </PrimaryButton>
                                                    {designSuccess && (
                                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Publicado com Sucesso
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'guests' && (
                                    <div className="space-y-10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h3 className="font-serif text-4xl text-[#0A0A0A] font-black tracking-tight mb-2">Lista de Presença</h3>
                                                <p className="text-stone-500 font-medium italic">Acompanhe quem já faz parte deste momento especial.</p>
                                            </div>
                                            <a 
                                                href={route('events.guests.export', event.id)}
                                                className="premium-button flex items-center gap-3 px-8 py-4 bg-white border-2 border-stone-100 rounded-2xl text-xs font-black text-[#0A0A0A] hover:border-[#D4AF37] transition-all shadow-sm group"
                                            >
                                                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                Exportar CSV
                                            </a>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-stone-50 p-6 rounded-[2.5rem] border border-stone-100">
                                            <div className="flex bg-white p-1.5 rounded-2xl border border-stone-200 shadow-sm overflow-x-auto no-scrollbar w-full sm:w-auto">
                                                {[
                                                    { id: 'all', label: 'Todos', count: counts.all },
                                                    { id: 'present', label: 'Confirmados', count: counts.present },
                                                    { id: 'waiting', label: 'Aguardando', count: counts.waiting },
                                                ].map((filter) => (
                                                    <button
                                                        key={filter.id}
                                                        onClick={() => setStatusFilter(filter.id)}
                                                        className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                            statusFilter === filter.id
                                                            ? 'bg-[#0A0A0A] text-white shadow-xl shadow-black/20'
                                                            : 'text-stone-400 hover:text-[#0A0A0A] hover:bg-stone-50'
                                                        }`}
                                                    >
                                                        {filter.label}
                                                        <span className={`px-2 py-0.5 rounded-full ${statusFilter === filter.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400'}`}>
                                                            {filter.count}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="relative w-full sm:w-96 group">
                                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                    <Search className={`w-5 h-5 transition-colors ${searchQuery ? 'text-[#D4AF37]' : 'text-stone-400'}`} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Buscar por nome, e-mail ou fone..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="block w-full pl-14 pr-6 py-4 bg-white border border-stone-200 rounded-2xl text-sm font-medium placeholder-stone-300 focus:ring-2 focus:ring-[#0A0A0A] focus:border-[#0A0A0A] outline-none transition-all shadow-sm group-hover:border-stone-300"
                                                />
                                            </div>
                                        </div>

                                        <div className="overflow-hidden border border-stone-100 rounded-[2.5rem] shadow-sm bg-white ambient-shadow">
                                            <table className="w-full text-left text-sm border-collapse">
                                                <thead className="bg-stone-50/50 border-b border-stone-100 text-[#0A0A0A] uppercase text-[10px] font-black tracking-[0.1em]">
                                                    <tr>
                                                        <th className="px-8 py-6 cursor-pointer hover:bg-white transition-colors group" onClick={() => handleSort('name')}>
                                                            <div className="flex items-center gap-3">
                                                                Nome Completo
                                                                <SortIcon sortConfig={sortConfig} columnKey="name" />
                                                            </div>
                                                        </th>
                                                        <th className="px-8 py-6 text-center cursor-pointer hover:bg-white transition-colors group" onClick={() => handleSort('extra_guests')}>
                                                            <div className="flex items-center justify-center gap-3">
                                                                Acompanhantes
                                                                <SortIcon sortConfig={sortConfig} columnKey="extra_guests" />
                                                            </div>
                                                        </th>
                                                        <th className="px-8 py-6 cursor-pointer hover:bg-white transition-colors group" onClick={() => handleSort('confirmed_at')}>
                                                            <div className="flex items-center gap-3">
                                                                Data Confirmação
                                                                <SortIcon sortConfig={sortConfig} columnKey="confirmed_at" />
                                                            </div>
                                                        </th>
                                                        <th className="px-8 py-6 cursor-pointer hover:bg-white transition-colors group" onClick={() => handleSort('checked_in_at')}>
                                                            <div className="flex items-center gap-3">
                                                                Status Check-in
                                                                <SortIcon sortConfig={sortConfig} columnKey="checked_in_at" />
                                                            </div>
                                                        </th>
                                                        <th className="px-8 py-6 text-right">Controles</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-stone-50">
                                                    {filteredAndSortedGuests.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5} className="px-8 py-32 text-center">
                                                                <div className="flex flex-col items-center gap-4">
                                                                    <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center border border-stone-100">
                                                                        <Users className="w-10 h-10 text-stone-200" />
                                                                    </div>
                                                                    <div className="text-stone-400 font-bold uppercase tracking-widest text-xs">Nenhum registro encontrado</div>
                                                                    {searchQuery && (
                                                                        <button onClick={() => {setSearchQuery(''); setStatusFilter('all');}} className="text-[#0A0A0A] font-black underline underline-offset-8 hover:text-[#D4AF37] transition-colors text-sm">Limpar Filtros</button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        filteredAndSortedGuests.map((guest) => (
                                                            <tr key={guest.id} className="group hover:bg-stone-50/50 transition-all">
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-black text-xs border-2 border-white shadow-sm ring-1 ring-stone-100">
                                                                            {guest.name.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-black text-[#0A0A0A] text-base leading-tight mb-1">{guest.name}</p>
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="text-[10px] text-stone-400 font-medium truncate max-w-[150px]">{guest.email || 'Sem e-mail'}</span>
                                                                                {guest.phone && <span className="text-[10px] text-stone-300">|</span>}
                                                                                {guest.phone && <span className="text-[10px] text-stone-400 font-medium">📱 {guest.phone}</span>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6 text-center">
                                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black transition-colors ${guest.extra_guests > 0 ? 'bg-[#F3E5AB] text-[#D4AF37]' : 'bg-stone-100 text-stone-400'}`}>
                                                                        +{guest.extra_guests} Acomp.
                                                                    </span>
                                                                </td>
                                                                <td className="px-8 py-6">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs font-black text-[#0A0A0A]">{new Date(guest.confirmed_at).toLocaleDateString('pt-BR')}</span>
                                                                        <span className="text-[10px] text-stone-400 font-medium uppercase tracking-tighter">às {new Date(guest.confirmed_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6">
                                                                    {guest.checked_in_at ? (
                                                                        <div className="flex items-center gap-3 text-green-600">
                                                                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center border border-green-100 shadow-sm">
                                                                                <CheckCircle className="w-4 h-4" />
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Presente</span>
                                                                                <span className="text-[9px] text-green-400 font-medium">{new Date(guest.checked_in_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-3 text-stone-300">
                                                                            <div className="w-8 h-8 bg-stone-50 rounded-lg flex items-center justify-center border border-stone-100">
                                                                                <Clock className="w-4 h-4" />
                                                                            </div>
                                                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Aguardando</span>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="px-8 py-6 text-right">
                                                                    <div className="flex items-center justify-end gap-3">
                                                                        <button onClick={() => deleteGuest(guest.id)} className="p-3 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Remover Convidado">
                                                                            <Trash2 className="w-5 h-5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                                
                                {activeTab === 'locations' && (
                                    <div className="space-y-12">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div>
                                                <h3 className="font-serif text-4xl text-[#0A0A0A] font-black tracking-tight mb-2">Locais do Evento</h3>
                                                <p className="text-stone-500 font-medium">Onde a magia acontece. Adicione cerimônia, recepção ou outros.</p>
                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-3 gap-12">
                                            <div className="lg:col-span-1">
                                                <form onSubmit={submitLocation} className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 space-y-6">
                                                    <div className="space-y-4">
                                                        <InputLabel value="Nome do Local (Ex: Catedral)" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                                                        <TextInput 
                                                            className="w-full" 
                                                            value={locData.name} 
                                                            onChange={e => setLocData('name', e.target.value)} 
                                                            placeholder="Ex: Espaço das Palmeiras"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <InputLabel value="Endereço Completo" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                                                        <TextInput 
                                                            className="w-full" 
                                                            value={locData.address} 
                                                            onChange={e => setLocData('address', e.target.value)} 
                                                            placeholder="Rua, Número, Bairro, Cidade"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <InputLabel value="Observações (Opcional)" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                                                        <textarea 
                                                            className="w-full border-stone-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-2xl p-4 text-sm"
                                                            value={locData.notes}
                                                            onChange={e => setLocData('notes', e.target.value)}
                                                            rows={3}
                                                            placeholder="Estacionamento no local, entrada lateral..."
                                                        />
                                                    </div>
                                                    <PrimaryButton disabled={locProcessing} className="w-full py-4 rounded-xl bg-[#0A0A0A] text-white font-black uppercase text-xs tracking-widest">
                                                        Adicionar Local
                                                    </PrimaryButton>
                                                </form>
                                            </div>

                                            <div className="lg:col-span-2 space-y-6">
                                                {event.locations.length === 0 ? (
                                                    <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-stone-100 rounded-[3rem] p-20 text-center">
                                                        <MapPin className="w-12 h-12 text-stone-200 mb-4" />
                                                        <p className="text-stone-400 font-bold uppercase text-xs tracking-widest">Nenhum local cadastrado</p>
                                                    </div>
                                                ) : (
                                                    event.locations.map((loc) => (
                                                        <motion.div 
                                                            layout
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            key={loc.id} 
                                                            className="flex items-center justify-between p-8 bg-white border border-stone-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group"
                                                        >
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors">
                                                                    <MapPin className="w-6 h-6 text-[#D4AF37]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xl font-black text-[#0A0A0A] mb-1">{loc.name}</h4>
                                                                    <p className="text-sm text-stone-400 font-medium">{loc.address}</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => deleteLocation(loc.id)} className="p-3 text-stone-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notices' && (
                                    <div className="space-y-12">
                                        <div>
                                            <h3 className="font-serif text-4xl text-[#0A0A0A] font-black tracking-tight mb-2">Painel de Avisos</h3>
                                            <p className="text-stone-500 font-medium">Comunique-se com seus convidados em tempo real.</p>
                                        </div>

                                        <div className="grid lg:grid-cols-3 gap-12">
                                            <div className="lg:col-span-1">
                                                <form onSubmit={submitNotice} className="bg-[#0A0A0A] p-8 rounded-[2.5rem] shadow-2xl space-y-6 text-white relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-10 rounded-full blur-3xl" />
                                                    <div className="space-y-4 relative z-10">
                                                        <InputLabel value="Sua Mensagem" className="text-white opacity-60 uppercase text-[10px] font-black tracking-widest" />
                                                        <textarea 
                                                            className="w-full bg-white/5 border-white/10 focus:border-[#D4AF37] focus:ring-0 rounded-2xl p-5 text-sm text-white placeholder-white/20"
                                                            value={notData.message}
                                                            onChange={e => setNotData('message', e.target.value)}
                                                            rows={4}
                                                            placeholder="Ex: O local da cerimônia possui manobrista..."
                                                        />
                                                    </div>
                                                    <div className="space-y-4 relative z-10">
                                                        <InputLabel value="Prioridade" className="text-white opacity-60 uppercase text-[10px] font-black tracking-widest" />
                                                        <select 
                                                            className="w-full bg-white/5 border-white/10 focus:border-[#D4AF37] focus:ring-0 rounded-2xl p-4 text-sm text-white"
                                                            value={notData.priority}
                                                            onChange={e => setNotData('priority', e.target.value)}
                                                        >
                                                            <option value="normal" className="bg-stone-900">Informativo</option>
                                                            <option value="important" className="bg-stone-900">Importante (Destaque Gold)</option>
                                                            <option value="urgent" className="bg-stone-900">Urgente (Destaque Noir)</option>
                                                        </select>
                                                    </div>
                                                    <button disabled={notProcessing} className="w-full py-5 rounded-2xl bg-[#D4AF37] text-[#0A0A0A] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#D4AF37]/20 transition-all hover:scale-[1.02]">
                                                        Publicar Aviso
                                                    </button>
                                                </form>
                                            </div>

                                            <div className="lg:col-span-2 space-y-6">
                                                {event.notices.length === 0 ? (
                                                    <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-stone-100 rounded-[3rem] p-20 text-center">
                                                        <Bell className="w-12 h-12 text-stone-200 mb-4" />
                                                        <p className="text-stone-400 font-bold uppercase text-xs tracking-widest">Nenhum aviso publicado</p>
                                                    </div>
                                                ) : (
                                                    event.notices.map((notice) => (
                                                        <motion.div 
                                                            layout
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            key={notice.id} 
                                                            className={`p-8 rounded-[2.5rem] border flex items-start justify-between relative overflow-hidden ${
                                                                notice.priority === 'urgent' 
                                                                ? 'bg-[#0A0A0A] border-stone-800 text-white shadow-2xl' 
                                                                : notice.priority === 'important'
                                                                ? 'bg-[#FCFBF8] border-[#D4AF37]/30 text-[#0A0A0A] shadow-lg shadow-[#D4AF37]/5'
                                                                : 'bg-white border-stone-100 text-stone-600'
                                                            }`}
                                                        >
                                                            <div className="flex gap-6 items-start">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                                                    notice.priority === 'urgent' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-stone-50'
                                                                }`}>
                                                                    <Bell className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-medium leading-relaxed">{notice.message}</p>
                                                                    <p className="mt-3 text-[10px] font-black uppercase tracking-widest opacity-40">Publicado em {new Date(notice.created_at).toLocaleDateString('pt-BR')}</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => deleteNotice(notice.id)} className="p-2 opacity-40 hover:opacity-100 hover:text-red-500 transition-all">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'guides' && (
                                    <div className="space-y-12">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div>
                                                <h3 className="font-serif text-4xl text-[#0A0A0A] font-black tracking-tight mb-2">Guias e Informações</h3>
                                                <p className="text-stone-500 font-medium">Manuais de estilo, hospedagem, listas de presentes e mais.</p>
                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-4 gap-8">
                                            <div className="lg:col-span-1">
                                                <form onSubmit={submitGuide} className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 space-y-6">
                                                    <div className="space-y-4">
                                                        <InputLabel value="Título do Guia" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                                                        <TextInput className="w-full" value={guideData.title} onChange={e => setGuideData('title', e.target.value)} placeholder="Ex: Dress Code" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <InputLabel value="Tipo" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                                                        <select className="w-full border-stone-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-xl text-sm p-3" value={guideData.type} onChange={e => setGuideData('type', e.target.value)}>
                                                            <option value="hotel">Hospedagem</option>
                                                            <option value="gifts">Presentes</option>
                                                            <option value="style">Dress Code</option>
                                                            <option value="other">Outros</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <InputLabel value="Conteúdo / Link" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                                                        <textarea className="w-full border-stone-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-xl text-sm p-4" value={guideData.content} onChange={e => setGuideData('content', e.target.value)} rows={4} placeholder="Links ou informações detalhadas..." />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <InputLabel value="Anexo (PDF/Imagem)" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                                                        <input type="file" onChange={e => setGuideData('file', e.target.files[0])} className="w-full text-xs font-bold text-stone-500" />
                                                    </div>
                                                    <PrimaryButton disabled={guideProcessing} className="w-full py-4 rounded-xl bg-[#0A0A0A] text-white font-black uppercase text-xs tracking-widest">
                                                        Criar Guia
                                                    </PrimaryButton>
                                                </form>
                                            </div>

                                            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6">
                                                {event.guides.length === 0 ? (
                                                    <div className="sm:col-span-2 flex flex-col items-center justify-center border-2 border-dashed border-stone-100 rounded-[3rem] p-20 text-center">
                                                        <BookOpen className="w-12 h-12 text-stone-200 mb-4" />
                                                        <p className="text-stone-400 font-bold uppercase text-xs tracking-widest">Nenhum guia criado</p>
                                                    </div>
                                                ) : (
                                                    event.guides.map((guide) => (
                                                        <motion.div 
                                                            layout
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            key={guide.id} 
                                                            className="bg-white border border-stone-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                                                        >
                                                            <div className="absolute top-0 right-0 p-4">
                                                                <button onClick={() => deleteGuide(guide.id)} className="p-2 text-stone-200 hover:text-red-500 transition-colors">
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center gap-4 mb-6">
                                                                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center">
                                                                    <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                                                                </div>
                                                                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/5 px-3 py-1 rounded-full">{guide.type}</span>
                                                            </div>
                                                            <h4 className="text-2xl font-black text-[#0A0A0A] mb-3 leading-tight">{guide.title}</h4>
                                                            <p className="text-sm text-stone-500 line-clamp-3 mb-6 font-medium leading-relaxed">{guide.content}</p>
                                                            
                                                            {guide.file_path && (
                                                                <a 
                                                                    href={`/storage/${guide.file_path}`} 
                                                                    target="_blank" 
                                                                    className="inline-flex items-center gap-2 text-xs font-black text-[#0A0A0A] uppercase tracking-widest hover:text-[#D4AF37] transition-colors"
                                                                >
                                                                    <FileText className="w-4 h-4" />
                                                                    Baixar Anexo
                                                                </a>
                                                            )}
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>

            {/* Animation Preview Modal */}
            <Modal show={isSharingModalOpen && selectedGuest?.type === 'anim_preview'} onClose={() => setIsSharingModalOpen(false)} maxWidth="2xl">
                <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-stone-100 h-[600px] relative">
                    <button 
                        onClick={() => setIsSharingModalOpen(false)}
                        className="absolute top-8 right-8 z-[60] w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-[#0A0A0A] hover:bg-white transition-all shadow-xl"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <EnvelopeAnimation
                        isPreview={true}
                        animationType={selectedGuest?.animId}
                        primaryColor={designData.primary_color}
                        secondaryColor={designData.secondary_color}
                        textColor={designData.text_color}
                        backgroundColor={designData.background_color}
                        logo={event.logo}
                        title={event.title}
                    >
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                            <Sparkles className="w-12 h-12 text-[#D4AF37] mb-6" />
                            <h3 className="font-serif text-3xl font-black mb-4">Seu Convite Aparecerá Aqui</h3>
                            <p className="text-stone-500 max-w-sm mx-auto">Esta é uma demonstração de como seus convidados experimentarão a abertura do seu evento.</p>
                            <button 
                                onClick={() => setIsSharingModalOpen(false)}
                                className="mt-8 px-8 py-4 bg-[#0A0A0A] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-black/20"
                            >
                                Selecionar este Design
                            </button>
                        </div>
                    </EnvelopeAnimation>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
