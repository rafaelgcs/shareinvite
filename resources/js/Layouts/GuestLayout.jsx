import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-stone-900 pt-6 sm:justify-center sm:pt-0 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stone-700 rounded-full mix-blend-screen filter blur-[128px] opacity-30 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-stone-800 rounded-full mix-blend-screen filter blur-[128px] opacity-40 pointer-events-none" />
                    
            <div className="relative z-10">
                <Link href="/" className="flex items-center gap-3">
                    <ApplicationLogo className="h-12 w-12" />
                    <span className="font-serif text-3xl text-white tracking-wide">ShareInvite</span>
                </Link>
            </div>

            <div className="relative z-10 mt-8 w-full overflow-hidden bg-white px-8 py-8 shadow-2xl sm:max-w-md sm:rounded-3xl border border-stone-200">
                {children}
            </div>
        </div>
    );
}
