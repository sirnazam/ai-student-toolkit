'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react'

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function createFileEntry(file) {
  return {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
  }
}

export default function MergePDFPage() {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [isMerging, setIsMerging] = useState(false)
  const [toast, setToast] = useState('')
  const inputRef = useRef(null)

  const stats = useMemo(() => {
    const total = files.length
    const size = files.reduce((sum, item) => sum + item.file.size, 0)
    return { total, size }
  }, [files])

  const showToast = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }, [])

  const handleFiles = useCallback(
    (incomingFiles) => {
      const pdfFiles = []
      for (const file of incomingFiles) {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
          setError('Only PDF files are allowed. Please upload valid .pdf files.')
          return
        }
        pdfFiles.push(createFileEntry(file))
      }
      if (pdfFiles.length > 0) {
        setFiles((prev) => [...prev, ...pdfFiles])
        setError('')
      }
    },
    [setFiles]
  )

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

  const moveFile = (index, direction) => {
    setFiles((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return next
      const temp = next[target]
      next[target] = next[index]
      next[index] = temp
      return next
    })
  }

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((item) => item.id !== id))
  }

  const clearAll = () => {
    setFiles([])
    setError('')
  }

  const mergePdfs = async () => {
    if (files.length < 2) return
    setIsMerging(true)
    setError('')

    try {
      const mergedPdf = await PDFDocument.create()
      for (const { file } of files) {
        const bytes = await file.arrayBuffer()
        const pdf = await PDFDocument.load(bytes)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([mergedBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'merged.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      showToast('PDFs merged successfully!')
      clearAll()
    } catch (err) {
      setError('An error occurred while merging the PDFs. Please try again.')
      console.error(err)
    } finally {
      setIsMerging(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#070912] bg-[var(--bg-primary)] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                <FileText className="h-4 w-4" /> Merge PDFs
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white text-[var(--text-primary)] sm:text-4xl">Merge your PDF files in the browser</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 text-[var(--text-secondary)] sm:text-base">
                Upload PDF files, reorder them, and merge them instantly without leaving the page.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
              <p className="font-medium text-white">Files ready</p>
              <p className="mt-1 text-2xl font-semibold text-cyan-300">{stats.total}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Total files</p>
            </div>
          </div>
        </section>

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
              <p className="text-lg font-semibold text-white">Drag & drop PDF files here</p>
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
              accept="application/pdf"
              multiple
              onChange={handleInputChange}
            />
          </div>

          {error ? (
            <div className="mt-6 flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              <AlertTriangle className="h-5 w-5 text-red-300" />
              <div>
                <p className="font-semibold text-red-100">Invalid file type</p>
                <p>{error}</p>
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              {files.length > 0 ? (
                files.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#0f1528]/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="truncate text-sm font-semibold text-white">{item.file.name}</p>
                        <p className="text-xs text-gray-400">{formatBytes(item.file.size)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => moveFile(index, -1)}
                        disabled={index === 0}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-300 transition hover:border-cyan-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(index, 1)}
                        disabled={index === files.length - 1}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-300 transition hover:border-cyan-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 hover:text-red-100"
                        aria-label="Remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-white/10 bg-[#0f1528]/80 p-10 text-center text-sm text-gray-400">
                  Upload PDF files to build your merge list.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Summary</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{stats.total} files</p>
                </div>
                <div className="rounded-3xl bg-cyan-500/10 px-4 py-2 text-cyan-200">
                  {formatBytes(stats.size)}
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Need at least</p>
                  <p className="mt-2 text-lg font-semibold text-white">2 files to merge</p>
                </div>
                <button
                  type="button"
                  onClick={mergePdfs}
                  disabled={files.length < 2 || isMerging}
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-cyan-500 px-5 py-4 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isMerging ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Merging your files...
                    </>
                  ) : (
                    'Merge PDFs'
                  )}
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={files.length === 0 || isMerging}
                  className="inline-flex w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-3xl border border-cyan-400/20 bg-cyan-500/95 px-5 py-4 text-sm text-white shadow-2xl shadow-cyan-500/20 sm:w-auto">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-white" />
            <span>{toast}</span>
          </div>
        </div>
      ) : null}
    </main>
  )
}
