import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from './Canvas';
import { Download, LayoutGrid, Code, Image as ImageIcon } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import JSZip from 'jszip';

// Grouped variations based on user request
const VARIATION_GROUPS = [
    {
        category: 'Facebook',
        items: [
            { label: 'Feed (Square)', width: 900, height: 900 },
            { label: 'Feed (Landscape)', width: 1600, height: 900 },
        ]
    },
    {
        category: 'Google Ads',
        items: [
            { label: 'Display (Landscape)', width: 1200, height: 628 },
            { label: 'Square', width: 1200, height: 1200 },
            { label: 'Portrait', width: 960, height: 1200 },
        ]
    },
    {
        category: 'Kakao',
        items: [
            { label: 'Biz Board', width: 1200, height: 600 },
            { label: 'Square', width: 500, height: 500 },
        ]
    },
    {
        category: 'Naver',
        items: [
            { label: 'GFA / Timeboard', width: 488, height: 470 },
        ]
    }
];

export const BannerGrid = forwardRef(({ banner }, ref) => {
    const gridRefs = useRef({});

    const downloadSingle = async (variation) => {
        // Unique ID for ref: category-label
        const refId = `${variation.category}-${variation.label}`;
        const node = gridRefs.current[refId];
        if (!node) return;

        try {
            const dataUrl = await toPng(node, { quality: 0.95, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `${variation.category}_${variation.label.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    const downloadAll = async () => {
        const zip = new JSZip();
        const folder = zip.folder("banners_collection");

        // Flatten all items for iteration
        const allItems = VARIATION_GROUPS.flatMap(group =>
            group.items.map(item => ({ ...item, category: group.category }))
        );

        const promises = allItems.map(async (v) => {
            const refId = `${v.category}-${v.label}`;
            const node = gridRefs.current[refId];
            if (node) {
                try {
                    const dataUrl = await toPng(node, { quality: 0.95, pixelRatio: 2 });
                    const base64Data = dataUrl.split(',')[1];
                    // Determine filename structure
                    folder.file(`${v.category}/${v.label.replace(/\s+/g, '-').toLowerCase()}.png`, base64Data, { base64: true });
                } catch (err) {
                    console.error(`Failed to capture ${v.label}`, err);
                }
            }
        });

        await Promise.all(promises);

        zip.generateAsync({ type: "blob" }).then((content) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = "all_banners.zip";
            link.click();
        });
    };

    // Added Logic from ExportController
    const handleDownloadPreview = async (format) => {
        // Find the first available node to use as preview source
        // Ideally we pick a specific one, e.g., the first one in the list
        // Let's use the first item of the first group
        const firstGroup = VARIATION_GROUPS[0];
        const firstItem = firstGroup.items[0];
        const refId = `${firstGroup.category}-${firstItem.label}`;
        const node = gridRefs.current[refId];

        if (!node) {
            alert("Preview node not found");
            return;
        }

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
            alert('Failed to generate image.');
        }
    };

    const handleCopyCode = () => {
        const { size, content, style, image } = banner;
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
  <div style="position: relative; z-index: 10; display: flex; flex-direction: column; width: 100%; gap: ${style.gap}px; align-items: inherit;">
    ${content.title ? `<h1 style="font-size: ${style.fontSizeTitle}px; margin: 0; line-height: 1.2;">${content.title}</h1>` : ''}
    ${content.subtitle ? `<p style="font-size: ${style.fontSizeSubtitle}px; margin: 0; opacity: 0.9;">${content.subtitle}</p>` : ''}
    ${content.cta ? `<button style="background: ${style.primaryColor}; color: ${style.secondaryColor}; padding: 16px 32px; border: none; border-radius: 50px; font-weight: bold; margin-top: 16px; width: fit-content;">${content.cta}</button>` : ''}
  </div>
</div>`.trim();

        navigator.clipboard.writeText(html).then(() => {
            alert('HTML Code copied to clipboard!');
        });
    };

    useImperativeHandle(ref, () => ({
        downloadAll,
        downloadSingle
    }));

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 32px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--color-bg-main)',
                zIndex: 10
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LayoutGrid size={20} />
                    Multi-Channel Preview
                </h2>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => handleDownloadPreview('png')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)',
                            fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-main)'
                        }}
                    >
                        <ImageIcon size={16} /> PNG
                    </button>
                    <button
                        onClick={() => handleDownloadPreview('jpg')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)',
                            fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-main)'
                        }}
                    >
                        <ImageIcon size={16} /> JPG
                    </button>
                    <button
                        onClick={handleCopyCode}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)',
                            fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-main)'
                        }}
                    >
                        <Code size={16} /> Code
                    </button>

                    <button
                        onClick={downloadAll}
                        style={{
                            backgroundColor: 'var(--color-text-main)',
                            color: 'var(--color-bg-panel)',
                            padding: '10px 20px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginLeft: '8px'
                        }}
                    >
                        <Download size={18} /> Download All (ZIP)
                    </button>
                </div>
            </div>

            {/* Grid Content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '48px'
            }}>
                {VARIATION_GROUPS.map((group) => (
                    <div key={group.category}>
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: 'var(--color-text-main)',
                            marginBottom: '20px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid var(--color-border)'
                        }}>
                            {group.category}
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))',
                            gap: '32px',
                            justifyContent: 'start'
                        }}>
                            {group.items.map((v) => {
                                const refId = `${group.category}-${v.label}`;
                                // Calculate preview scale to fit in the card
                                // Card Size is roughly 300px wide.
                                // Max Height for preview should be reasonable.
                                const PREVIEW_WIDTH = 300;
                                const scale = Math.min(PREVIEW_WIDTH / v.width, 1);

                                return (
                                    <div key={v.label} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            fontSize: '0.875rem',
                                            color: 'var(--color-text-sub)',
                                            fontWeight: 500
                                        }}>
                                            <span>{v.label}</span>
                                            <span>{v.width}x{v.height}</span>
                                        </div>

                                        <div style={{
                                            position: 'relative',
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                            boxShadow: 'var(--shadow-md)',
                                            backgroundColor: 'var(--color-bg-panel)',
                                            // Ensure container is big enough for the visible scaled element
                                            width: PREVIEW_WIDTH,
                                            height: v.height * scale,
                                        }}>
                                            {/* Scaled Render Node */}
                                            <div
                                                ref={el => gridRefs.current[refId] = el}
                                                style={{
                                                    width: v.width,
                                                    height: v.height,
                                                    transform: `scale(${scale})`,
                                                    transformOrigin: 'top left',
                                                }}
                                            >
                                                <Canvas banner={banner} sizeOverride={v} />
                                            </div>

                                            {/* Interaction Layer */}
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'rgba(0,0,0,0)',
                                                transition: 'background 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0,
                                                cursor: 'pointer'
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                                onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                            >
                                                <button
                                                    onClick={() => downloadSingle({ ...v, category: group.category })}
                                                    style={{
                                                        background: 'white',
                                                        padding: '8px 16px',
                                                        borderRadius: '20px',
                                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                        display: 'flex',
                                                        gap: '8px',
                                                        fontWeight: 600,
                                                        color: 'black'
                                                    }}
                                                >
                                                    <Download size={16} /> Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
