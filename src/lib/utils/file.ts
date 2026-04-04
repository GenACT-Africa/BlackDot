export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('audio/')) return 'music'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'file-text'
  if (mimeType.includes('zip') || mimeType.includes('tar')) return 'archive'
  return 'file'
}

export function isAudioFile(mimeType: string): boolean {
  return mimeType.startsWith('audio/')
}

export const ACCEPTED_AUDIO_TYPES = [
  'audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3',
  'audio/aiff', 'audio/x-aiff', 'audio/flac', 'audio/x-flac',
]

export const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500 MB
