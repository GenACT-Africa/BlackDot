'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, Music, FileText, File, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { formatFileSize } from '@/lib/utils/file'
import type { ProjectFile } from '@/types'

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith('audio/')) return <Music size={16} className="text-purple-400" />
  if (mimeType.includes('pdf')) return <FileText size={16} className="text-red-400" />
  return <File size={16} className="text-white/50" />
}

export function FilesSection({
  projectId,
  userId,
}: {
  projectId: string
  userId: string
}) {
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Load files on mount
  useState(() => {
    const load = async () => {
      const { data } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_latest', true)
        .order('created_at', { ascending: false })

      setFiles((data as ProjectFile[]) || [])
      setLoaded(true)
    }
    load()
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const path = `${projectId}/${Date.now()}-${file.name}`
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .upload(path, file)

      if (storageError) throw storageError

      const { data: fileRecord, error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          uploader_id: userId,
          storage_path: path,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type || 'application/octet-stream',
          category: 'reference',
        })
        .select()
        .single()

      if (dbError) throw dbError

      setFiles((prev) => [fileRecord as ProjectFile, ...prev])
      toast.success('File uploaded!')
    } catch {
      toast.error('Upload failed. Try again.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDownload = async (file: ProjectFile) => {
    const { data } = await supabase.storage
      .from('project-files')
      .createSignedUrl(file.storage_path, 60)

    if (data?.signedUrl) {
      const a = document.createElement('a')
      a.href = data.signedUrl
      a.download = file.file_name
      a.click()
    }
  }

  return (
    <div className="flex flex-col h-80">
      {/* Files list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {!loaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Upload size={24} className="text-white/20 mb-2" />
            <p className="text-xs text-white/30">No files yet</p>
            <p className="text-xs text-white/20">Upload references or stems</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 py-2 border-b border-white/8 last:border-0 group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <FileIcon mimeType={file.mime_type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{file.file_name}</p>
                <p className="text-[10px] text-white/30">{formatFileSize(file.file_size)}</p>
              </div>
              <button
                onClick={() => handleDownload(file)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-purple-500/20 text-white/30 hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Download size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Upload */}
      <div className="px-4 py-3 border-t border-white/8">
        <input
          ref={inputRef}
          type="file"
          onChange={handleUpload}
          className="hidden"
          accept="audio/*,application/pdf,.zip"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-white/20 hover:border-purple-500/40 text-white/40 hover:text-purple-400 text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  )
}
