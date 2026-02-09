import { Section, Label, Input } from './UI';
import { Upload, X } from 'lucide-react';

export const ImageController = ({ image, updateImage }) => {
    const handleFileChange = (key, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                updateImage(key, ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (key) => {
        updateImage(key, null);
    };

    return (
        <Section title="Images">
            <div style={{ marginBottom: '16px' }}>
                <Label>Background Image</Label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {image.background ? (
                        <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                            <img src={image.background} alt="bg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                                onClick={() => removeImage('background')}
                                style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', padding: 2 }}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange('background', e)}
                                style={{ paddingLeft: '32px' }}
                            />
                            <Upload size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-sub)' }} />
                        </div>
                    )}
                </div>
                {image.background && (
                    <div style={{ marginTop: '8px' }}>
                        <Label>Overlay Opacity</Label>
                        <Input
                            type="range"
                            min="0"
                            max="0.9"
                            step="0.1"
                            value={image.overlayOpacity}
                            onChange={(e) => updateImage('overlayOpacity', Number(e.target.value))}
                            style={{ padding: 0 }}
                        />
                    </div>
                )}
            </div>


        </Section>
    );
};
