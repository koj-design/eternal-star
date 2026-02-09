import { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Canvas } from './Canvas';
import { Download, LayoutGrid, CheckSquare, Square, Upload } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import JSZip from 'jszip';
import { DownloadModal } from '../UI/DownloadModal';

// Grouped variations based on user request with SIZE LIMITS
const VARIATION_GROUPS = [
    {
        category: 'Facebook',
        items: [
            { label: 'Feed (Square)', width: 900, height: 900, maxSizeKB: 2048 },
            { label: 'Feed (Landscape)', width: 1600, height: 900, maxSizeKB: 2048 },
        ]
    },
    {
        category: 'Google Ads',
        items: [
            { label: 'Display (Landscape)', width: 1200, height: 628, maxSizeKB: 150 },
            { label: 'Square', width: 1200, height: 1200, maxSizeKB: 150 },
            { label: 'Portrait', width: 960, height: 1200, maxSizeKB: 150 },
        ]
    },
    {
        category: 'Kakao',
        items: [
            { label: 'Biz Board', width: 1200, height: 600, maxSizeKB: 500 },
            { label: 'Square', width: 500, height: 500, maxSizeKB: 500 },
        ]
    },
    {
        category: 'Naver',
        items: [
            { label: 'GFA / Timeboard', width: 488, height: 470, maxSizeKB: 500 },
        ]
    },
    {
        category: 'Shared IT (쉐어드IT)',
        items: [
            { label: 'Banner', width: 220, height: 150, maxSizeKB: 500 },
        ]
    },
    {
        category: 'IT Dong-a (IT동아)',
        items: [
            { label: 'Rectangle', width: 300, height: 250, maxSizeKB: 500 },
        ]
    },
    {
        category: 'Video Ads',
        items: [
            { label: 'Vertical (Shorts/Reels)', width: 1080, height: 1920, maxSizeKB: 2048 },
            { label: 'Square', width: 1080, height: 1080, maxSizeKB: 2048 },
            { label: 'Landscape (YouTube)', width: 1920, height: 1080, maxSizeKB: 2048 },
        ]
    }
];

