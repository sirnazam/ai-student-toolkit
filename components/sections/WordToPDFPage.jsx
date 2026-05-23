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
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)

  // ConvertAPI client will be imported dynamically in the browser

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
    convertFile(wordFile)
  }, [])

  const convertFile = async (wordFile) => {
    setIsLoading(true)
    setError('')
    setIsConverting(true)

    try {
      const ConvertApi = (await import('convertapi-js')).default
      const convertApi = ConvertApi.auth('trial')
      const params = convertApi.createParams()
      params.append('File', wordFile)

      const result = await convertApi.convert('docx', 'pdf', params)
      const url = result.files && result.files[0] && result.files[0].Url

      if (!url) throw new Error('No file URL returned from ConvertAPI')

      // Fetch the converted PDF and download with original filename
      const resp = await fetch(url)
      if (!resp.ok) throw new Error('Failed to fetch converted PDF')
      const blob = await resp.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = wordFile.name.replace(/\.(doc|docx)$/i, '.pdf')
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objectUrl)

      showToast('Document converted successfully!')
      setFile(null)
    } catch (err) {
      console.error('ConvertAPI error:', err)
      setError('An error occurred during conversion. Please try again.')
    } finally {
      setIsLoading(false)
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

  // Note: conversion now happens automatically on upload via convertFile()

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
          <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">File information</p>
                  <p className="mt-2 text-lg font-semibold text-white">{file.name}</p>
                  <p className="mt-1 text-sm text-gray-400">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  disabled={isLoading || isConverting}
                  className="rounded-full bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </section>

            {isLoading && (
              <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
                  <p className="text-sm font-medium text-gray-300">Converting your document...</p>
                </div>
              </section>
            )}

            {error && !isLoading && (
              <div className="flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-300" />
                <p>{error}</p>
              </div>
            )}
          </div>
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
