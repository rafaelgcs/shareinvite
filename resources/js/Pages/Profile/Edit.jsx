import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, ShieldCheck, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <h2 className="font-serif text-4xl text-[#0A0A0A] tracking-tight leading-none">
                        Configurações de Perfil
                    </h2>
                    <p className="text-stone-500 font-medium italic">Gerencie sua identidade na Miu Invites.</p>
                </div>
            }
        >
            <Head title="Meu Perfil" />

            <div className="py-12 bg-[#F9F8F6] min-h-screen">
                <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
                    
                    {/* Informações do Perfil */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow-xl rounded-[3rem] border border-stone-100 p-8 sm:p-12 ambient-shadow overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <User className="w-64 h-64 text-[#0A0A0A]" />
                        </div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </motion.div>

                    {/* Alterar Senha */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white shadow-xl rounded-[3rem] border border-stone-100 p-8 sm:p-12 ambient-shadow overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <ShieldCheck className="w-64 h-64 text-[#D4AF37]" />
                        </div>
                        <UpdatePasswordForm />
                    </motion.div>

                    {/* Exclusão de Conta */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-red-50/30 shadow-xl rounded-[3rem] border border-red-100 p-8 sm:p-12 ambient-shadow overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                            <Trash2 className="w-64 h-64 text-red-600" />
                        </div>
                        <DeleteUserForm />
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
