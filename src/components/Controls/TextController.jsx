import { Section, Label, Input, TextArea } from './UI';

export const TextController = ({ content, updateContent }) => {
    return (
        <Section title="Text Content">
            <div>
                <Label>Title</Label>
                <TextArea
                    value={content.title}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Enter title..."
                    rows={2}
                />
            </div>

            <div>
                <Label>Subtitle</Label>
                <TextArea
                    value={content.subtitle}
                    onChange={(e) => updateContent('subtitle', e.target.value)}
                    placeholder="Enter subtitle..."
                    rows={3}
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
