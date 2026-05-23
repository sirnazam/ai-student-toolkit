'use client'

import Link from 'next/link'
import {
  FileText,
  Layers,
  FileMinus,
  Scissors,
  FileInput,
  ImageIcon,
  RotateCcw,
  Hash,
  FileEdit,
  BookOpen,
} from 'lucide-react'

const tools = [
  {
    title: 'Cover Page Generator',
    description: 'Generate professional Nigerian university cover pages for assignments and project reports.',
    href: '/tools/pdf-tools/cover-page',
    icon: FileText,
    status: 'Live',
  },
  {
    title: 'Merge PDFs',
    description: 'Combine multiple PDF files into a single document in the browser.',
    href: '/tools/pdf-tools/merge',
    icon: Layers,
    status: 'Live',
  },
  {
    title: 'Compress PDF',
    description: 'Reduce PDF file size for faster sharing and easy upload submissions.',
    href: '/tools/pdf-tools/compress',
    icon: FileMinus,
    status: 'Live',
  },
  {
    title: 'Split PDF',
    description: 'Break a PDF into smaller files or extract only the pages you need.',
    href: '/tools/pdf-tools/split',
    icon: Scissors,
    status: 'Live',
  },
  {
    title: 'Word to PDF',
    description: 'Convert assignment documents from Word to PDF format quickly.',
    href: '/tools/pdf-tools/word-to-pdf',
    icon: FileInput,
    status: 'LIVE',
  },
  {
    title: 'PDF to Word',
    description: 'Turn your PDF into an editable Word document for easy updates.',
    icon: FileEdit,
    status: 'Coming Soon',
  },
  {
    title: 'PDF to JPG',
    description: 'Extract pages from your PDF as high-quality JPG images.',
    icon: ImageIcon,
    status: 'Coming Soon',
  },
  {
    title: 'JPG to PDF',
    description: 'Convert your scanned pages and lecture notes into one PDF file.',
    icon: ImageIcon,
    status: 'Coming Soon',
  },
  {
    title: 'Rotate PDF',
    description: 'Fix page orientation quickly without leaving the browser.',
    icon: RotateCcw,
    status: 'Coming Soon',
  },
  {
    title: 'Add Page Numbers',
    description: 'Automatically insert page numbers for assignments and reports.',
    icon: Hash,
    status: 'Coming Soon',
  },
  {
    title: 'Remove Pages',
    description: 'Delete unwanted pages from your PDF before submission.',
    icon: FileMinus,
    status: 'Coming Soon',
  },
  {
    title: 'Assignment Formatter',
    description: 'Prepare your document with the right academic layout and styling.',
    icon: FileEdit,
    status: 'Coming Soon',
  },
  {
    title: 'PDF Summarizer',
    description: 'Summarize long PDF notes into clear, student-friendly points.',
    icon: BookOpen,
    status: 'Coming Soon',
  },
]

export default function PDFToolsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div className="space-y-3">
            <p className="inline-flex items-center text-sm uppercase tracking-[0.35em] text-teal-300/80">
              <span className="mr-2">PDF Tools</span>
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              PDF Tools
            </h1>
            <p className="max-w-3xl text-gray-300 sm:text-lg">
              Everything you need to handle documents as a Nigerian student.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-teal-400/40 hover:bg-white/10"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const ToolIcon = tool.icon
            const isLive = tool.status.toLowerCase() === 'live'
            const card = (
              <div
                className={`h-full rounded-3xl border p-6 bg-white/5 transition-all ${
                  isLive
                    ? 'border-teal-400/20 shadow-[0_0_30px_rgba(16,185,129,0.14)]'
                    : 'border-white/10 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-500/10 text-teal-200">
                          {tool.icon ? (
                            <tool.icon className="h-7 w-7" />
                          ) : (
                            <div className="text-sm font-semibold">PDF</div>
                          )}
                        </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.25em] ${
                      isLive
                        ? 'bg-teal-500/15 text-teal-200 border border-teal-400/20'
                        : 'bg-white/10 text-gray-300 border border-white/10'
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>

                <div className="mt-8 space-y-4">
                  <h2 className="text-xl font-semibold text-white">{tool.title}</h2>
                  <p className="text-sm leading-relaxed text-gray-300">{tool.description}</p>
                </div>

                {isLive && tool.href ? (
                  <Link
                    href={tool.href}
                    className="mt-8 inline-flex text-sm font-medium text-teal-300 transition hover:text-teal-100"
                  >
                    Open tool →
                  </Link>
                ) : (
                  <div className="mt-8 text-sm font-medium text-gray-500">Coming soon</div>
                )}
              </div>
            )

            return (
              <div key={tool.title} className="group">
                {card}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
