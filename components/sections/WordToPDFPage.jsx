'use client'

import { useCallback, useRef, useState } from 'react'
import mammoth from 'mammoth'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
  Download,
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
  const [htmlContent, setHtmlContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const previewRef = useRef(null)

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
    extractContent(wordFile)
  }, [])

  const extractContent = async (wordFile) => {
    setIsLoading(true)
    setError('')
    setHtmlContent('')

    try {
      const arrayBuffer = await wordFile.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      setHtmlContent(result.value)
    } catch (err) {
      setError('Failed to extract content from the Word document. Please try another file.')
      console.error('Extraction error:', err)
      setFile(null)
    } finally {
      setIsLoading(false)
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
    setHtmlContent('')
    setError('')
  }

  const convertToPDF = async () => {
    if (!file || !previewRef.current) return

    setIsConverting(true)
    setError('')

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const filename = file.name.replace(/\.(doc|docx)$/i, '.pdf')
      pdf.save(filename)

      showToast('Document converted successfully!')
      removeFile()
    } catch (err) {
      setError('An error occurred while converting to PDF. Please try again.')
      console.error('Conversion error:', err)
    } finally {
      setIsConverting(false)
    }
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
                  <p className="text-sm font-medium text-gray-300">Extracting content from your document...</p>
                </div>
              </section>
            )}

            {htmlContent && (
              <>
                <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
                  <h2 className="mb-4 text-lg font-semibold text-white">Preview</h2>
                  <div className="rounded-2xl border border-white/10 bg-white p-6 sm:p-8 overflow-y-auto max-h-[600px]">
                    <div
                      ref={previewRef}
                      className="prose prose-invert max-w-none bg-white text-black p-8 rounded-lg"
                      style={{
                        minHeight: '297mm',
                        width: '210mm',
                        margin: '0 auto',
                        fontSize: '12pt',
                        lineHeight: '1.5',
                      }}
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </div>
                </section>

                <section className="flex gap-4 sm:gap-6">
                  <button
                    type="button"
                    onClick={convertToPDF}
                    disabled={isConverting}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Converting your document...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        Convert to PDF
                      </>
                    )}
                  </button>
                </section>
              </>
            )}

            {error && htmlContent === '' && !isLoading && (
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
