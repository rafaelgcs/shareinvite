/**
 * RSVP Storage Utility
 * Ensures consistent localStorage key management for RSVP confirmations
 */

export const STORAGE_PREFIX = 'miu_guest_confirmed_';
export const OPENED_PREFIX = 'miu_invites_opened_';

/**
 * Get the storage key for a specific event's RSVP confirmation
 */
export const getRsvpStorageKey = (eventId: number | string): string => {
    if (!eventId) {
        console.warn('getRsvpStorageKey called with empty eventId');
        return STORAGE_PREFIX + '0'; // Fallback, should not happen
    }
    return `${STORAGE_PREFIX}${eventId}`;
};

/**
 * Get the storage key for a specific event's opened status
 */
export const getOpenedStorageKey = (slug: string): string => {
    if (!slug) {
        console.warn('getOpenedStorageKey called with empty slug');
        return OPENED_PREFIX + 'unknown';
    }
    return `${OPENED_PREFIX}${slug}`;
};

/**
 * Check if an event has RSVP confirmation saved locally
 */
export const isEventConfirmedLocally = (eventId: number | string): boolean => {
    if (!eventId) return false;
    const key = getRsvpStorageKey(eventId);
    return localStorage.getItem(key) === 'true';
};

/**
 * Mark an event as confirmed in localStorage
 */
export const markEventConfirmed = (eventId: number | string): void => {
    if (!eventId) {
        console.warn('markEventConfirmed called with empty eventId');
        return;
    }
    const key = getRsvpStorageKey(eventId);
    localStorage.setItem(key, 'true');
};

/**
 * Mark an invitation as opened in localStorage
 */
export const markInvitationOpened = (slug: string): void => {
    if (!slug) return;
    const key = getOpenedStorageKey(slug);
    localStorage.setItem(key, 'true');
};

/**
 * Check if an invitation has been opened
 */
export const hasInvitationOpened = (slug: string): boolean => {
    if (!slug) return false;
    const key = getOpenedStorageKey(slug);
    return localStorage.getItem(key) === 'true';
};

/**
 * Clear RSVP confirmation for an event (useful for testing or manual reset)
 */
export const clearEventConfirmation = (eventId: number | string): void => {
    if (!eventId) return;
    const key = getRsvpStorageKey(eventId);
    localStorage.removeItem(key);
};

/**
 * Debug: Get all RSVP keys in localStorage
 */
export const getAllRsvpKeys = (): { key: string; eventId: string }[] => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
            const eventId = key.replace(STORAGE_PREFIX, '');
            keys.push({ key, eventId });
        }
    }
    return keys;
};
