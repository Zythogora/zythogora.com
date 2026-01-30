"use client";

import { encode as encodeJpeg } from "@jsquash/jpeg";
import resize from "@jsquash/resize";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
} from "react";

import type React from "react";

async function compressImage(
  file: File,
  options: {
    maxWidthOrHeight?: number;
    quality?: number;
    onProgress?: (progress: number) => void;
  },
): Promise<File | null> {
  const { maxWidthOrHeight = 1000, quality = 80, onProgress } = options;

  const isPng = file.type === "image/png";
  const isJpeg = file.type === "image/jpeg" || file.type === "image/jpg";

  if (!isPng && !isJpeg) {
    return null;
  }

  onProgress?.(10);

  const bitmap = await createImageBitmap(file);
  onProgress?.(20);

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    bitmap.close();
    return null;
  }

  ctx.drawImage(bitmap, 0, 0);
  let imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  bitmap.close();
  onProgress?.(40);

  const { width, height } = imageData;
  if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
    const scale = maxWidthOrHeight / Math.max(width, height);
    imageData = await resize(imageData, {
      width: Math.round(width * scale),
      height: Math.round(height * scale),
    });
  }
  onProgress?.(70);

  const compressedBuffer = await encodeJpeg(imageData, { quality });
  onProgress?.(90);

  const compressedFile = new File(
    [compressedBuffer],
    isPng ? file.name.replace(/\.png$/i, ".jpg") : file.name,
    { type: "image/jpeg", lastModified: file.lastModified },
  );

  onProgress?.(100);

  return compressedFile;
}

export type FileMetadata = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};

export type FileWithPreview = {
  file: File | FileMetadata;
  id: string;
  preview?: string;
};

export type FileUploadOptions = {
  maxFiles?: number; // Only used when multiple is true, defaults to Infinity
  maxSize?: number; // in bytes
  accept?: string;
  multiple?: boolean; // Defaults to false
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void; // Callback when files change
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void; // Callback when new files are added
  onError?: (errors: string[] | undefined) => void; // Callback when errors change
  onCompression?: (isCompressing: boolean) => void; // Callback when compression state changes
};

export type FileUploadState = {
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
  isCompressing: boolean;
  compressionProgress: number;
};

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  handleDragEnter: (e: DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLElement>) => void;
  handleDragOver: (e: DragEvent<HTMLElement>) => void;
  handleDrop: (e: DragEvent<HTMLElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>,
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>;
  };
};

