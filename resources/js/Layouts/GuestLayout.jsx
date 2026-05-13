import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#0A0A0A] pt-10 sm:justify-center sm:pt-0 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-screen filter blur-[128px] opacity-10 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full mix-blend-screen filter blur-[128px] opacity-10 pointer-events-none" />

            <div className="relative z-10 mb-10">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="p-3 bg-[#D4AF37] rounded-2xl shadow-xl shadow-[#D4AF37]/20 group-hover:rotate-6 transition-transform">
                        <ApplicationLogo className="h-8 w-8 text-[#0A0A0A]" />
                    </div>
                    <span className="font-serif text-4xl text-white tracking-tighter">Miu<span className="text-[#D4AF37]">Invites</span></span>
                </Link>
            </div>

            <div className="relative z-10 w-full overflow-hidden bg-white px-10 py-12 shadow-2xl sm:max-w-md sm:rounded-[3rem] border border-white/10 ambient-shadow">
                {children}
            </div>

            <div className="relative z-10 mt-10">
                <p className="text-stone-500 text-xs font-black uppercase tracking-[0.2em]">© 2026 Miu Invites — Convites Digitais</p>
            </div>
        </div>
    );
}
