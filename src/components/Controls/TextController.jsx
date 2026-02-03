import { Section, Label, Input } from './UI';

export const TextController = ({ content, updateContent }) => {
    return (
        <Section title="Text Content">
            <div>
                <Label>Title</Label>
                <Input
                    value={content.title}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Enter title..."
                />
            </div>

            <div>
                <Label>Subtitle</Label>
                <Input
                    value={content.subtitle}
                    onChange={(e) => updateContent('subtitle', e.target.value)}
                    placeholder="Enter subtitle..."
                />
            </div>

            <div>
                <Label>Button Text (CTA)</Label>
                <Input
                    value={content.cta}
                    onChange={(e) => updateContent('cta', e.target.value)}
                    placeholder="e.g. Shop Now"
                />
            </div>
        </Section>
    );
};
