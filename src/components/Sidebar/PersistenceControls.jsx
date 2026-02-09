import { Save, FolderOpen, RotateCcw } from 'lucide-react';

export const PersistenceControls = ({ banner, onReset }) => {

    const handleSave = () => {
        // Explicitly save to local storage (redundant with auto-save but good for manual confirmation)
        localStorage.setItem('banner-builder-state-v1', JSON.stringify(banner));
        alert('Settings have been saved.');
    };

    return (
        <div style={{
            marginTop: 'auto',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
            <button
                onClick={() => {
                    if (window.confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
                        onReset();
                    }
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--color-bg-main)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--color-text-main)',
                    width: '100%'
                }}
                title="Reset to default settings"
            >
                <RotateCcw size={18} /> Reset
            </button>
            <button
                onClick={handleSave}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--color-primary, #000000)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--color-secondary, #ffffff)',
                    width: '100%'
                }}
                title="Save current settings"
            >
                <Save size={18} /> Save
            </button>
        </div>
    );
};