export const useFileUpload = (
  options: FileUploadOptions = {},
): [FileUploadState, FileUploadActions] => {
  const {
    maxFiles = Infinity,
    maxSize = Infinity,
    accept = "*",
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
    onError,
    onCompression,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    files: initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    })),
    isDragging: false,
    errors: [],
    isCompressing: false,
    compressionProgress: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File | FileMetadata): string | null => {
      if (file instanceof File) {
        if (file.size > maxSize) {
          return "form.errors.FILE_SIZE_TOO_LARGE";
        }
      } else {
        if (file.size > maxSize) {
          return "form.errors.FILE_SIZE_TOO_LARGE";
        }
      }

      if (accept !== "*") {
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        const fileType = file instanceof File ? file.type || "" : file.type;
        const fileExtension = `.${file instanceof File ? file.name.split(".").pop() : file.name.split(".").pop()}`;

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExtension.toLowerCase() === type.toLowerCase();
          }
          if (type.endsWith("/*")) {
            const baseType = type.split("/")[0];
            return fileType.startsWith(`${baseType}/`);
          }
          return fileType === type;
        });

        if (!isAccepted) {
          return "form.errors.INVALID_FILE_TYPE";
        }
      }

      return null;
    },
    [accept, maxSize],
  );

  const createPreview = useCallback(
    (file: File | FileMetadata): string | undefined => {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      return file.url;
    },
    [],
  );

  const generateUniqueId = useCallback((file: File | FileMetadata): string => {
    if (file instanceof File) {
      return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    return file.id;
  }, []);

  const clearFiles = useCallback(() => {
    setState((prev) => {
      // Clean up object URLs
      prev.files.forEach((file) => {
        if (
          file.preview &&
          file.file instanceof File &&
          file.file.type.startsWith("image/")
        ) {
          URL.revokeObjectURL(file.preview);
        }
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      const newState = {
        ...prev,
        files: [],
        errors: [],
      };

      onFilesChange?.(newState.files);
      return newState;
    });
  }, [onFilesChange]);

  const addFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      if (!newFiles || newFiles.length === 0) {
        return;
      }

      const newFilesArray = Array.from(newFiles);
      const errors: string[] = [];

      // Clear existing errors when new files are uploaded
      setState((prev) => ({ ...prev, errors: [] }));

      // In single file mode, clear existing files first
      if (!multiple) {
        clearFiles();
      }

      // Check if adding these files would exceed maxFiles (only in multiple mode)
      if (
        multiple &&
        maxFiles !== Infinity &&
        state.files.length + newFilesArray.length > maxFiles
      ) {
        errors.push("form.errors.TOO_MANY_FILES");
        setState((prev) => ({ ...prev, errors }));
        return;
      }

      // Filter and validate files first
      const filesToProcess: File[] = [];
      newFilesArray.forEach((file) => {
        // Check file size
        if (file.size > maxSize) {
          errors.push(
            multiple
              ? "form.errors.FILE_SIZE_TOO_LARGE_MULTIPLE"
              : "form.errors.FILE_SIZE_TOO_LARGE",
          );
          return;
        }

        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          filesToProcess.push(file);
        }
      });

      if (errors.length > 0 && filesToProcess.length === 0) {
        setState((prev) => ({
          ...prev,
          errors,
        }));
        return;
      }

      // Check if any files are images that need compression
      const imageFiles = filesToProcess.filter((file) =>
        file.type.startsWith("image/"),
      );

      if (imageFiles.length > 0) {
        setState((prev) => ({
          ...prev,
          isCompressing: true,
          compressionProgress: 0,
        }));
      }

      const validFiles: FileWithPreview[] = [];

      // Process files (compress images, keep others as-is)
      for (const file of filesToProcess) {
        if (file.type.startsWith("image/")) {
          try {
            const compressedFile = await compressImage(file, {
              maxWidthOrHeight: 2400,
              quality: 80,
              onProgress: (progress: number) => {
                setState((prev) => ({
                  ...prev,
                  compressionProgress: progress,
                }));
              },
            });

            const processedFile = compressedFile ?? file;

            validFiles.push({
              file: processedFile,
              id: generateUniqueId(processedFile),
              preview: URL.createObjectURL(processedFile),
            });
          } catch {
            errors.push("form.errors.FILE_PROCESSING_ERROR");
          }
        } else {
          validFiles.push({
            file,
            id: generateUniqueId(file),
            preview: createPreview(file),
          });
        }
      }

      // Update state with processed files
      if (validFiles.length > 0) {
        // Call the onFilesAdded callback with the newly added valid files
        onFilesAdded?.(validFiles);

        setState((prev) => {
          const newFiles = !multiple
            ? validFiles
            : [...prev.files, ...validFiles];
          onFilesChange?.(newFiles);
          return {
            ...prev,
            files: newFiles,
            errors,
            isCompressing: false,
            compressionProgress: 0,
          };
        });
      } else if (errors.length > 0) {
        setState((prev) => ({
          ...prev,
          errors,
          isCompressing: false,
          compressionProgress: 0,
        }));
      }

      // Reset input value after handling files
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [
      state.files.length,
      maxFiles,
      multiple,
      maxSize,
      validateFile,
      createPreview,
      generateUniqueId,
      clearFiles,
      onFilesChange,
      onFilesAdded,
    ],
  );

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const fileToRemove = prev.files.find((file) => file.id === id);
        if (
          fileToRemove &&
          fileToRemove.preview &&
          fileToRemove.file instanceof File &&
          fileToRemove.file.type.startsWith("image/")
        ) {
          URL.revokeObjectURL(fileToRemove.preview);
        }

        const newFiles = prev.files.filter((file) => file.id !== id);
        onFilesChange?.(newFiles);

        return {
          ...prev,
          files: newFiles,
          errors: [],
        };
      });
    },
    [onFilesChange],
  );

  const clearErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errors: [],
    }));
  }, []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));

      // Don't process files if the input is disabled
      if (inputRef.current?.disabled) {
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // In single file mode, only use the first file
        if (!multiple) {
          const file = e.dataTransfer.files[0];
          addFiles([file as File]);
        } else {
          addFiles(e.dataTransfer.files);
        }
      }
    },
    [addFiles, multiple],
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles],
  );

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => {
      return {
        ...props,
        type: "file" as const,
        onChange: handleFileChange,
        accept: props.accept || accept,
        multiple: props.multiple !== undefined ? props.multiple : multiple,
        ref: inputRef,
      };
    },
    [accept, multiple, handleFileChange],
  );

  // Notify parent components of error state changes
  useEffect(() => {
    if (state.errors.length > 0) {
      onError?.(state.errors);
    } else {
      onError?.(undefined);
    }
  }, [onError, state.errors]);

  // Notify parent components of compression state changes
  useEffect(() => {
    onCompression?.(state.isCompressing);
  }, [onCompression, state.isCompressing]);

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ];
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const unit = sizes[i] as string;

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${unit}`;
};
