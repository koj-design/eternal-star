import { Section, Label, Input, Select } from './UI';

const PRESETS = [
    { label: 'Custom', value: 'custom', w: 1080, h: 1080 },
    { label: 'Instagram Post (1:1)', value: 'ig-post', w: 1080, h: 1080 },
    { label: 'Instagram Story (9:16)', value: 'ig-story', w: 1080, h: 1920 },
    { label: 'Twitter Header (3:1)', value: 'tw-header', w: 1500, h: 500 },
    { label: 'YouTube Thumbnail (16:9)', value: 'yt-thumb', w: 1280, h: 720 },
    { label: 'Google Ad (300x250)', value: '300x250', w: 300, h: 250 },
    { label: 'Leaderboard (728x90)', value: '728x90', w: 728, h: 90 },
];

export const SizeController = ({ size, updateSize }) => {
    const handlePresetChange = (e) => {
        const preset = PRESETS.find(p => p.value === e.target.value);
        if (preset) {
            updateSize(preset.w, preset.h, preset.label);
        }
    };

    const isCustom = !PRESETS.some(p => p.w === size.width && p.h === size.height);
    const currentPreset = isCustom ? 'custom' : PRESETS.find(p => p.w === size.width && p.h === size.height)?.value;

    return (
        <Section title="Size & Dimensions">
            <div>
                <Label>Platform Preset</Label>
                <Select
                    value={currentPreset}
                    onChange={handlePresetChange}
                    options={PRESETS}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <Label>Width (px)</Label>
                    <Input
                        type="number"
                        value={size.width}
                        onChange={(e) => updateSize(Number(e.target.value), size.height)}
                    />
                </div>
                <div>
                    <Label>Height (px)</Label>
                    <Input
                        type="number"
                        value={size.height}
                        onChange={(e) => updateSize(size.width, Number(e.target.value))}
                    />
                </div>
            </div>
        </Section>
    );
};
