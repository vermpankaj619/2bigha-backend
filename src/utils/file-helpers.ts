// Utility functions for file handling
import { extname } from "path"

export const generateUniqueFilename = (originalFilename: string): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  const extension = extname(originalFilename)
  const nameWithoutExt = originalFilename.replace(extension, "")

  return `${nameWithoutExt}-${timestamp}-${random}${extension}`
}

export const isValidFileType = (mimetype: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(mimetype)
}

export const isValidFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return extname(filename).toLowerCase()
}

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
}
