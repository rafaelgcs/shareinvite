import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Camera, ShieldCheck, UserCheck, Users, Calendar } from 'lucide-react';

interface CheckInProps {
    event: {
        id: number;
        title: string;
        event_date: string;
    };
}

export default function CheckIn({ event }: CheckInProps) {
    const [scanResult, setScanResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;

        if (isScanning && !scanResult) {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error));
            }
        };
    }, [isScanning, scanResult]);

    async function onScanSuccess(decodedText: string) {
        setIsScanning(false);
        handleCheckIn(decodedText);
    }

    function onScanFailure(error: any) {
        // console.warn(`Code scan error = ${error}`);
    }

    const handleCheckIn = async (uuid: string) => {
        setLoading(true);
        setError(null);
        setScanResult(null);

        try {
            const response = await fetch(`/api/guests/${uuid}/check-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setScanResult({
                    success: true,
                    guest: data.guest,
                    message: data.message
                });
            } else {
                setScanResult({
                    success: false,
                    guest: data.guest,
                    message: data.message,
                    alreadyCheckedIn: data.already_checked_in
                });
            }
        } catch (err) {
            setError('Erro ao processar o check-in. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setError(null);
        setIsScanning(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Check-in: {event.title}</h2>
                    <Link 
                        href={route('events.show', event.id)}
                        className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                    >
                        Voltar ao Painel
                    </Link>
                </div>
            }
        >
            <Head title={`Check-in - ${event.title}`} />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-stone-100">
                        <div className="p-8 text-center">
                            <div className="mb-8">
                                <div className="w-16 h-16 bg-stone-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-serif text-stone-900">Validação de Convites</h3>
                                <p className="text-stone-500 text-sm mt-2">Aponte a câmera para o QR Code do convidado</p>
                            </div>

                            <AnimatePresence mode="wait">
                                {!isScanning && !scanResult && !loading && (
                                    <motion.div
                                        key="start"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <button
                                            onClick={() => setIsScanning(true)}
                                            className="w-full py-6 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
                                        >
                                            <Camera className="w-6 h-6" />
                                            Iniciar Scanner
                                        </button>
                                        
                                        <div className="mt-8 grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col items-center">
                                                <Calendar className="w-5 h-5 text-stone-400 mb-2" />
                                                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Data</span>
                                                <span className="text-sm font-medium text-stone-700">
                                                    {new Date(event.event_date).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col items-center">
                                                <Users className="w-5 h-5 text-stone-400 mb-2" />
                                                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Evento</span>
                                                <span className="text-sm font-medium text-stone-700 truncate w-full">
                                                    {event.title}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {isScanning && !scanResult && (
                                    <motion.div
                                        key="scanner"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative"
                                    >
                                        <div id="reader" className="overflow-hidden rounded-2xl border-2 border-stone-200 bg-stone-50"></div>
                                        <button
                                            onClick={() => setIsScanning(false)}
                                            className="mt-6 text-stone-400 text-sm hover:text-stone-600 underline"
                                        >
                                            Cancelar
                                        </button>
                                    </motion.div>
                                )}

                                {loading && (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-12 flex flex-col items-center"
                                    >
                                        <Loader2 className="w-12 h-12 text-stone-900 animate-spin mb-4" />
                                        <p className="text-stone-500 font-medium">Validando convite...</p>
                                    </motion.div>
                                )}

                                {scanResult && (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-8 rounded-3xl border-2 ${
                                            scanResult.success 
                                                ? 'bg-green-50 border-green-200' 
                                                : scanResult.alreadyCheckedIn 
                                                    ? 'bg-amber-50 border-amber-200'
                                                    : 'bg-red-50 border-red-200'
                                        }`}
                                    >
                                        <div className="flex justify-center mb-6">
                                            {scanResult.success ? (
                                                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                                                    <UserCheck className="w-10 h-10" />
                                                </div>
                                            ) : (
                                                <div className={`w-20 h-20 ${scanResult.alreadyCheckedIn ? 'bg-amber-500' : 'bg-red-500'} text-white rounded-full flex items-center justify-center shadow-lg`}>
                                                    <XCircle className="w-10 h-10" />
                                                </div>
                                            )}
                                        </div>

                                        <h4 className={`text-2xl font-bold mb-2 ${
                                            scanResult.success ? 'text-green-900' : scanResult.alreadyCheckedIn ? 'text-amber-900' : 'text-red-900'
                                        }`}>
                                            {scanResult.message}
                                        </h4>

                                        {scanResult.guest && (
                                            <div className="mt-6 text-left bg-white/50 p-6 rounded-2xl border border-white">
                                                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Convidado</p>
                                                <p className="text-xl font-serif text-stone-900 mb-4">{scanResult.guest.name}</p>
                                                
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Acompanhantes</p>
                                                        <p className="font-medium text-stone-700">{scanResult.guest.extra_guests}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Confirmado em</p>
                                                        <p className="font-medium text-stone-700">
                                                            {new Date(scanResult.guest.confirmed_at).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={resetScanner}
                                            className={`w-full mt-8 py-4 rounded-xl font-bold transition-all shadow-md hover:scale-[1.02] active:scale-95 ${
                                                scanResult.success 
                                                    ? 'bg-green-600 text-white hover:bg-green-700' 
                                                    : 'bg-stone-900 text-white hover:bg-stone-800'
                                            }`}
                                        >
                                            Próximo Convidado
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                #reader__scan_region {
                    background: #f5f5f4;
                }
                #reader__dashboard_section_csr button {
                    background: #1c1917 !important;
                    color: white !important;
                    border: none !important;
                    padding: 8px 16px !important;
                    border-radius: 8px !important;
                    font-size: 14px !important;
                    cursor: pointer !important;
                }
                #reader__dashboard_section_csr {
                    padding: 20px !important;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
