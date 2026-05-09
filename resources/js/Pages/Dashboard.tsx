import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Users, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    // Fake data for MVP
    const events = [
        { id: 1, title: 'Casamento Maria & João', date: '2026-10-15', status: 'active', guests: 120, limit: 150 },
        { id: 2, title: 'Aniversário de 30 anos', date: '2026-11-20', status: 'draft', guests: 0, limit: 50 },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-serif text-3xl text-stone-900 leading-tight">
                        Meus Eventos
                    </h2>
                    <button className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors shadow-lg">
                        <Plus className="w-4 h-4" />
                        Criar Convite
                    </button>
                </div>
            }
        >
            <Head title="Painel do Anfitrião" />

            <div className="py-12 bg-stone-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-stone-500">Eventos Ativos</p>
                                <p className="text-2xl font-serif text-stone-900">1</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-stone-500">Convidados Confirmados</p>
                                <p className="text-2xl font-serif text-stone-900">120</p>
                            </div>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-3xl border border-stone-100 p-8">
                        <h3 className="font-serif text-xl text-stone-900 mb-6">Convites Recentes</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((evt, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={evt.id} 
                                    className="group relative bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:border-stone-300"
                                >
                                    <div className="h-32 bg-stone-200 relative overflow-hidden">
                                        {/* Placeholder Cover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-stone-700 to-stone-900 opacity-90" />
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                                                evt.status === 'active' 
                                                ? 'bg-green-500/20 text-green-100 border border-green-500/30' 
                                                : 'bg-white/20 text-white border border-white/30'
                                            }`}>
                                                {evt.status === 'active' ? 'Ativo' : 'Rascunho'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5">
                                        <h4 className="font-serif text-lg text-stone-900 mb-1">{evt.title}</h4>
                                        <p className="text-sm text-stone-500 flex items-center gap-1 mb-4">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(evt.date).toLocaleDateString('pt-BR')}
                                        </p>
                                        
                                        <div className="w-full bg-stone-200 rounded-full h-1.5 mb-2">
                                            <div 
                                                className="bg-stone-900 h-1.5 rounded-full" 
                                                style={{ width: `${(evt.guests / evt.limit) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-stone-500 text-right">
                                            {evt.guests} de {evt.limit} convidados
                                        </p>

                                        <div className="mt-5 pt-4 border-t border-stone-200 flex justify-between items-center">
                                            <Link href="#" className="text-sm font-medium text-stone-900 hover:underline">
                                                Editar Convite
                                            </Link>
                                            <Link href={`/demo/invitation`} className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
                                                Visualizar
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
