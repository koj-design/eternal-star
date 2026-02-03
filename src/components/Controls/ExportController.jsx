import { Section } from './UI';
import { Download, Code } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';

export const ExportController = ({ banner, onDownloadAll }) => {

    const handleDownload = async (format) => {
        // Finds the first available banner node. In grid view, this acts as "Download First/Preview"
        // Ideally user uses the hover on grid items, but this remains as a fallback or single-view feature
        const node = document.querySelector('.banner-node');
        if (!node) return;

        try {
            let dataUrl;
            const options = { quality: 0.95, pixelRatio: 2 };

            if (format === 'png') {
                dataUrl = await toPng(node, options);
            } else {
                dataUrl = await toJpeg(node, options);
            }

            const link = document.createElement('a');
            link.download = `banner-preview.${format}`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to export image', err);
            alert('Failed to generate image. Please try again.');
        }
    };

    const handleCopyCode = () => {
        // ... same code generation logic ...
        const { size, content, style, image } = banner;

        // Simple HTML/CSS generation mimicking the logic
        const html = `
<div style="
  width: ${size.width}px;
  height: ${size.height}px;
  background-color: ${style.backgroundColor};
  ${image.background ? `background-image: url('${image.background}'); background-size: cover;` : ''}
  padding: ${style.padding}px;
  border-radius: ${style.borderRadius}px;
  display: flex;
  flex-direction: column;
  gap: ${style.gap}px;
  align-items: ${style.align === 'left' ? 'flex-start' : style.align === 'right' ? 'flex-end' : 'center'};
  justify-content: center;
  font-family: ${style.fontFamily}, sans-serif;
  color: ${style.textColor};
  position: relative;
  overflow: hidden;
">
  ${image.background ? `<div style="position: absolute; inset: 0; background: rgba(0,0,0,${image.overlayOpacity});"></div>` : ''}
  
  <div style="position: relative; z-index: 10; display: flex; flex-direction: column; width: 100%; gap: ${style.gap}px; align-items: inherit;">
    ${content.title ? `<h1 style="font-size: ${style.fontSizeTitle}px; margin: 0; line-height: 1.2;">${content.title}</h1>` : ''}
    ${content.subtitle ? `<p style="font-size: ${style.fontSizeSubtitle}px; margin: 0; opacity: 0.9;">${content.subtitle}</p>` : ''}
    ${content.cta ? `<button style="background: ${style.primaryColor}; color: ${style.secondaryColor}; padding: 16px 32px; border: none; border-radius: 50px; font-weight: bold; margin-top: 16px; width: fit-content;">${content.cta}</button>` : ''}
  </div>

  ${image.product ? `<img src="${image.product}" style="z-index: 10; max-width: 50%; max-height: 50%; object-fit: contain; margin-top: auto;" />` : ''}
</div>
    `.trim();

        navigator.clipboard.writeText(html).then(() => {
            alert('HTML Code copied to clipboard!');
        });
    };

    return (
        <Section title="Export">
            {/* Batch Download Button */}
            {/* Batch Download Button Removed - Moved to Top Right Header */}

            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={() => handleDownload('png')}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px',
                        background: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 500
                    }}
                >
                    <Download size={16} /> PNG (Preview)
                </button>
                <button
                    onClick={() => handleDownload('jpg')}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px',
                        background: 'var(--color-bg-panel)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 500
                    }}
                >
                    JPG
                </button>
            </div>
            <button
                onClick={handleCopyCode}
                style={{
                    width: '100%',
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    background: 'transparent',
                    color: 'var(--color-text-sub)',
                    border: '1px dashed var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 500
                }}
            >
                <Code size={16} /> Copy HTML Code
            </button>
        </Section>
    );
};
