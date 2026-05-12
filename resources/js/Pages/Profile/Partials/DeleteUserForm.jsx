import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-xl shadow-red-600/10">
                        <Trash2 className="w-6 h-6" />
                    </div>
                    <h2 className="font-serif text-3xl font-black text-red-600 tracking-tight">
                        Excluir Conta
                    </h2>
                </div>

                <p className="text-stone-500 font-medium">
                    Uma vez que sua conta seja excluída, todos os seus recursos e dados serão permanentemente removidos.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="premium-button bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/20">
                Excluir Minha Conta Permanentemente
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={deleteUser} className="p-10 sm:p-16 bg-white rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none text-red-600">
                        <AlertTriangle className="w-64 h-64" />
                    </div>

                    <h2 className="font-serif text-3xl font-black text-[#0A0A0A] mb-6 relative z-10">
                        Você tem certeza absoluta?
                    </h2>

                    <p className="text-stone-500 font-medium mb-10 relative z-10 leading-relaxed">
                        Esta ação não pode ser desfeita. Por favor, insira sua senha para confirmar que deseja excluir permanentemente sua conta da Miu Invites.
                    </p>

                    <div className="relative z-10 space-y-4">
                        <InputLabel
                            htmlFor="password"
                            value="Sua Senha de Acesso"
                            className="uppercase text-[10px] font-black tracking-widest text-stone-400"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="w-full"
                            isFocused
                            placeholder="Digite sua senha para confirmar..."
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row justify-end gap-4 relative z-10">
                        <SecondaryButton onClick={closeModal} className="px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border-stone-200 text-stone-500 hover:bg-stone-50 transition-all">
                            Cancelar e Manter Conta
                        </SecondaryButton>

                        <DangerButton className="px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-red-600 text-white shadow-xl shadow-red-600/20" disabled={processing}>
                            {processing ? 'Excluindo...' : 'Sim, Excluir Agora'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
