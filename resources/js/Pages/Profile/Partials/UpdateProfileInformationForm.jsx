import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { User, CheckCircle } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-[#0A0A0A] rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-xl shadow-black/10">
                        <User className="w-6 h-6" />
                    </div>
                    <h2 className="font-serif text-3xl font-black text-[#0A0A0A] tracking-tight">
                        Informações do Perfil
                    </h2>
                </div>

                <p className="text-stone-500 font-medium">
                    Atualize as informações básicas da sua conta e seu endereço de e-mail.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-8 max-w-xl">
                <div className="space-y-3">
                    <InputLabel htmlFor="name" value="Nome Completo" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                    <TextInput
                        id="name"
                        className="w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="space-y-3">
                    <InputLabel htmlFor="email" value="Endereço de E-mail" className="uppercase text-[10px] font-black tracking-widest text-stone-400" />
                    <TextInput
                        id="email"
                        type="email"
                        className="w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100">
                        <p className="text-sm text-stone-600 font-medium">
                            Seu endereço de e-mail não foi verificado.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="block mt-2 text-[#D4AF37] font-black uppercase text-[10px] tracking-widest hover:underline"
                            >
                                Clique aqui para reenviar o e-mail de verificação.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-4 text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Um novo link de verificação foi enviado para seu e-mail.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                    <PrimaryButton disabled={processing} className="premium-button bg-[#0A0A0A] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                        {processing ? 'Salvando...' : 'Salvar Alterações'}
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
                            Atualizado com sucesso.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
