import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings, MapPin, Bell, Users, ExternalLink, Image as ImageIcon, Palette, Play } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ event }) {
    const [activeTab, setActiveTab] = useState('settings');

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        primary_color: event.primary_color || '#1c1917',
        secondary_color: event.secondary_color || '#fafaf9',
        animation_type: event.animation_type || 'envelope_3d',
    });

    const submitDesign = (e) => {
        e.preventDefault();
        put(route('events.updateDesign', event.id));
    };

    const tabs = [
        { id: 'settings', label: 'Design e Capa', icon: Palette },
        { id: 'locations', label: 'Locais', icon: MapPin },
        { id: 'notices', label: 'Avisos', icon: Bell },
        { id: 'guests', label: 'Lista de Presença', icon: Users },
    ];

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
                            href={`/demo/invitation`} 
                            className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors shadow-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Ver Convite
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
                                        <h3 className="font-serif text-2xl text-stone-900 mb-2">Paleta de Cores</h3>
                                        <p className="text-stone-500 mb-6">Defina as cores que irão compor a identidade visual do seu convite.</p>
                                        
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="border border-stone-200 p-6 rounded-2xl flex items-center justify-between">
                                                <div>
                                                    <InputLabel value="Cor Principal" />
                                                    <p className="text-xs text-stone-400 mt-1">Usada em botões e destaques.</p>
                                                </div>
                                                <input 
                                                    type="color" 
                                                    value={data.primary_color}
                                                    onChange={e => setData('primary_color', e.target.value)}
                                                    className="w-14 h-14 rounded-full overflow-hidden cursor-pointer border-0 bg-transparent"
                                                />
                                            </div>
                                            <div className="border border-stone-200 p-6 rounded-2xl flex items-center justify-between">
                                                <div>
                                                    <InputLabel value="Cor Secundária" />
                                                    <p className="text-xs text-stone-400 mt-1">Fundo do envelope e áreas amplas.</p>
                                                </div>
                                                <input 
                                                    type="color" 
                                                    value={data.secondary_color}
                                                    onChange={e => setData('secondary_color', e.target.value)}
                                                    className="w-14 h-14 rounded-full overflow-hidden cursor-pointer border-0 bg-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Animação */}
                                    <div className="pt-8 border-t border-stone-100">
                                        <h3 className="font-serif text-2xl text-stone-900 mb-2">Estilo de Abertura</h3>
                                        <p className="text-stone-500 mb-6">Como seus convidados serão recebidos ao abrir o link.</p>
                                        
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div 
                                                onClick={() => setData('animation_type', 'envelope_3d')}
                                                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                                                    data.animation_type === 'envelope_3d' 
                                                    ? 'border-stone-900 bg-stone-50' 
                                                    : 'border-stone-200 hover:border-stone-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.animation_type === 'envelope_3d' ? 'border-stone-900' : 'border-stone-300'}`}>
                                                        {data.animation_type === 'envelope_3d' && <div className="w-2.5 h-2.5 bg-stone-900 rounded-full" />}
                                                    </div>
                                                    <span className="font-medium text-stone-900">Envelope 3D Clássico</span>
                                                </div>
                                                <p className="text-sm text-stone-500 pl-8">Uma experiência imersiva com um envelope virtual que se abre.</p>
                                            </div>

                                            <div 
                                                onClick={() => setData('animation_type', 'fade_in')}
                                                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                                                    data.animation_type === 'fade_in' 
                                                    ? 'border-stone-900 bg-stone-50' 
                                                    : 'border-stone-200 hover:border-stone-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.animation_type === 'fade_in' ? 'border-stone-900' : 'border-stone-300'}`}>
                                                        {data.animation_type === 'fade_in' && <div className="w-2.5 h-2.5 bg-stone-900 rounded-full" />}
                                                    </div>
                                                    <span className="font-medium text-stone-900">Fade Minimalista</span>
                                                </div>
                                                <p className="text-sm text-stone-500 pl-8">Abertura direta para o convite com uma transição suave e elegante.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-stone-100 flex items-center gap-4">
                                        <PrimaryButton disabled={processing}>
                                            {processing ? 'Salvando...' : 'Salvar Design'}
                                        </PrimaryButton>
                                        {recentlySuccessful && (
                                            <span className="text-sm text-green-600 font-medium">Salvo com sucesso!</span>
                                        )}
                                    </div>
                                </form>

                                {/* Imagens (Placeholder) */}
                                <div className="pt-8 border-t border-stone-100">
                                    <h3 className="font-serif text-2xl text-stone-900 mb-2">Imagens do Convite</h3>
                                    <p className="text-stone-500 mb-6">Configure as imagens que aparecerão no envelope e na capa principal.</p>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer">
                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                                <ImageIcon className="w-8 h-8 text-stone-400" />
                                            </div>
                                            <p className="font-medium text-stone-900">Upload Capa Principal</p>
                                            <p className="text-sm text-stone-500 mt-1">Recomendado: 1080x1920px (Vertical)</p>
                                        </div>
                                        <div className="border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer">
                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-serif font-bold text-2xl text-stone-300">
                                                M&A
                                            </div>
                                            <p className="font-medium text-stone-900">Upload do Monograma/Logo</p>
                                            <p className="text-sm text-stone-500 mt-1">Será usado no selo de cera e capa.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'locations' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="font-serif text-2xl text-stone-900 mb-2">Locais do Evento</h3>
                                        <p className="text-stone-500">Adicione um ou mais locais (ex: Cerimônia e Festa).</p>
                                    </div>
                                    <button className="bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800">
                                        + Novo Local
                                    </button>
                                </div>
                                {event.locations?.length === 0 ? (
                                    <div className="text-center py-12 border border-stone-200 rounded-3xl bg-stone-50">
                                        <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                                        <p className="text-stone-500">Nenhum local cadastrado ainda.</p>
                                    </div>
                                ) : (
                                    <p>Lista de locais aqui...</p>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'notices' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="font-serif text-2xl text-stone-900 mb-2">Avisos Importantes</h3>
                                        <p className="text-stone-500">Serão exibidos em um modal elegante logo após a abertura do convite.</p>
                                    </div>
                                    <button className="bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800">
                                        + Adicionar Aviso
                                    </button>
                                </div>
                                {event.notices?.length === 0 ? (
                                    <div className="text-center py-12 border border-stone-200 rounded-3xl bg-stone-50">
                                        <Bell className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                                        <p className="text-stone-500">Nenhum aviso configurado.</p>
                                    </div>
                                ) : (
                                    <p>Lista de avisos aqui...</p>
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
                                                <th className="px-6 py-4">Acompanhantes</th>
                                                <th className="px-6 py-4">Data da Confirmação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {event.guests?.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-12 text-center text-stone-500">
                                                        Ninguém confirmou presença ainda.
                                                    </td>
                                                </tr>
                                            ) : (
                                                event.guests?.map((guest: any) => (
                                                    <tr key={guest.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                                                        <td className="px-6 py-4 font-medium text-stone-900">{guest.name}</td>
                                                        <td className="px-6 py-4">+{guest.extra_guests}</td>
                                                        <td className="px-6 py-4">{new Date(guest.confirmed_at).toLocaleDateString('pt-BR')}</td>
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
        </AuthenticatedLayout>
    );
}
