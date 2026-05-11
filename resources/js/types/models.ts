export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
}

export interface Plan {
    id: number;
    name: string;
    price: number;
    guests_limit: number;
    features: string[];
}

export interface Event {
    id: number;
    user_id: number;
    plan_id: number | null;
    slug: string;
    title: string;
    cover_image: string | null;
    logo: string | null;
    primary_color: string;
    secondary_color: string;
    text_color: string;
    background_color: string;
    animation_type: string;
    theme: string;
    event_date: string;
    rsvp_enabled: boolean;
    rsvp_deadline: string | null;
    allow_extra_guests: boolean;
    max_extra_guests: number;
    status: 'active' | 'pending' | 'finished';
    is_paid: boolean;
    created_at: string;
    updated_at: string;
    
    guests?: number | Guest[]; // Can be count or list
    limit: number;  // Added to match frontend usage
    
    // Relationships (optional)
    user?: User;
    plan?: Plan;
    guests_count?: number;
}

export interface Guest {
    id: number;
    event_id: number;
    name: string;
    email: string | null;
    phone: string | null;
    confirmed: boolean;
    extra_guests: number;
    qr_code: string;
    created_at: string;
}

export interface EventLocation {
    id: number;
    event_id: number;
    name: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    type: string;
}

export interface EventNotice {
    id: number;
    event_id: number;
    title: string;
    content: string;
    priority: 'normal' | 'high' | 'urgent';
    created_at: string;
}
