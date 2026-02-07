import { AnimatePresence, motion } from 'framer-motion';
import { File, Image, Upload, Video, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface FileUploaderProps {
  name: string;
  maxFiles?: number;
  maxSize?: number; // в MB
  accept?: string[];
  onChange: (files: File[]) => void;
  error?: string;
}

const ACCEPT_TYPES = ['image/*', 'video/*'];

export function FileUploader({
  name,
  maxFiles = 10,
  maxSize = 10,
  accept = ACCEPT_TYPES,
  onChange,
  error,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!accept.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    })) {
      return 'Неподдерживаемый формат файла';
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `Файл слишком большой (макс. ${maxSize}MB)`;
    }
    return null;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setUploadError(null);
      const fileArray = Array.from(newFiles);
      const totalFiles = files.length + fileArray.length;

      if (totalFiles > maxFiles) {
        setUploadError(`Максимум ${maxFiles} файлов`);
        return;
      }

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          setUploadError(error);
          return;
        }
      }

      const updatedFiles = [...files, ...fileArray];
      setFiles(updatedFiles);
      onChange(updatedFiles);
    },
    [files, maxFiles, onChange]
  );

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        id={name}
        name={name}
        multiple
        accept={accept.join(',')}
        onChange={handleFileInput}
        className="hidden"
        disabled={files.length >= maxFiles}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${error || uploadError ? 'border-red-500' : ''}
        `}
      >
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Перетащите файлы сюда или нажмите для выбора
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Максимум {maxFiles} файлов, {maxSize}MB каждый
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Фото и видео
        </p>

        <label
          htmlFor={name}
          className="absolute inset-0 cursor-pointer"
        />
      </div>

      {(error || uploadError) && (
        <p className="text-sm text-red-500">{error || uploadError}</p>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {files.map((file, index) => (
            <motion.div
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  {getFileIcon(file)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
