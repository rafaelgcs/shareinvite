import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { LayoutDashboard, User, LogOut, Menu, X, ChevronDown, Bell, Settings, Crown, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            <Toaster position="top-center" richColors theme="light" expand={true} />
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
                scrolled 
                ? 'bg-white/80 backdrop-blur-xl border-stone-200/60 py-2 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]' 
                : 'bg-[#0A0A0A] border-white/5 py-4'
            }`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 justify-between items-center">
                        <div className="flex items-center gap-10">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className={`p-2.5 rounded-2xl transition-all duration-500 shadow-lg ${scrolled ? 'bg-[#0A0A0A] rotate-0' : 'bg-[#D4AF37] rotate-3 group-hover:rotate-0'}`}>
                                        <ApplicationLogo className={`block h-5 w-5 ${scrolled ? 'text-white' : 'text-[#0A0A0A]'}`} />
                                    </div>
                                    <span className={`font-serif text-2xl tracking-tighter transition-colors duration-500 hidden sm:block ${
                                        scrolled ? 'text-[#0A0A0A]' : 'text-white'
                                    }`}>
                                        Miu<span className={scrolled ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}>Invites</span>
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden sm:flex items-center gap-1">
                                <Link
                                    href={route('dashboard')}
                                    className={`relative px-6 py-2 text-sm font-black uppercase tracking-[0.15em] transition-all duration-300 group ${
                                        route().current('dashboard')
                                        ? (scrolled ? 'text-[#0A0A0A]' : 'text-[#D4AF37]')
                                        : (scrolled ? 'text-stone-400 hover:text-[#0A0A0A]' : 'text-stone-500 hover:text-white')
                                    }`}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <LayoutDashboard className={`w-3.5 h-3.5 transition-transform group-hover:scale-110`} />
                                        Painel
                                    </span>
                                    {route().current('dashboard') && (
                                        <motion.div 
                                            layoutId="nav-active"
                                            className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full ${scrolled ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]'}`}
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                                
                                {/* Adicionando links fictícios para demonstrar o layout melhorado */}
                                <button
                                    className={`relative px-6 py-2 text-sm font-black uppercase tracking-[0.15em] transition-all duration-300 group ${
                                        scrolled ? 'text-stone-400 hover:text-[#0A0A0A]' : 'text-stone-500 hover:text-white'
                                    }`}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Users className={`w-3.5 h-3.5 transition-transform group-hover:scale-110`} />
                                        Contatos
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center gap-5">
                            <button className={`p-2 rounded-full transition-colors ${scrolled ? 'text-stone-400 hover:text-[#0A0A0A] hover:bg-stone-100' : 'text-stone-500 hover:text-white hover:bg-white/10'}`}>
                                <Bell className="w-5 h-5" />
                            </button>
                            
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className={`inline-flex items-center gap-3 rounded-[1.25rem] border px-4 py-2 text-sm font-bold transition-all duration-500 group ${
                                                scrolled 
                                                ? 'border-stone-200 bg-white text-[#0A0A0A] hover:border-[#D4AF37] shadow-sm' 
                                                : 'border-white/10 bg-white/5 text-stone-300 hover:border-white/30 hover:text-white'
                                            }`}
                                        >
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-[#0A0A0A] overflow-hidden border-2 transition-colors ${scrolled ? 'bg-[#D4AF37] border-white shadow-sm' : 'bg-[#D4AF37] border-white/20'}`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="max-w-[120px] truncate">{user.name}</span>
                                            <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="56" contentClasses={`py-2 bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden`}>
                                        <div className="px-5 py-4 bg-stone-50/50 border-b border-stone-100 mb-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.2em]">Conta Premium</p>
                                                <Crown className="w-3 h-3 text-[#D4AF37]" />
                                            </div>
                                            <p className="text-sm font-black text-[#0A0A0A] truncate leading-none mb-1">{user.name}</p>
                                            <p className="text-xs text-stone-400 truncate">{user.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-3 text-stone-600 hover:text-[#0A0A0A] hover:bg-stone-50 transition-all px-5 py-3 font-medium">
                                            <div className="p-1.5 bg-stone-100 rounded-lg group-hover:bg-white transition-colors">
                                                <User className="w-4 h-4" />
                                            </div>
                                            Meu Perfil
                                        </Dropdown.Link>
                                        <div className="h-px bg-stone-100 mx-5 my-1" />
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-3 text-red-500 hover:bg-red-50 transition-all w-full text-left px-5 py-3 font-medium"
                                        >
                                            <div className="p-1.5 bg-red-50 rounded-lg">
                                                <LogOut className="w-4 h-4" />
                                            </div>
                                            Sair da Conta
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className={`inline-flex items-center justify-center rounded-2xl p-2.5 transition-all duration-300 ${
                                    scrolled 
                                    ? 'text-[#0A0A0A] hover:bg-stone-100' 
                                    : 'text-white hover:bg-white/10'
                                }`}
                            >
                                {showingNavigationDropdown ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {showingNavigationDropdown && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`sm:hidden overflow-hidden border-t shadow-2xl ${
                                scrolled ? 'bg-white border-stone-100' : 'bg-[#0A0A0A] border-white/5'
                            }`}
                        >
                            <div className="space-y-2 px-4 pb-8 pt-6">
                                <ResponsiveNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] text-base font-black transition-all ${
                                        route().current('dashboard')
                                        ? (scrolled ? 'bg-[#0A0A0A] text-white' : 'bg-[#D4AF37] text-[#0A0A0A]')
                                        : (scrolled ? 'text-stone-600 hover:bg-stone-50' : 'text-stone-400 hover:bg-white/5 hover:text-white')
                                    }`}
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Painel Dashboard
                                </ResponsiveNavLink>
                                
                                <div className={`mt-8 pt-8 border-t ${scrolled ? 'border-stone-100' : 'border-white/5'}`}>
                                    <div className="px-5 mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Membro Gold</span>
                                            <Crown className="w-3 h-3 text-[#D4AF37]" />
                                        </div>
                                        <p className={`font-serif text-2xl tracking-tight leading-none mb-1 ${scrolled ? 'text-[#0A0A0A]' : 'text-white'}`}>{user.name}</p>
                                        <p className="text-sm text-stone-500 font-medium">{user.email}</p>
                                    </div>
                                    
                                    <ResponsiveNavLink 
                                        href={route('profile.edit')}
                                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold ${
                                            scrolled ? 'text-stone-600 hover:bg-stone-50' : 'text-stone-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <User className="w-5 h-5" />
                                        Configurações de Perfil
                                    </ResponsiveNavLink>
                                    
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        className="flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold text-red-500 hover:bg-red-50 w-full text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Encerrar Sessão
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {header && (
                <header className="bg-white pt-32 pb-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className={header ? '' : 'pt-28'}>{children}</main>

            <footer className="py-12 border-t border-stone-200 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-stone-400 text-sm font-medium">© 2026 Miu Invites — Alta Papelaria Digital</p>
                </div>
            </footer>
        </div>
    );
}
