import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import './FileUpload.css';

interface FileInfo {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

const DEFAULT_ACCEPTED_TYPES = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.txt',
  '.csv',
  '.hwp',
];

const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
  xls: '📊',
  xlsx: '📊',
  ppt: '📑',
  pptx: '📑',
  txt: '📃',
  csv: '📈',
  hwp: '📋',
  default: '📁',
};

export default function FileUpload({
  onFilesSelected,
  onUpload,
  maxFiles = 10,
  maxSizeMB = 50,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const getFileIcon = (filename: string): string => {
    const ext = getFileExtension(filename);
    return FILE_TYPE_ICONS[ext] || FILE_TYPE_ICONS.default;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    const ext = '.' + getFileExtension(file.name);
    if (!acceptedTypes.includes(ext.toLowerCase())) {
      return `지원하지 않는 파일 형식입니다: ${ext}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `파일 크기가 ${maxSizeMB}MB를 초과합니다`;
    }
    return null;
  };

  const processFiles = (fileList: FileList | File[]) => {
    setError(null);
    const newFiles: FileInfo[] = [];
    const fileArray = Array.from(fileList);

    if (files.length + fileArray.length > maxFiles) {
      setError(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다`);
      return;
    }

    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      const isDuplicate = files.some(
        (f) => f.file.name === file.name && f.file.size === file.size
      );
      if (isDuplicate) {
        continue;
      }

      newFiles.push({
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        progress: 0,
        status: 'pending',
      });
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesSelected?.(updatedFiles.map((f) => f.file));
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (id: string) => {
    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    onFilesSelected?.(updatedFiles.map((f) => f.file));
  };

  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return;

    setFiles((prev) =>
      prev.map((f) => ({ ...f, status: 'uploading' as const, progress: 0 }))
    );

    try {
      await onUpload(files.map((f) => f.file));
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: 'completed' as const, progress: 100 }))
      );
    } catch (err) {
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: 'error' as const,
          error: '업로드 실패',
        }))
      );
    }
  };

  const handleClearAll = () => {
    setFiles([]);
    setError(null);
    onFilesSelected?.([]);
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="file-input-hidden"
        />

        <div className="dropzone-content">
          <div className="dropzone-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17,8 12,3 7,8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="dropzone-text">
            파일을 여기에 드래그하거나
          </p>
          <button
            type="button"
            className="browse-button"
            onClick={handleBrowseClick}
          >
            파일 선택
          </button>
          <p className="dropzone-hint">
            지원 형식: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, HWP
            <br />
            최대 {maxSizeMB}MB, {maxFiles}개 파일
          </p>
        </div>
      </div>

      {error && (
        <div className="file-upload-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="file-list-container">
          <div className="file-list-header">
            <span className="file-count">
              {files.length}개 파일 선택됨
            </span>
            <button
              type="button"
              className="clear-all-button"
              onClick={handleClearAll}
            >
              전체 삭제
            </button>
          </div>

          <ul className="file-list">
            {files.map((fileInfo) => (
              <li key={fileInfo.id} className={`file-item ${fileInfo.status}`}>
                <span className="file-icon">{getFileIcon(fileInfo.file.name)}</span>
                <div className="file-info">
                  <span className="file-name">{fileInfo.file.name}</span>
                  <span className="file-size">{formatFileSize(fileInfo.file.size)}</span>
                </div>
                {fileInfo.status === 'uploading' && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${fileInfo.progress}%` }}
                    />
                  </div>
                )}
                {fileInfo.status === 'completed' && (
                  <span className="status-icon completed">✓</span>
                )}
                {fileInfo.status === 'error' && (
                  <span className="status-icon error">✗</span>
                )}
                {fileInfo.status === 'pending' && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveFile(fileInfo.id)}
                    aria-label="파일 삭제"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>

          {onUpload && (
            <button
              type="button"
              className="upload-button"
              onClick={handleUpload}
              disabled={files.every((f) => f.status !== 'pending')}
            >
              업로드
            </button>
          )}
        </div>
      )}
    </div>
  );
}
