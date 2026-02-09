import { useState, useEffect } from 'react';

export const INITIAL_STATE = {
    size: { width: 1080, height: 1080, name: 'SNS Square' },
    content: {
        title: 'Main Copy',
        subtitle: 'Please enter a sub-copy',
        cta: 'CTA'
    },
    style: {
        fontFamily: 'Pretendard',
        fontSizeTitle: 64,
        fontSizeSubtitle: 32,
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        textColor: '#000000',
        backgroundColor: '#ffffff',
        padding: 60,
        borderRadius: 20,
        shadow: 'none',
        align: 'center',
        gap: 24,
    },
    image: {
        background: null,
        product: null,
        overlayOpacity: 0.1
    }
};

const STORAGE_KEY = 'banner-builder-state-v1';

export const useBannerState = () => {
    const [banner, setBanner] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : INITIAL_STATE;
        } catch (e) {
            console.error('Failed to load from storage', e);
            return INITIAL_STATE;
        }
    });

    // Auto-save effect
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(banner));
        } catch (e) {
            console.error('Failed to save to storage', e);
        }
    }, [banner]);

    const updateSize = (width, height, name = 'Custom') => {
        setBanner(prev => ({ ...prev, size: { width, height, name } }));
    };

    const updateContent = (key, value) => {
        setBanner(prev => ({
            ...prev,
            content: { ...prev.content, [key]: value }
        }));
    };

    const updateStyle = (key, value) => {
        setBanner(prev => ({
            ...prev,
            style: { ...prev.style, [key]: value }
        }));
    };

    const updateImage = (key, value) => {
        setBanner(prev => ({
            ...prev,
            image: { ...prev.image, [key]: value }
        }));
    };

    // New: Method to replace entire state (for Import)
    const setBannerState = (newState) => {
        setBanner(newState);
    };

    return {
        banner,
        updateSize,
        updateContent,
        updateStyle,
        updateImage,
        setBannerState
    };
};
