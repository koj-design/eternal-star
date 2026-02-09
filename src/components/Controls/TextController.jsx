import { Section, Label, Input, TextArea } from './UI';

export const TextController = ({ content, updateContent }) => {
    return (
        <Section title="Text Content">
            <div>
                <Label>Copy</Label>
                <TextArea
                    value={content.title}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Enter copy..."
                    rows={2}
                />
            </div>

            <div>
                <Label>Sub Copy</Label>
                <TextArea
                    value={content.subtitle}
                    onChange={(e) => updateContent('subtitle', e.target.value)}
                    placeholder="Enter sub copy..."
                    rows={3}
                />
            </div>

            <div>
                <Label>CTA</Label>
                <Input
                    value={content.cta}
                    onChange={(e) => updateContent('cta', e.target.value)}
                    placeholder="CTA Text"
                />
            </div>
        </Section>
    );
};
