export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';

export const SEASON_ORDER: Season[] = ['Spring', 'Summer', 'Fall', 'Winter'];

export function getSeason(dateStr: string): Season {
    const month = new Date(dateStr).getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
}

export interface RecentItem {
    url: string;
    type: string;
    size: number;
    displayName: string | null;
    price: number | null;
    createdAt: string;
    category: string | null;
}
