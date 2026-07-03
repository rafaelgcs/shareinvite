/**
 * Date Utility Functions
 * Handles timezone conversions correctly for dates stored in the database
 */

/**
 * Parse a date string ensuring it's interpreted in the local timezone, not UTC
 * Handles both ISO date formats (YYYY-MM-DD) and datetime formats (YYYY-MM-DDTHH:mm:ss)
 * 
 * @param dateString - ISO date string from server
 * @returns Date object in local timezone
 */
export const parseLocalDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;

    // If it's just a date (YYYY-MM-DD), parse it as local date
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // month is 0-indexed in JS
    }

    // If it has time component, use standard Date parsing (handles ISO 8601)
    return new Date(dateString);
};

/**
 * Convert a Date object to YYYY-MM-DD string in local timezone
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateToString = (date: Date | null | undefined): string => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

/**
 * Format a date string for display in Brazilian Portuguese locale
 * @param dateString - ISO date string from server
 * @returns Formatted date string (e.g., "2 de julho de 2026")
 */
export const formatEventDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    
    const date = parseLocalDate(dateString);
    if (!date) return '-';
    
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format a date string for simple display (just date, no weekday)
 * @param dateString - ISO date string from server
 * @returns Formatted date string (e.g., "2 de julho de 2026")
 */
export const formatSimpleDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    
    const date = parseLocalDate(dateString);
    if (!date) return '-';
    
    return date.toLocaleDateString('pt-BR');
};

/**
 * Format a datetime for display
 * @param dateString - ISO datetime string from server
 * @returns Formatted datetime string (e.g., "2 de julho de 2026 às 14:30")
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    
    const date = parseLocalDate(dateString);
    if (!date) return '-';
    
    const dateFormatted = date.toLocaleDateString('pt-BR');
    const timeFormatted = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `${dateFormatted} às ${timeFormatted}`;
};

/**
 * Get the date in the format needed for HTML input type="date"
 * @param dateString - ISO date string from server or Date object
 * @returns Date string in YYYY-MM-DD format for input[type="date"]
 */
export const getDateInputValue = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return '';
    
    let date: Date;
    if (dateString instanceof Date) {
        date = dateString;
    } else {
        date = parseLocalDate(dateString);
    }
    
    if (!date) return '';
    
    return formatDateToString(date);
};
