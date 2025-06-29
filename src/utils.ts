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