export const BannerGrid = forwardRef(({ banner }, ref) => {
    const gridRefs = useRef({});
    const [selectedBanners, setSelectedBanners] = useState(new Set());
    const [mediaOverrides, setMediaOverrides] = useState({});
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

    // Helper to get unique ID for each banner
    const getBannerId = (category, label) => `${category}-${label}`;

    const handleMediaUpload = (id, file) => {
        if (file) {
            setMediaOverrides(prev => ({
                ...prev,
                [id]: file
            }));
        }
    };

    const toggleSelection = (id) => {
        const newSelection = new Set(selectedBanners);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedBanners(newSelection);
    };

    /**
     * Optimizes image size by iteratively reducing quality if needed.
     * Mostly effective for JPEG. For PNG, we can't do much with client-side quality param
     * unless we convert to JPEG or use a more advanced encoder (not available here).
     */
    const optimizeImageBlob = async (node, format, maxSizeKB) => {
        const targetSizeBytes = maxSizeKB * 1024;
        let quality = 0.95;
        let blob = null;
        const options = { quality, pixelRatio: 2 };

        // Helper to get blob
        const getBlob = async (q) => {
            if (format === 'png') {
                return await toPng(node, { ...options, quality: q }).then(dataUrl => fetch(dataUrl).then(res => res.blob()));
            } else {
                return await toJpeg(node, { ...options, quality: q }).then(dataUrl => fetch(dataUrl).then(res => res.blob()));
            }
        };

        // Initial attempt
        blob = await getBlob(quality);

        // Iterative optimization loop
        // Only run for JPG or if strict limit needed (PNG limits are hard to hit without format change)
        if (format === 'jpg' || (blob.size > targetSizeBytes)) {
            while (blob.size > targetSizeBytes && quality > 0.5) {
                quality -= 0.1;
                blob = await getBlob(quality);
                console.log(`Optimizing ${format}... Value: ${quality.toFixed(1)} Size: ${(blob.size / 1024).toFixed(0)}KB (Target: ${maxSizeKB}KB)`);
            }
        }

        return blob;
    };

    const downloadSingle = async (variation) => {
        const refId = getBannerId(variation.category, variation.label);
        const node = gridRefs.current[refId];
        if (!node) return;

        try {
            // Default to PNG for single download usually, or check preferences.
            // For now, let's just do PNG unless it's Google Ads where we might want to enforce JPG for size?
            // User requested automation. Let's use JPG if size limit is strict (< 500KB) to ensure success, or just standard PNG.
            // Actually, `downloadSingle` in UI doesn't pop modal. Let's stick to previous behavior (PNG) 
            // BUT apply optimization if it happens to be too big? 
            // Simple approach: Use PNG as high quality default for single.

            const dataUrl = await toPng(node, { quality: 0.95, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `${variation.category}_${variation.label.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    const handleBatchDownload = async ({ format, scope }) => {
        const zip = new JSZip();
        const folder = zip.folder("banners_collection");

        // Determine which items to download
        const allItems = VARIATION_GROUPS.flatMap(group =>
            group.items.map(item => ({ ...item, category: group.category }))
        );

        const itemsToDownload = scope === 'selected'
            ? allItems.filter(item => selectedBanners.has(getBannerId(item.category, item.label)))
            : allItems;

        if (itemsToDownload.length === 0) {
            alert("No banners selected!");
            return;
        }

        const promises = itemsToDownload.map(async (v) => {
            const refId = getBannerId(v.category, v.label);
            const overrideMedia = mediaOverrides[refId];

            // If a video/media file is attached, use it directly!
            if (overrideMedia) {
                // Determine extension from file type (e.g. video/mp4 -> mp4)
                // Fallback to 'bin' if unknown, but usually type is present.
                const ext = overrideMedia.type.split('/')[1] || 'bin';
                const fileName = `${v.category}/${v.label.replace(/\s+/g, '-').toLowerCase()}.${ext}`;
                folder.file(fileName, overrideMedia);
                return; // Use original file, skip capturing
            }

            const node = gridRefs.current[refId];
            if (node) {
                try {
                    // Use optimization helper
                    // If format is selected as PNG, we respect it, but logging warning if size exceeds
                    // If user selects JPG, we optimize hard.

                    const blob = await optimizeImageBlob(node, format, v.maxSizeKB);

                    const extension = format === 'png' ? 'png' : 'jpg';
                    const fileName = `${v.category}/${v.label.replace(/\s+/g, '-').toLowerCase()}.${extension}`;

                    folder.file(fileName, blob);
                } catch (err) {
                    console.error(`Failed to capture ${v.label}`, err);
                }
            }
        });

        await Promise.all(promises);

        zip.generateAsync({ type: "blob" }).then((content) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `banners_${format}.zip`;
            link.click();
        });
    };

    // Added Logic from ExportController


    useImperativeHandle(ref, () => ({
        downloadAll: () => setIsDownloadModalOpen(true),
        downloadSingle
    }));

    const totalBanners = VARIATION_GROUPS.reduce((acc, group) => acc + group.items.length, 0);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            position: 'relative' // For modal context
        }}>
            <DownloadModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
                onDownload={handleBatchDownload}
                selectedCount={selectedBanners.size}
                totalCount={totalBanners}
            />

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
                        onClick={() => setIsDownloadModalOpen(true)}
                        style={{
                            backgroundColor: 'var(--color-text-main)',
                            color: 'var(--color-bg-panel)',
                            padding: '10px 20px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginLeft: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <Download size={18} /> Download
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
                            {group.category} <span style={{ fontSize: '0.8em', color: '#888', fontWeight: 'normal' }}>(Limit: {group.items[0].maxSizeKB < 1000 ? `${group.items[0].maxSizeKB}KB` : `${(group.items[0].maxSizeKB / 1024).toFixed(0)}MB`})</span>
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))',
                            gap: '32px',
                            justifyContent: 'start'
                        }}>
                            {group.items.map((v) => {
                                const refId = getBannerId(group.category, v.label);
                                const isSelected = selectedBanners.has(refId);
                                const PREVIEW_WIDTH = 300;
                                const scale = Math.min(PREVIEW_WIDTH / v.width, 1);
                                const isVideoCategory = group.category === 'Video Ads';
                                const hasMedia = !!mediaOverrides[refId];

                                return (
                                    <div key={v.label} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            fontSize: '0.875rem',
                                            color: 'var(--color-text-sub)',
                                            fontWeight: 500,
                                            alignItems: 'center'
                                        }}>
                                            <div
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                                onClick={() => toggleSelection(refId)}
                                            >
                                                <div style={{ display: 'flex' }}>
                                                    {isSelected ?
                                                        <CheckSquare size={20} color="var(--color-primary, #3b82f6)" /> :
                                                        <Square size={20} color="var(--color-text-sub)" />
                                                    }
                                                </div>
                                                <span>{v.label}</span>
                                            </div>
                                            <span>{v.width}x{v.height}</span>
                                        </div>

                                        <div
                                            className="banner-card-container" // Hook for hover effects if needed
                                            style={{
                                                position: 'relative',
                                                borderRadius: 'var(--radius-md)',
                                                overflow: 'hidden',
                                                boxShadow: isSelected ? '0 0 0 3px var(--color-primary, #3b82f6)' : 'var(--shadow-md)',
                                                backgroundColor: 'var(--color-bg-panel)',
                                                width: v.width * scale,
                                                height: v.height * scale,
                                                cursor: 'pointer',
                                                transition: 'box-shadow 0.2s',
                                                border: isSelected ? 'none' : '1px solid transparent'
                                            }}
                                        >
                                            {/* Scaled Render Node */}
                                            <div
                                                ref={el => gridRefs.current[refId] = el}
                                                style={{
                                                    width: v.width,
                                                    height: v.height,
                                                    transform: `scale(${scale})`,
                                                    transformOrigin: 'top left',
                                                    pointerEvents: 'none'
                                                }}
                                            >
                                                <Canvas
                                                    banner={banner}
                                                    sizeOverride={v}
                                                    mediaOverride={mediaOverrides[refId]}
                                                    videoPlaceholder={isVideoCategory && !hasMedia}
                                                />
                                            </div>

                                            {/* Media Upload Overlay (Only for Video Ads) */}
                                            {isVideoCategory && (
                                                <div
                                                    onClick={(e) => {
                                                        // Prevent selecting the card when clicking upload
                                                        e.stopPropagation();
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '10px',
                                                        right: '10px',
                                                        zIndex: 20,
                                                        opacity: hasMedia ? 1 : 0.8, // Always visible if has media, else slightly transparent or show on hover?
                                                        // Let's make it always visible for now for usability
                                                    }}
                                                >
                                                    <input
                                                        type="file"
                                                        accept="video/*,image/*"
                                                        id={`upload-${refId}`}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleMediaUpload(refId, e.target.files[0])}
                                                    />
                                                    <label
                                                        htmlFor={`upload-${refId}`}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            backgroundColor: hasMedia ? 'var(--color-primary)' : 'rgba(0,0,0,0.6)',
                                                            color: 'white',
                                                            padding: '6px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                            backdropFilter: 'blur(4px)',
                                                            transition: 'background 0.2s'
                                                        }}
                                                        title="Upload Video or Image to override"
                                                    >
                                                        <Upload size={14} />
                                                        {hasMedia ? 'Change' : 'Upload'}
                                                    </label>
                                                </div>
                                            )}

                                            {/* Interaction Layer - Click to toggle selection */}
                                            <div
                                                onClick={() => toggleSelection(refId)}
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    zIndex: 10 // Below button (20) but above canvas (0)
                                                }}
                                            />
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
