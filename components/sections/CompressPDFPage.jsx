'use client'

import { useCallback, useState, useRef } from 'react'
import { PDFDocument } from 'pdf-lib'
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  Upload,
  ArrowDownCircle,
} from 'lucide-react'

const COMPRESSION_LEVELS = {
  low: {
    name: 'Low compression',
    description: 'Best quality',
    value: 'low',
  },
  medium: {
    name: 'Medium compression',
    description: 'Balanced',
    value: 'medium',
  },
  high: {
    name: 'High compression',
    description: 'Smallest size',
    value: 'high',
  },
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function CompressPDFPage() {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [isCompressing, setIsCompressing] = useState(false)
  const [toast, setToast] = useState('')
  const [compressionLevel, setCompressionLevel] = useState('medium')
  const [compressedSize, setCompressedSize] = useState(null)
  const inputRef = useRef(null)

  const showToast = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }, [])

  const handleFiles = useCallback((incomingFiles) => {
    setError('')
    const pdfFile = incomingFiles[0]

    if (!pdfFile) return

    if (pdfFile.type !== 'application/pdf' && !pdfFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are allowed. Please upload a valid .pdf file.')
      return
    }

    setFile(pdfFile)
    setCompressedSize(null)
  }, [])

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
    setCompressedSize(null)
    setError('')
  }

  const compressPdf = async () => {
    if (!file) return
    setIsCompressing(true)
    setError('')

    try {
      const bytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(bytes)

      // Remove metadata to reduce size
      pdfDoc.setTitle('')
      pdfDoc.setAuthor('')
      pdfDoc.setSubject('')
      pdfDoc.setKeywords([])
      pdfDoc.setProducer('')
      pdfDoc.setCreator('')

      let options = {}

      // Apply compression level options
      if (compressionLevel === 'high') {
        options = {
          useObjectStreams: true,
        }
      } else if (compressionLevel === 'medium') {
        options = {
          useObjectStreams: false,
        }
      } else {
        // low compression - minimal processing
        options = {
          useObjectStreams: false,
        }
      }

      const compressedBytes = await pdfDoc.save(options)
      const blob = new Blob([compressedBytes], { type: 'application/pdf' })

      setCompressedSize(blob.size)

      // Auto-download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'compressed.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      showToast('PDF compressed successfully!')

      // Reset after a short delay
      setTimeout(() => {
        setFile(null)
        setCompressedSize(null)
      }, 2000)
    } catch (err) {
      setError('An error occurred while compressing the PDF. Please try again.')
      console.error(err)
    } finally {
      setIsCompressing(false)
    }
  }

  const originalSize = file?.size || 0
  const reductionPercentage =
    compressedSize && originalSize
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0

  return (
    <main className="min-h-screen bg-[#070912] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                <ArrowDownCircle className="h-4 w-4" /> Compress PDF
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Reduce PDF file size
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
                Compress your PDFs in the browser for faster sharing and easy submission without losing quality.
              </p>
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
              <p className="text-lg font-semibold text-white">Drag & drop your PDF here</p>
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
              onChange={handleInputChange}
            />
          </div>

          {error ? (
            <div className="mt-6 flex items-start gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              <AlertTriangle className="h-5 w-5 text-red-300 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-100">Invalid file type</p>
                <p>{error}</p>
              </div>
            </div>
          ) : null}

          {file ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-[#0f1528]/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300 flex-shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-semibold text-white">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        Original size: {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                </div>

                {compressedSize ? (
                  <div className="rounded-3xl border border-teal-500/20 bg-teal-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-teal-300 mt-0.5 flex-shrink-0" />
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-teal-200/60">
                            Compression complete
                          </p>
                          <p className="mt-1 text-lg font-semibold text-teal-100">
                            Reduced by {reductionPercentage}%
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-teal-200/60">Original</p>
                            <p className="mt-1 font-semibold text-teal-100">
                              {formatBytes(originalSize)}
                            </p>
                          </div>
                          <div>
                            <p className="text-teal-200/60">Compressed</p>
                            <p className="mt-1 font-semibold text-teal-100">
                              {formatBytes(compressedSize)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                  Compression level
                </p>

                <div className="space-y-3 mb-6">
                  {Object.values(COMPRESSION_LEVELS).map((level) => (
                    <label
                      key={level.value}
                      className="flex items-center gap-3 cursor-pointer rounded-2xl border transition p-3 hover:bg-white/10"
                      style={{
                        borderColor:
                          compressionLevel === level.value
                            ? 'rgb(34, 197, 94)'
                            : 'rgb(255, 255, 255, 0.1)',
                        backgroundColor:
                          compressionLevel === level.value
                            ? 'rgb(34, 197, 94, 0.05)'
                            : 'transparent',
                      }}
                    >
                      <input
                        type="radio"
                        name="compression"
                        value={level.value}
                        checked={compressionLevel === level.value}
                        onChange={(e) => setCompressionLevel(e.target.value)}
                        disabled={isCompressing}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{level.name}</p>
                        <p className="text-xs text-gray-400">{level.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={compressPdf}
                    disabled={isCompressing || !file}
                    className="inline-flex w-full items-center justify-center rounded-3xl bg-cyan-500 px-5 py-4 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compressing...
                      </>
                    ) : compressedSize ? (
                      'Compress Again'
                    ) : (
                      'Compress PDF'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={removeFile}
                    disabled={isCompressing}
                    className="inline-flex w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove file
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      {/* Toast notification */}
      {toast ? (
        <div className="fixed bottom-6 right-6 rounded-3xl border border-teal-500/20 bg-teal-500/10 px-6 py-4 text-sm font-medium text-teal-100 flex items-center gap-2 shadow-2xl">
          <CheckCircle2 className="h-5 w-5 text-teal-300" />
          {toast}
        </div>
      ) : null}
    </main>
  )
}
