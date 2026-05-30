'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'
import { DownloadCloud, FileText, Sparkles } from 'lucide-react'

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const parsePages = (value) => {
  const tokens = value
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)

  if (tokens.length === 0) {
    throw new Error('Enter pages or ranges in the input field.')
  }

  const pages = new Set()

  for (const token of tokens) {
    if (token.includes('-')) {
      const [startRaw, endRaw] = token.split('-').map((part) => part.trim())
      const start = Number(startRaw)
      const end = Number(endRaw)

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error(`Invalid range: ${token}`)
      }
      if (start < 1 || end < 1 || end < start) {
        throw new Error(`Invalid range: ${token}`)
      }

      for (let page = start; page <= end; page += 1) {
        pages.add(page)
      }
    } else {
      const page = Number(token)
      if (!Number.isInteger(page) || page < 1) {
        throw new Error(`Invalid page: ${token}`)
      }
      pages.add(page)
    }
  }

  return Array.from(pages).sort((a, b) => a - b)
}

const parseRanges = (value) => {
  const tokens = value
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)

  if (tokens.length === 0) {
    throw new Error('Enter one or more ranges such as 1-3, 4-6.')
  }

  return tokens.map((token) => {
    const [startRaw, endRaw] = token.split('-').map((part) => part.trim())
    if (!endRaw) {
      throw new Error(`Invalid range: ${token}`)
    }
    const start = Number(startRaw)
    const end = Number(endRaw)

    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      throw new Error(`Invalid range: ${token}`)
    }
    if (start < 1 || end < 1 || end < start) {
      throw new Error(`Invalid range: ${token}`)
    }

    return { start, end }
  })
}

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export default function SplitPDFRoute() {
  const inputRef = useRef(null)
  const [pdfBuffer, setPdfBuffer] = useState(null)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [mode, setMode] = useState('extract')
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const resetMessages = () => {
    setError('')
    setSuccess('')
  }

  const validateFile = (file) => {
    const isPdfFile = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdfFile) {
      throw new Error('Only PDF files are allowed. Please upload a .pdf file.')
    }
    return file
  }

  const handleFileSelection = async (file) => {
    try {
      resetMessages()
      const validFile = validateFile(file)
      const arrayBuffer = await validFile.arrayBuffer()
      const loadedPdf = await PDFDocument.load(arrayBuffer)
      setPdfBuffer(arrayBuffer)
      setFileName(validFile.name)
      setFileSize(validFile.size)
      setPageCount(loadedPdf.getPageCount())
    } catch (err) {
      setError(err.message ?? 'Unable to read PDF file.')
      setPdfBuffer(null)
      setFileName('')
      setFileSize(0)
      setPageCount(0)
    }
  }

  const onInputChange = (event) => {
    setInputValue(event.target.value)
    resetMessages()
  }

  const onSelectMode = (value) => {
    setMode(value)
    setInputValue('')
    resetMessages()
  }

  const onDrop = async (event) => {
    event.preventDefault()
    setDragActive(false)
    if (!event.dataTransfer?.files?.length) return
    await handleFileSelection(event.dataTransfer.files[0])
  }

  const onBrowse = () => {
    inputRef.current?.click()
  }

  const onFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      await handleFileSelection(file)
      event.target.value = ''
    }
  }

  const createSinglePdf = async (sourcePdf, pageIndexes) => {
    const newPdf = await PDFDocument.create()
    const copiedPages = await newPdf.copyPages(sourcePdf, pageIndexes)
    copiedPages.forEach((page) => newPdf.addPage(page))
    return newPdf.save()
  }

  const createZip = async (files) => {
    const zip = new JSZip()
    files.forEach(({ name, data }) => {
      zip.file(name, data)
    })
    const content = await zip.generateAsync({ type: 'blob' })
    return content
  }

  const handleSplit = async () => {
    if (!pdfBuffer) {
      setError('Please upload a PDF before splitting.')
      return
    }

    setLoading(true)
    resetMessages()

    try {
      const sourcePdf = await PDFDocument.load(pdfBuffer)
      const baseName = fileName.replace(/\.pdf$/i, '') || 'split-pdf'
      let createdFiles = 0

      if (mode === 'extract') {
        const pages = parsePages(inputValue)
        if (pages.some((page) => page > sourcePdf.getPageCount())) {
          throw new Error('One or more requested pages exceed the PDF page count.')
        }

        const pageIndexes = pages.map((page) => page - 1)
        const extractedBytes = await createSinglePdf(sourcePdf, pageIndexes)
        downloadBlob(new Blob([extractedBytes], { type: 'application/pdf' }), `${baseName}-extracted.pdf`)
        createdFiles = 1
      } else if (mode === 'individual') {
        const total = sourcePdf.getPageCount()
        const pageFiles = []

        for (let index = 0; index < total; index += 1) {
          const bytes = await createSinglePdf(sourcePdf, [index])
          pageFiles.push({ name: `page-${index + 1}.pdf`, data: bytes })
        }

        const zipBlob = await createZip(pageFiles)
        downloadBlob(zipBlob, `${baseName}-pages.zip`)
        createdFiles = total
      } else if (mode === 'range') {
        const ranges = parseRanges(inputValue)
        const rangeFiles = []

        for (const { start, end } of ranges) {
          if (end > sourcePdf.getPageCount()) {
            throw new Error(`Range ${start}-${end} exceeds the PDF page count.`)
          }
          const indexes = []
          for (let page = start; page <= end; page += 1) {
            indexes.push(page - 1)
          }
          const bytes = await createSinglePdf(sourcePdf, indexes)
          rangeFiles.push({ name: `${baseName}-${start}-${end}.pdf`, data: bytes })
        }

        const zipBlob = await createZip(rangeFiles)
        downloadBlob(zipBlob, `${baseName}-ranges.zip`)
        createdFiles = rangeFiles.length
      }

      setSuccess(`PDF split successfully! ${createdFiles} file${createdFiles === 1 ? '' : 's'} created.`)
    } catch (err) {
      setError(err.message ?? 'Unable to split PDF. Please check your input.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#090a1d] bg-[var(--bg-primary)] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-teal-300/80">PDF Tools</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white text-[var(--text-primary)] sm:text-5xl">
              Split PDF
            </h1>
            <p className="mt-4 max-w-3xl text-gray-300 text-[var(--text-secondary)] sm:text-lg">
              Upload a PDF and split it into extracted pages, individual files, or custom page ranges — directly in your browser.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/tools/pdf-tools"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-teal-400/40 hover:bg-white/10"
            >
              Back to PDF tools
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(15,23,42,0.2)]">
            <div
              className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition ${
                dragActive ? 'border-teal-400/70 bg-teal-500/5' : 'border-white/20 bg-white/5'
              }`}
              onDragEnter={(event) => {
                event.preventDefault()
                setDragActive(true)
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                event.preventDefault()
                setDragActive(false)
              }}
              onDrop={onDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={onFileChange}
              />
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-500/10 text-teal-300">
                  <FileText className="h-9 w-9" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">Upload your PDF</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Drag and drop here, or{' '}
                    <button type="button" onClick={onBrowse} className="font-semibold text-teal-300 hover:text-teal-200">
                      click to browse
                    </button>
                  </p>
                </div>
                <p className="text-sm text-gray-500">Only .pdf files are accepted.</p>
              </div>
            </div>

            {fileName ? (
              <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-5">
                <p className="text-sm uppercase tracking-[0.32em] text-teal-300/80">Uploaded file</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-gray-400">File name</p>
                    <p className="mt-2 text-sm font-medium text-white">{fileName}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Size</p>
                    <p className="mt-2 text-sm font-medium text-white">{formatBytes(fileSize)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Pages</p>
                    <p className="mt-2 text-sm font-medium text-white">{pageCount}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-teal-300/80">Split options</p>
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    mode === 'extract'
                      ? 'border-teal-400 bg-teal-400/10 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-teal-400/20 hover:bg-white/10'
                  }`}
                  onClick={() => onSelectMode('extract')}
                >
                  <span className="block text-sm font-semibold">Extract specific pages</span>
                  <span className="block text-sm text-gray-400">e.g. 1,3,5-8,10</span>
                </button>
                <button
                  type="button"
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    mode === 'individual'
                      ? 'border-teal-400 bg-teal-400/10 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-teal-400/20 hover:bg-white/10'
                  }`}
                  onClick={() => onSelectMode('individual')}
                >
                  <span className="block text-sm font-semibold">Split into individual pages</span>
                  <span className="block text-sm text-gray-400">Each page becomes a separate PDF file</span>
                </button>
                <button
                  type="button"
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    mode === 'range'
                      ? 'border-teal-400 bg-teal-400/10 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-teal-400/20 hover:bg-white/10'
                  }`}
                  onClick={() => onSelectMode('range')}
                >
                  <span className="block text-sm font-semibold">Split by range</span>
                  <span className="block text-sm text-gray-400">e.g. 1-3, 4-6, 7-10</span>
                </button>
              </div>

              {(mode === 'extract' || mode === 'range') && (
                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-white" htmlFor="page-input">
                    {mode === 'extract' ? 'Pages to extract' : 'Ranges to split'}
                  </label>
                  <input
                    id="page-input"
                    type="text"
                    value={inputValue}
                    onChange={onInputChange}
                    placeholder={mode === 'extract' ? 'e.g. 1,3,5-8,10' : 'e.g. 1-3, 4-6, 7-10'}
                    className="w-full rounded-3xl border border-white/10 bg-[#0b1224] px-4 py-3 text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  />
                  <p className="text-sm text-gray-400">
                    {mode === 'extract'
                      ? 'Extract only the pages you specify into one PDF file.'
                      : 'Create one PDF for every range you specify and download them together in a ZIP.'}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleSplit}
                disabled={loading || !pdfBuffer}
                className="mt-6 inline-flex items-center justify-center rounded-3xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-teal-500/50"
              >
                {loading ? 'Working…' : 'Split PDF'}
              </button>

              {error ? (
                <div className="mt-4 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="mt-4 rounded-3xl border border-teal-500/20 bg-teal-500/10 px-4 py-3 text-sm text-teal-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>{success}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="rounded-3xl bg-[#0f172a] p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-teal-300/80">How it works</p>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-gray-300">
                <li>Upload a single PDF file using drag-and-drop or the browse button.</li>
                <li>Choose whether to extract pages, split every page, or split by custom ranges.</li>
                <li>Download the output automatically after processing.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-teal-300/80">Quick tip</p>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                Use page ranges to export groups of slides or assignment sections as separate files for faster review.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {success ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-3xl border border-teal-400/20 bg-[#082a23] px-5 py-4 shadow-[0_20px_70px_rgba(16,185,129,0.18)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-200">
              <DownloadCloud className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">PDF split successfully!</p>
              <p className="text-xs text-gray-300">Your download should begin automatically.</p>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
