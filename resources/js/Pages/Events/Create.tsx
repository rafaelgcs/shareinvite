import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Calendar, Link as LinkIcon, Type } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        event_date: '',
        slug: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('events.store'));
    };

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setData(data => ({
            ...data,
            title: newTitle,
            slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-serif text-3xl text-stone-900 leading-tight">
                    Criar Novo Convite
                </h2>
            }
        >
            <Head title="Criar Convite" />

            <div className="py-6 sm:py-12 bg-stone-50 min-h-screen">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden shadow-xl rounded-3xl border border-stone-100"
                    >
                        <div className="p-6 sm:p-12">
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="font-serif text-2xl text-stone-900">1</span>
                                </div>
                                <h3 className="font-serif text-2xl text-stone-900">Informações Básicas</h3>
                                <p className="text-stone-500 mt-2">Vamos começar com o essencial para criar o seu evento.</p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Título do Evento" className="flex items-center gap-2">
                                        <Type className="w-4 h-4 text-stone-400" />
                                        Título do Evento
                                    </InputLabel>
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        autoFocus
                                        placeholder="Ex: Casamento Maria & João"
                                        onChange={handleTitleChange}
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="event_date" value="Data do Evento" className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-stone-400" />
                                            Data do Evento
                                        </InputLabel>
                                        <TextInput
                                            id="event_date"
                                            type="datetime-local"
                                            name="event_date"
                                            value={data.event_date}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('event_date', e.target.value)}
                                        />
                                        <InputError message={errors.event_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="slug" value="URL do Convite" className="flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4 text-stone-400" />
                                            Link Personalizado
                                        </InputLabel>
                                        <div className="mt-1 flex rounded-xl shadow-sm">
                                            <span className="inline-flex items-center px-2 sm:px-4 rounded-l-xl border border-r-0 border-stone-200 bg-stone-50 text-stone-500 text-[10px] sm:text-sm">
                                                shareinvite.com/
                                            </span>
                                            <TextInput
                                                id="slug"
                                                type="text"
                                                name="slug"
                                                value={data.slug}
                                                className="flex-1 block w-full rounded-none rounded-r-xl"
                                                placeholder="maria-e-joao"
                                                onChange={(e) => setData('slug', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.slug} className="mt-2" />
                                        <p className="text-xs text-stone-400 mt-2">Você poderá compartilhar este link com seus convidados.</p>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-stone-100">
                                    <PrimaryButton className="w-full py-4 text-base" disabled={processing}>
                                        {processing ? 'Salvando...' : 'Criar Evento e Configurar Detalhes'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
