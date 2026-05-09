import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ events }) {
    const activeEventsCount = events.filter(e => e.status === 'active').length;
    const totalGuests = events.reduce((sum, e) => sum + e.guests, 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="font-serif text-3xl text-stone-900 leading-tight">
                        Meus Eventos
                    </h2>
                    <Link 
                        href={route('events.create')}
                        className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors shadow-lg w-full sm:w-auto justify-center"
                    >
                        <Plus className="w-4 h-4" />
                        Criar Convite
                    </Link>
                </div>
            }
        >
            <Head title="Painel do Anfitrião" />

            <div className="py-6 sm:py-12 bg-stone-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-stone-500">Eventos Ativos</p>
                                <p className="text-2xl font-serif text-stone-900">{activeEventsCount}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-stone-500">Convidados Confirmados</p>
                                <p className="text-2xl font-serif text-stone-900">{totalGuests}</p>
                            </div>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-3xl border border-stone-100 p-6 sm:p-8">
                        <h3 className="font-serif text-xl text-stone-900 mb-6">Convites Recentes</h3>
                        
                        {events.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-stone-400" />
                                </div>
                                <h4 className="text-lg font-medium text-stone-900 mb-2">Nenhum evento criado</h4>
                                <p className="text-stone-500 mb-6">Crie seu primeiro convite e comece a convidar seus amigos.</p>
                                <Link 
                                    href={route('events.create')}
                                    className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full font-medium hover:bg-stone-800 transition-colors shadow-lg"
                                >
                                    <Plus className="w-5 h-5" />
                                    Criar Meu Primeiro Convite
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((evt, index) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        key={evt.id} 
                                        className="group relative bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:border-stone-300 flex flex-col"
                                    >
                                        <div className="h-32 bg-stone-200 relative overflow-hidden">
                                            {/* Placeholder Cover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-stone-700 to-stone-900 opacity-90" />
                                            <div className="absolute top-4 right-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                                                    evt.is_paid 
                                                    ? 'bg-green-500/20 text-green-100 border border-green-500/30' 
                                                    : 'bg-amber-500/20 text-amber-100 border border-amber-500/30'
                                                }`}>
                                                    {evt.is_paid ? 'Ativo' : 'Pendente'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h4 className="font-serif text-lg text-stone-900 mb-1">{evt.title}</h4>
                                            <p className="text-sm text-stone-500 flex items-center gap-1 mb-4">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(evt.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                                            </p>
                                            
                                            <div className="w-full bg-stone-200 rounded-full h-1.5 mb-2 mt-auto">
                                                <div 
                                                    className="bg-stone-900 h-1.5 rounded-full transition-all" 
                                                    style={{ width: `${Math.min((evt.guests / evt.limit) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-stone-500 text-right mb-4">
                                                {evt.guests} de {evt.limit} convidados
                                            </p>

                                            {!evt.is_paid && (
                                                <Link 
                                                    href={route('events.pay', evt.id)} 
                                                    method="post"
                                                    as="button"
                                                    className="w-full mb-4 py-3 bg-amber-500 text-amber-950 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors shadow-sm"
                                                >
                                                    Liberar Convite (Pagar)
                                                </Link>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-stone-200 flex justify-between items-center">
                                                <Link href={route('events.show', evt.id)} className="text-sm font-medium text-stone-900 hover:underline">
                                                    Gerenciar Evento
                                                </Link>
                                                <Link href={`/demo/invitation`} className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
                                                    Ver Demo
                                                </Link>
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
