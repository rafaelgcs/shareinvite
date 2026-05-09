import { useState } from 'react';
import { MapPin } from 'lucide-react';

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
            <div className="space-y-8">
                {locations.map((loc) => (
                    <div key={loc.id} className="w-full rounded-3xl overflow-hidden bg-white shadow-lg border border-stone-100 flex flex-col md:flex-row">
                        {/* Map Mini Placeholder */}
                        <div className="w-full md:w-48 h-48 bg-stone-100 relative shrink-0">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <MapPin className="w-8 h-8 text-stone-300" />
                            </div>
                        </div>
                        
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="font-serif text-2xl text-stone-900 mb-2">{loc.name}</h4>
                                <p className="text-stone-500 mb-4">{loc.address}</p>
                                {loc.notes && (
                                    <p className="text-sm text-stone-400 italic mb-4">"{loc.notes}"</p>
                                )}
                            </div>
                            
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-stone-900 font-medium hover:underline"
                            >
                                <MapPin className="w-4 h-4" />
                                Abrir no Google Maps
                            </a>
                        </div>
                    </div>
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
