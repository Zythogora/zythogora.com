"use client";

import { ImageUpIcon, XIcon } from "lucide-react";
import mime from "mime";
import { useTranslations } from "next-intl";

import Button from "@/app/_components/ui/button";
import {
  formatBytes,
  useFileUpload,
} from "@/app/_components/ui/file-upload/hooks";
import type { FileMetadata } from "@/app/_components/ui/file-upload/hooks";
import Progress from "@/app/_components/ui/progress";
import { cn } from "@/lib/tailwind";

import type { MouseEvent } from "react";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  onError: (error: string[] | undefined) => void;
  maxSize: number;
  acceptedTypes: string[];
  initialFiles?: FileMetadata[];
  onCompression?: (isCompressing: boolean) => void;
}

const FileUpload = ({
  onFileChange,
  onError,
  maxSize,
  acceptedTypes,
  initialFiles,
  onCompression,
}: FileUploadProps) => {
  const t = useTranslations();

  const [
    { files, isDragging, isCompressing, compressionProgress },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: acceptedTypes.join(","),
    initialFiles,
    maxSize,
    onFilesChange: (files) =>
      onFileChange(
        files.length > 0 && files[0]!.file instanceof File
          ? files[0]!.file
          : null,
      ),
    onError,
    onCompression,
  });

  const extensions = Array.from(
    new Set(
      acceptedTypes
        .map((type) => mime.getExtension(type)?.toUpperCase())
        .filter((ext) => ext),
    ),
  );

  const handleRemoveFile = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (files[0]) {
      removeFile(files[0].id);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Button
          asChild
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          variant="outline"
          disabled={isCompressing}
        >
          <div
            className={cn(
              "min-h-64",
              "data-[dragging=true]:bg-primary-100",
              "has-focus-within:outline-primary has-focus-within:outline-3 has-focus-within:outline-offset-2",
              "has-focus-within:hover:bottom-0 has-focus-within:hover:before:-bottom-1",
            )}
          >
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label={t("form.fields.fileUpload.ctaImageSingle")}
              disabled={isCompressing}
            />

            {files[0] ? (
              <div className="absolute inset-1 flex items-center justify-center overflow-hidden rounded-sm">
                <img
                  src={files[0].preview}
                  alt={files[0].file.name}
                  className="size-full object-contain"
                />

                {isCompressing ? (
                  <div className="absolute inset-0 flex w-fit flex-col items-center justify-center gap-y-1">
                    <p className="mb-1 text-sm">
                      {t("form.fields.fileUpload.optimizing")}
                    </p>

                    <Progress value={compressionProgress} />

                    <p className="text-xs">{compressionProgress.toFixed(0)}%</p>
                  </div>
                ) : (
                  <Button
                    onClick={handleRemoveFile}
                    aria-label={t("form.fields.fileUpload.ctaRemoveFile")}
                    variant="outline"
                    size="icon"
                    className="border-foreground absolute top-4 right-4 size-8 rounded-full border-2 before:rounded-full"
                  >
                    <XIcon className="size-4 stroke-3" aria-hidden="true" />
                  </Button>
                )}
              </div>
            ) : isCompressing ? (
              <div className="flex w-fit flex-col items-center justify-center gap-y-1">
                <p className="mb-1 text-sm">
                  {t("form.fields.fileUpload.optimizing")}
                </p>

                <Progress value={compressionProgress} />

                <p className="text-xs">{compressionProgress.toFixed(0)}%</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <ImageUpIcon className="mb-4 size-12 stroke-1" />

                <p className="mb-1.5 text-sm font-medium">
                  {t("form.fields.fileUpload.ctaImageSingle")}
                </p>

                {extensions.length > 0 ? (
                  <p className="text-muted-foreground text-xs">
                    {t("form.fields.fileUpload.description", {
                      allowedExtensions:
                        extensions.length === 1
                          ? extensions[0]!
                          : t("form.fields.fileUpload.allowedExtensions", {
                              extensions: extensions.slice(0, -1).join(", "),
                              lastExtension: extensions[extensions.length - 1]!,
                            }),
                      maxSize: formatBytes(maxSize),
                    })}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
