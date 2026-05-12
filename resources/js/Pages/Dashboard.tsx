import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Users, Calendar, ArrowRight, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Event } from '@/types';

export default function Dashboard({ events }: { events: Event[] }) {
    const activeEventsCount = events.filter(e => e.status === 'active').length;
    const totalGuests = events.reduce((sum, e) => sum + (typeof e.guests === 'number' ? e.guests : 0), 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="font-serif text-4xl text-[#0A0A0A] tracking-tight leading-none mb-2">
                            Seu Espaço Criativo
                        </h2>
                        <p className="text-stone-500 font-medium">Gerencie seus eventos de alta papelaria com elegância.</p>
                    </div>
                    <Link 
                        href={route('events.create')}
                        className="premium-button flex items-center gap-3 bg-[#0A0A0A] text-white px-8 py-4 rounded-2xl text-sm font-black shadow-2xl shadow-black/20 group w-full sm:w-auto justify-center"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        Novo Evento
                    </Link>
                </div>
            }
        >
            <Head title="Painel do Anfitrião" />

            <div className="py-12 bg-[#F9F8F6] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 flex items-center gap-6 ambient-shadow"
                        >
                            <div className="w-16 h-16 bg-[#0A0A0A] rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-xl shadow-black/10">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1">Eventos Ativos</p>
                                <p className="text-3xl font-black text-[#0A0A0A]">{activeEventsCount}</p>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 flex items-center gap-6 ambient-shadow"
                        >
                            <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-[#0A0A0A] shadow-xl shadow-[#D4AF37]/20">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1">Presenças Confirmadas</p>
                                <p className="text-3xl font-black text-[#0A0A0A]">{totalGuests}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Events List */}
                    <div className="bg-white shadow-xl rounded-[3rem] border border-stone-100 p-8 sm:p-12 ambient-shadow">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="font-serif text-2xl text-[#0A0A0A] font-black">Meus Eventos Recentes</h3>
                        </div>
                        
                        {events.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-stone-100 rounded-[2.5rem] bg-stone-50/50">
                                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Calendar className="w-12 h-12 text-stone-300" />
                                </div>
                                <h4 className="text-xl font-black text-[#0A0A0A] mb-2">Sua galeria está vazia</h4>
                                <p className="text-stone-500 mb-8 max-w-sm mx-auto">Comece a criar experiências memoráveis para seus convidados agora mesmo.</p>
                                <Link 
                                    href={route('events.create')}
                                    className="premium-button inline-flex items-center gap-3 bg-[#0A0A0A] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#1A1A1A] transition-all shadow-xl shadow-black/20"
                                >
                                    <Plus className="w-5 h-5" />
                                    Criar Meu Primeiro Evento
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {events.map((evt, index) => (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        key={evt.id}
                                        className="h-full"
                                    >
                                        <div className="group bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col ambient-shadow h-full">
                                            <div className="h-56 bg-stone-50 relative overflow-hidden group">
                                                {evt.cover_image ? (
                                                    <img src={evt.cover_image} alt={evt.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-stone-50 to-stone-100" />
                                                )}
                                                
                                                {evt.logo ? (
                                                    <div className="absolute inset-0 flex items-center justify-center p-12">
                                                        <motion.div 
                                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                                            className="w-24 h-24 bg-white/40 backdrop-blur-md rounded-[1.5rem] border border-white/40 p-4 shadow-2xl flex items-center justify-center group-hover:border-white/60 transition-colors"
                                                        >
                                                            <img src={evt.logo} alt="Logo" className="w-full h-full object-contain filter drop-shadow-lg" />
                                                        </motion.div>
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center p-12">
                                                        <motion.div 
                                                            whileHover={{ scale: 1.1, rotate: -5 }}
                                                            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[1.5rem] border border-white/30 shadow-2xl flex items-center justify-center group-hover:bg-white/40 transition-all"
                                                        >
                                                            <span className="font-serif text-4xl text-[#0A0A0A]/40 font-bold">{evt.title[0]}</span>
                                                        </motion.div>
                                                    </div>
                                                )}

                                                <div className="absolute top-6 right-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                                                        evt.status === 'active' 
                                                        ? 'bg-green-500/80 text-white border-green-500/30' 
                                                        : 'bg-black/50 text-white border-white/20'
                                                    }`}>
                                                        {evt.status === 'active' ? 'Evento Ativo' : 'Rascunho'}
                                                    </span>
                                                </div>

                                                <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                    <Link 
                                                        href={route('events.show', evt.id)}
                                                        className="w-full bg-white text-[#0A0A0A] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all text-center transform translate-y-4 group-hover:translate-y-0 duration-500"
                                                    >
                                                        Gerenciar Evento
                                                    </Link>
                                                </div>
                                            </div>
                                            
                                            <div className="p-8 flex-1 flex flex-col">
                                                <div className="flex items-center gap-3 mb-6">
                                                    {evt.logo && (
                                                        <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                                                            <img src={evt.logo} alt="Logo" className="w-full h-full object-contain" />
                                                        </div>
                                                    )}
                                                    <h4 className="font-serif text-xl text-[#0A0A0A] font-black group-hover:text-[#D4AF37] transition-colors line-clamp-1 leading-tight">{evt.title}</h4>
                                                </div>
                                                
                                                <p className="text-xs font-bold text-stone-400 flex items-center gap-2 uppercase tracking-wider mb-6">
                                                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                                                    {new Date(evt.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                                                </p>
                                                
                                                <div className="space-y-2 mb-8 mt-auto">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                                                        <span>Confirmações</span>
                                                        <span>{typeof evt.guests === 'number' ? evt.guests : 0} de {evt.limit}</span>
                                                    </div>
                                                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(((typeof evt.guests === 'number' ? evt.guests : 0) / evt.limit) * 100, 100)}%` } as any}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="bg-[#D4AF37] h-full rounded-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                                                    <Link 
                                                        href={route('events.show', evt.id)} 
                                                        className="flex items-center gap-2 text-sm font-black text-[#0A0A0A] hover:text-[#D4AF37] transition-colors group-link"
                                                    >
                                                        Painel de Controle
                                                        <ArrowRight className="w-4 h-4 transition-transform group-hover-link:translate-x-1" />
                                                    </Link>
                                                    
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-stone-200" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
