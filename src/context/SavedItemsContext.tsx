'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface SavedItem {
    url: string;
    displayName: string | null;
    price: number | null;
    type: string;
    createdAt: string;
}

interface SavedItemsContextType {
    savedItems: SavedItem[];
    toggleSave: (item: SavedItem) => void;
    isSaved: (url: string) => boolean;
    count: number;
}

const SavedItemsContext = createContext<SavedItemsContextType | null>(null);

const STORAGE_KEY = 'rjgarment_saved';

export function SavedItemsProvider({ children }: { children: ReactNode }) {
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setSavedItems(JSON.parse(stored));
        } catch {}
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
        }
    }, [savedItems, hydrated]);

    const toggleSave = useCallback((item: SavedItem) => {
        setSavedItems((prev) => {
            const exists = prev.find((i) => i.url === item.url);
            if (exists) return prev.filter((i) => i.url !== item.url);
            return [item, ...prev];
        });
    }, []);

    const isSaved = useCallback((url: string) => {
        return savedItems.some((i) => i.url === url);
    }, [savedItems]);

    return (
        <SavedItemsContext.Provider value={{ savedItems, toggleSave, isSaved, count: savedItems.length }}>
            {children}
        </SavedItemsContext.Provider>
    );
}

export function useSavedItems() {
    const ctx = useContext(SavedItemsContext);
    if (!ctx) throw new Error('useSavedItems must be used within SavedItemsProvider');
    return ctx;
}
