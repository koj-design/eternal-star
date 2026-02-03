import { useEffect, useState } from 'react';
import { Moon, Sun, LayoutGrid } from 'lucide-react';
import { SizeController } from '../Controls/SizeController';
import { TextController } from '../Controls/TextController';
import { StyleController } from '../Controls/StyleController';
import { ImageController } from '../Controls/ImageController';
import { PersistenceControls } from './PersistenceControls';

export const Sidebar = ({ banner, setBannerState, updateSize, updateContent, updateStyle, updateImage }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <div style={{ padding: '20px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Area: Title & Theme */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)' }}>
                        <LayoutGrid size={20} />
                        Banner Builder
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', marginTop: '4px' }}>
                        Customize your banner
                    </p>
                </div>

                <button
                    onClick={toggleTheme}
                    style={{
                        padding: '6px 8px',
                        borderRadius: '20px',
                        backgroundColor: 'var(--color-bg-main)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-sub)',
                        cursor: 'pointer'
                    }}
                    title="Toggle Theme"
                >
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                </button>
            </div>

            <SizeController size={banner.size} updateSize={updateSize} />
            <TextController content={banner.content} updateContent={updateContent} />
            <StyleController style={banner.style} updateStyle={updateStyle} />
            <ImageController image={banner.image} updateImage={updateImage} />

            {/* Persistence Controls at Bottom */}
            <PersistenceControls banner={banner} setBannerState={setBannerState} />
        </div>
    );
};
