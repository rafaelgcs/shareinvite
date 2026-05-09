import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface Location {
    id: number;
    name: string;
    address: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
}

interface GoogleMapWidgetProps {
    locations: Location[];
    layout?: 'tabs' | 'list';
}

export default function GoogleMapWidget({ locations, layout = 'tabs' }: GoogleMapWidgetProps) {
    const [activeLocation, setActiveLocation] = useState<Location | null>(locations[0] || null);

    if (locations.length === 0) return null;

    if (layout === 'list') {
        return (
            <div className="flex flex-col gap-12 max-w-3xl mx-auto">
                {locations.map((loc, index) => (
                    <motion.div 
                        key={loc.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-12 md:pl-16 group"
                    >
                        {/* Vertical line indicator */}
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-stone-200 group-last:bottom-auto group-last:h-12" />
                        
                        {/* Dot indicator */}
                        <div className="absolute left-[13px] top-2 w-2 h-2 rounded-full bg-stone-900 border-4 border-white ring-1 ring-stone-200 z-10" />

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex-1">
                                <h4 className="font-serif text-3xl text-stone-900 mb-3 group-hover:text-stone-600 transition-colors">
                                    {loc.name}
                                </h4>
                                <p className="text-stone-500 font-light leading-relaxed mb-4 max-w-lg">
                                    {loc.address}
                                </p>
                                
                                {loc.notes && (
                                    <p className="text-sm text-stone-400 italic font-light mb-4 flex items-start gap-2">
                                        <span className="text-stone-300">"</span>
                                        {loc.notes}
                                        <span className="text-stone-300">"</span>
                                    </p>
                                )}
                            </div>

                            <div className="shrink-0">
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-50 hover:border-stone-400 transition-all shadow-sm active:scale-95"
                                >
                                    <MapPin className="w-3.5 h-3.5" />
                                    Ver no Mapa
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden bg-white shadow-xl border border-stone-100">
            {/* Map Area Placeholder - In a real app, use @react-google-maps/api */}
            <div className="w-full h-64 bg-stone-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                    <span className="font-medium text-sm">Integração Google Maps</span>
                </div>
                {activeLocation && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 drop-shadow-md">
                        <MapPin className="w-8 h-8" />
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    {locations.map((loc) => (
                        <button
                            key={loc.id}
                            onClick={() => setActiveLocation(loc)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                activeLocation?.id === loc.id
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                        >
                            {loc.name}
                        </button>
                    ))}
                </div>

                {activeLocation && (
                    <div className="mt-2 space-y-4">
                        <div>
                            <h4 className="font-serif text-xl text-stone-900">{activeLocation.name}</h4>
                            <p className="text-stone-500 mt-1">{activeLocation.address}</p>
                        </div>
                        
                        {activeLocation.notes && (
                            <div className="p-4 bg-stone-50 rounded-xl text-sm text-stone-700 border border-stone-100">
                                <strong>Observação:</strong> {activeLocation.notes}
                            </div>
                        )}

                        <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
                        >
                            <MapPin className="w-4 h-4" />
                            Abrir no Maps
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
