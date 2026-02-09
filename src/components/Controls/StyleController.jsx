import { Section, Label, Input, Select } from './UI';

export const StyleController = ({ style, updateStyle }) => {
    return (
        <Section title="Style & Layout">
            {/* Colors */}
            <Label>Colors</Label>

            {/* Theme Presets */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                    onClick={() => {
                        updateStyle('primaryColor', '#000000');
                        updateStyle('textColor', '#000000');
                        updateStyle('backgroundColor', '#ffffff');
                        updateStyle('secondaryColor', '#ffffff');
                    }}
                    style={{
                        flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd',
                        background: '#ffffff', color: '#000000', cursor: 'pointer', fontWeight: 600
                    }}
                >
                    White Theme
                </button>
                <button
                    onClick={() => {
                        updateStyle('primaryColor', '#ffffff');
                        updateStyle('textColor', '#ffffff');
                        updateStyle('backgroundColor', '#000000');
                        updateStyle('secondaryColor', '#000000');
                    }}
                    style={{
                        flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #333',
                        background: '#000000', color: '#ffffff', cursor: 'pointer', fontWeight: 600
                    }}
                >
                    Black Theme
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div>
                    <Input
                        type="color"
                        value={style.primaryColor}
                        onChange={(e) => updateStyle('primaryColor', e.target.value)}
                        style={{ padding: 2, height: 36, cursor: 'pointer' }}
                        title="Primary Color"
                    />
                </div>
                <div>
                    <Input
                        type="color"
                        value={style.backgroundColor}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        style={{ padding: 2, height: 36, cursor: 'pointer' }}
                        title="Background Color"
                    />
                </div>
                <div>
                    <Input
                        type="color"
                        value={style.textColor}
                        onChange={(e) => {
                            const val = e.target.value;
                            updateStyle('textColor', val);
                            updateStyle('primaryColor', val); // Sync CTA background
                        }}
                        style={{ padding: 2, height: 36, cursor: 'pointer' }}
                        title="Text Color (Syncs with Button)"
                    />
                </div>
                <div>
                    <Input
                        type="color"
                        value={style.secondaryColor}
                        onChange={(e) => updateStyle('secondaryColor', e.target.value)}
                        style={{ padding: 2, height: 36, cursor: 'pointer' }}
                        title="Button Text Color"
                    />
                </div>
            </div>

            {/* Typography */}
            <Label>Typography</Label>
            <div style={{ marginBottom: '16px' }}>
                <Select
                    value={style.fontFamily}
                    onChange={(e) => updateStyle('fontFamily', e.target.value)}
                    options={[
                        { label: 'Pretendard (Clean)', value: 'Pretendard' },
                        { label: 'Gmarket Sans (Bold)', value: '"Gmarket Sans"' },
                        { label: 'Serif (Classic)', value: 'serif' },
                        { label: 'Monospace (Code)', value: 'monospace' },
                    ]}
                />
            </div>

            {/* Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <Label>Padding (px)</Label>
                    <Input
                        type="number"
                        value={style.padding}
                        onChange={(e) => updateStyle('padding', Number(e.target.value))}
                    />
                </div>
                <div>
                    <Label>Gap (px)</Label>
                    <Input
                        type="number"
                        value={style.gap}
                        onChange={(e) => updateStyle('gap', Number(e.target.value))}
                    />
                </div>
                <div>
                    <Label>Radius (px)</Label>
                    <Input
                        type="number"
                        value={style.borderRadius}
                        onChange={(e) => updateStyle('borderRadius', Number(e.target.value))}
                    />
                </div>
                <div>
                    <Label>Alignment</Label>
                    <Select
                        value={style.align}
                        onChange={(e) => updateStyle('align', e.target.value)}
                        options={[
                            { label: 'Left', value: 'left' },
                            { label: 'Center', value: 'center' },
                            { label: 'Right', value: 'right' },
                        ]}
                    />
                </div>
            </div>
        </Section>
    );
};
