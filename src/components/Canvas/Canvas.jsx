import { forwardRef } from 'react';

export const Canvas = forwardRef(({ banner, sizeOverride }, ref) => {
    const { content, style, image } = banner;
    // Use override size if provided, otherwise use banner state size
    const size = sizeOverride || banner.size;

    const containerStyle = {
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundColor: style.backgroundColor,
        backgroundImage: image.background ? `url(${image.background})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: style.align === 'left' ? 'flex-start' : style.align === 'right' ? 'flex-end' : 'center',
        justifyContent: 'center',
        gap: `${style.gap}px`,
        padding: `${style.padding}px`,
        borderRadius: `${style.borderRadius}px`,
        boxShadow: style.shadow === 'none' ? 'none' :
            style.shadow === 'sm' ? 'var(--shadow-sm)' :
                style.shadow === 'md' ? 'var(--shadow-md)' : 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
        // Scale for preview if too large (handled by parent usually, but here strict size)
        transformOrigin: 'center center',
        color: style.textColor,
        fontFamily: style.fontFamily,
    };

    const overlayStyle = {
        position: 'absolute',
        inset: 0,
        backgroundColor: `rgba(0,0,0,${image.overlayOpacity})`,
        zIndex: 0,
        display: image.background ? 'block' : 'none'
    };

    const contentStyle = {
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: style.align === 'left' ? 'flex-start' : style.align === 'right' ? 'flex-end' : 'center',
        gap: `${style.gap}px`,
        width: '100%'
    };

    return (
        <div ref={ref} className="banner-node" style={containerStyle}>
            <div style={overlayStyle} />

            <div style={contentStyle}>
                {content.title && (
                    <h1 style={{
                        fontSize: `${style.fontSizeTitle}px`,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        whiteSpace: 'pre-wrap',
                        textAlign: style.align
                    }}>
                        {content.title}
                    </h1>
                )}

                {content.subtitle && (
                    <p style={{
                        fontSize: `${style.fontSizeSubtitle}px`,
                        opacity: 0.9,
                        whiteSpace: 'pre-wrap',
                        textAlign: style.align
                    }}>
                        {content.subtitle}
                    </p>
                )}

                {content.cta && (
                    <button style={{
                        marginTop: '16px',
                        backgroundColor: style.primaryColor,
                        color: style.secondaryColor,
                        padding: '16px 32px',
                        borderRadius: '50px', // Standard rounded CTA
                        fontSize: `${style.fontSizeSubtitle * 0.6}px`, // Relative size
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        {content.cta}
                    </button>
                )}
            </div>

            {image.product && (
                <img
                    src={image.product}
                    alt="Product"
                    style={{
                        zIndex: 1,
                        maxWidth: '50%',
                        maxHeight: '50%',
                        objectFit: 'contain',
                        marginTop: 'auto' // Strategy to push to bottom if flex? Need proper logic
                        // For now, let's just place it in flow
                    }}
                />
            )}
        </div>
    );
});

Canvas.displayName = 'Canvas';
