'use client'

import { useCallback, useRef, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
} from 'lucide-react'

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function WordToPDFPage() {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [toast, setToast] = useState('')
  const inputRef = useRef(null)

  const showToast = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }, [])

  const handleFiles = useCallback((incomingFiles) => {
    setError('')
    const wordFile = incomingFiles[0]

    if (!wordFile) return

    const isWordFile =
      wordFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      wordFile.type === 'application/msword' ||
      wordFile.name.toLowerCase().endsWith('.docx') ||
      wordFile.name.toLowerCase().endsWith('.doc')

    if (!isWordFile) {
      setError('Only .doc and .docx files are allowed. Please upload a valid Word document.')
      return
    }

    setFile(wordFile)
  }, [])

  const handleConvert = async () => {
    if (!file) return
    setIsConverting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(
        'https://pdf-converter-api-8z0x.onrender.com/convert',
        { method: 'POST', body: formData }
      )

      if (!response.ok) throw new Error('Conversion failed')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace('.docx', '.pdf')
      a.click()
      URL.revokeObjectURL(url)
      showToast('Document converted successfully!')
    } catch (error) {
      setError('Conversion failed. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    const droppedFiles = Array.from(event.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleBrowse = () => {
    inputRef.current?.click()
  }

  const handleInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    handleFiles(selectedFiles)
    event.target.value = ''
  }

  const removeFile = () => {
    setFile(null)
    setError('')
  }

  return (
    <main className="min-h-screen bg-[#070912] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                <FileText className="h-4 w-4" /> Word to PDF
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Convert Word documents to PDF
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
                Upload your .doc or .docx files and convert them to professional PDF documents instantly.
              </p>
            </div>
          </div>
        </section>

        {!file ? (
          <section className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
            <div
              className={`relative flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
                dragActive ? 'border-cyan-400/70 bg-cyan-500/10' : 'border-white/15 bg-white/5'
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragOver={(event) => {
                event.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <Upload className="h-10 w-10 text-cyan-300" />
              <div className="space-y-2">
                <p className="text-lg font-semibold text-white">Drag & drop Word files here</p>
                <p className="text-sm text-gray-400">or click to browse files</p>
              </div>
              <button
                type="button"
                onClick={handleBrowse}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400"
              >
                Browse files
              </button>
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleInputChange}
              />
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-300" />
                <p>{error}</p>
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Selected file</p>
                <p className="mt-2 text-lg font-semibold text-white">{file.name}</p>
                <p className="mt-1 text-sm text-gray-400">{formatBytes(file.size)}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
                >
                  {isConverting ? 'Converting...' : 'Convert to PDF'}
                </button>
                <button
                  type="button"
                  onClick={removeFile}
                  disabled={isConverting}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 disabled:opacity-50"
                >
                  Remove file
                </button>
              </div>
            </div>

            {isConverting && (
              <div className="mt-6 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
                <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
                <p>Converting your document... This may take up to 60 seconds on first use.</p>
              </div>
            )}

            {error && !isConverting && (
              <div className="mt-6 flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-300" />
                <p>{error}</p>
              </div>
            )}
          </section>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-100 shadow-lg backdrop-blur-xl sm:bottom-6 sm:right-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            {toast}
          </div>
        </div>
      )}
    </main>
  )
}
