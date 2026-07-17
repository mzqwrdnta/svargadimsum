'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  folder?: string;
  label?: string;
  required?: boolean;
}

export default function ImageUpload({ name, defaultValue = '', folder = 'uploads', label = 'Image', required = false }: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(defaultValue);
  const [useUrl, setUseUrl] = useState(!defaultValue);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        setUrl(data.url);
        setPreview(data.url);
        setUseUrl(false);
      } else {
        alert('Upload gagal: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="admin-label">{label} {required && '*'}</label>
      <input type="hidden" name={name} value={url} />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <button
          type="button"
          onClick={() => setUseUrl(false)}
          style={{
            padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none',
            background: !useUrl ? '#FF6B35' : '#f1f5f9', color: !useUrl ? 'white' : '#64748b',
          }}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setUseUrl(true)}
          style={{
            padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none',
            background: useUrl ? '#FF6B35' : '#f1f5f9', color: useUrl ? 'white' : '#64748b',
          }}
        >
          Paste URL
        </button>
      </div>

      {!useUrl ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              padding: '10px 20px', border: '2px dashed #d1d5db', borderRadius: '8px', background: '#fafafa',
              cursor: uploading ? 'wait' : 'pointer', fontSize: '13px', color: '#64748b', fontWeight: '500',
              transition: 'all 0.15s', flex: 1, textAlign: 'center',
            }}
          >
            {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Click to upload'}
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={url}
          onChange={e => { setUrl(e.target.value); setPreview(e.target.value); }}
          className="admin-input"
          placeholder="/img/photo.jpg or https://..."
        />
      )}

      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ marginTop: '10px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
          onError={() => setPreview('')}
        />
      )}
    </div>
  );
}
