import { useRef } from 'react';
import { Save, FolderOpen } from 'lucide-react';

export const PersistenceControls = ({ banner, setBannerState }) => {
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
        <div style={{
            marginTop: 'auto',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px'
        }}>
            <button
                onClick={handleSave}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    color: 'var(--color-text-main)'
                }}
                title="Save project file (.json)"
            >
                <Save size={14} /> Save
            </button>

            <button
                onClick={() => fileInputRef.current.click()}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    color: 'var(--color-text-main)'
                }}
                title="Load project file (.json)"
            >
                <FolderOpen size={14} /> Load
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                style={{ display: 'none' }}
            />
        </div>
    );
};
