import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper to merge classes if we were using tailwind, primarily for structure now
// Since we are using vanilla CSS modules/styles mainly, we will use inline styles + basic classes

export const Section = ({ title, children, className }) => (
    <div className={className} style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
        {title && (
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-main)' }}>
                {title}
            </h3>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {children}
        </div>
    </div>
);

export const Label = ({ children }) => (
    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-sub)', marginBottom: '6px' }}>
        {children}
    </label>
);

export const Input = ({ type = 'text', value, onChange, placeholder, style, ...props }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '0.875rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-panel)',
            color: 'var(--color-text-main)',
            outline: 'none',
            transition: 'border-color 0.2s',
            ...style
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        {...props}
    />
);

export const TextArea = ({ value, onChange, placeholder, style, rows = 3, ...props }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '0.875rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-panel)',
            color: 'var(--color-text-main)',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s',
            ...style
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        {...props}
    />
);

export const Select = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={onChange}
        style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '0.875rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-panel)',
            color: 'var(--color-text-main)',
            outline: 'none',
            cursor: 'pointer'
        }}
    >
        {options.map(opt => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);
