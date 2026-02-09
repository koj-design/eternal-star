import React, { useState } from 'react';
import { X, Download, CheckCircle, Circle } from 'lucide-react';

export const DownloadModal = ({ isOpen, onClose, onDownload, selectedCount, totalCount }) => {
    const [format, setFormat] = useState('png'); // 'png' | 'jpg'
    const [scope, setScope] = useState('all'); // 'all' | 'selected'

    if (!isOpen) return null;

    const handleDownload = () => {
        onDownload({ format, scope });
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'var(--color-bg-panel)', // Assuming variable exists, fallback to white if not
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                width: '400px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                color: 'black' // Force text color for safety
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Download Options</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Scope Selection */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '12px', color: '#666' }}>SELECT BANNERS</h3>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="scope"
                                checked={scope === 'selected'}
                                onChange={() => setScope('selected')}
                                disabled={selectedCount === 0}
                            />
                            <span>Selected ({selectedCount})</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="scope"
                                checked={scope === 'all'}
                                onChange={() => setScope('all')}
                            />
                            <span>All Banners ({totalCount})</span>
                        </label>
                    </div>
                </div>

                {/* Format Selection */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '12px', color: '#666' }}>FILE FORMAT</h3>
                    <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="png">PNG (Best for text & sharpness)</option>
                        <option value="jpg">JPG (Smallest file size)</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <button
                    onClick={handleDownload}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                    <Download size={20} />
                    Download
                </button>
            </div>
        </div>
    );
};
