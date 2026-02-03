import { useRef } from 'react';
import { Save, FolderOpen, Layout } from 'lucide-react';

export const SidebarHeader = ({ banner, setBannerState, toggleTheme, theme, onDownloadAll }) => {
    const fileInputRef = useRef(null);

    const handleSave = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(banner, null, 2));
        const link = document.createElement('a');
        link.href = dataStr;
        link.download = `banner-project-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                // Simple validation check
                if (importedData.size && importedData.content) {
                    setBannerState(importedData);
                    alert('Project loaded successfully!');
                } else {
                    alert('Invalid project file.');
                }
            } catch (err) {
                console.error('Failed to parse JSON', err);
                alert('Failed to load project file.');
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = null;
    };

    return (
        <header style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)' }}>
                        <Layout size={20} />
                        Banner Builder
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)', marginTop: '4px' }}>
                        Customize your banner
                    </p>
                </div>
            </div>

            {/* Main Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* 1. Project Persistence (Secondary Action -> Now Primary in Sidebar) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                        onClick={handleSave}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px',
                            fontSize: '0.875rem',
                            backgroundColor: 'var(--color-bg-panel)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            color: 'var(--color-text-main)'
                        }}
                        title="Save project file (.json)"
                    >
                        <Save size={14} /> Save Project
                    </button>

                    <button
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px',
                            fontSize: '0.875rem',
                            backgroundColor: 'var(--color-bg-panel)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            color: 'var(--color-text-main)'
                        }}
                        title="Load project file (.json)"
                    >
                        <FolderOpen size={14} /> Load Project
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImport}
                        accept=".json"
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
        </header>
    );
};
