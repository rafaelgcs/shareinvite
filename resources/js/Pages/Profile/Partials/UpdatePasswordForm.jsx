import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-[#0A0A0A] rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-xl shadow-black/10">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h2 className="font-serif text-3xl font-black text-[#0A0A0A] tracking-tight">
                        Alterar Senha
                    </h2>
                </div>

                <p className="text-stone-500 font-medium">
                    Certifique-se de que sua conta esteja usando uma senha longa e aleatória para se manter segura.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-8 max-w-xl">
                <div className="space-y-3">
                    <InputLabel
                        htmlFor="current_password"
                        value="Senha Atual"
                        className="uppercase text-[10px] font-black tracking-widest text-stone-400"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="w-full"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div className="space-y-3">
                    <InputLabel htmlFor="password" value="Nova Senha" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="space-y-3">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Nova Senha"
                        className="uppercase text-[10px] font-black tracking-widest text-stone-400"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="w-full"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-6 pt-4">
                    <PrimaryButton disabled={processing} className="premium-button bg-[#0A0A0A] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                        {processing ? 'Alterando...' : 'Atualizar Senha'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Senha alterada com sucesso.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
