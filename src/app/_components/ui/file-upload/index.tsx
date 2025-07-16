"use client";

import { ImageUpIcon, XIcon } from "lucide-react";
import mime from "mime";
import { useTranslations } from "next-intl";
import { useEffect, type MouseEvent } from "react";

import Button from "@/app/_components/ui/button";
import {
  formatBytes,
  useFileUpload,
} from "@/app/_components/ui/file-upload/hooks";
import { cn } from "@/lib/tailwind";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  onError: (error: string[] | undefined) => void;
  maxSize: number;
  acceptedTypes: string[];
}

const FileUpload = ({
  onFileChange,
  onError,
  maxSize,
  acceptedTypes,
}: FileUploadProps) => {
  const t = useTranslations();

  const [
    { files, isDragging, errors },
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
    maxSize,
    onFilesChange: (files) =>
      onFileChange(
        files.length > 0 && files[0]!.file instanceof File
          ? files[0]!.file
          : null,
      ),
  });

  const extensions = Array.from(
    new Set(
      acceptedTypes
        .map((type) => mime.getExtension(type)?.toUpperCase())
        .filter((ext) => ext),
    ),
  );

  useEffect(() => {
    if (errors.length > 0) {
      onError(errors);
    } else {
      onError(undefined);
    }
  }, [onError, errors]);

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
            />

            {files[0] ? (
              <div className="absolute inset-1 flex items-center justify-center overflow-hidden rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={files[0].preview}
                  alt={files[0].file.name}
                  className="size-full object-contain"
                />

                <Button
                  onClick={handleRemoveFile}
                  aria-label={t("form.fields.fileUpload.ctaRemoveFile")}
                  variant="outline"
                  size="icon"
                  className="border-foreground absolute top-4 right-4 size-8 rounded-full border-2 before:rounded-full"
                >
                  <XIcon className="size-4 stroke-3" aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <ImageUpIcon className="mb-4 size-12 stroke-1" />

                <p className="mb-1.5 font-medium">
                  {t("form.fields.fileUpload.ctaImageSingle")}
                </p>

                <p className="text-muted-foreground text-sm">
                  {t("form.fields.fileUpload.description", {
                    allowedExtensions:
                      extensions.length === 1
                        ? extensions[0]
                        : t("form.fields.fileUpload.allowedExtensions", {
                            extensions: extensions.slice(0, -1).join(", "),
                            lastExtension: extensions[extensions.length - 1],
                          }),
                    maxSize: formatBytes(maxSize),
                  })}
                </p>
              </div>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
