'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Printer, Sparkles } from 'lucide-react'
import { SCHOOLS } from '@/lib/schools'

const documentTypes = [
  'Project Report',
  'Assignment',
  'Lab Report',
  'Seminar Paper',
  'Research Proposal',
  'Industrial Training (SIWES) Report',
]

const levels = ['100L', '200L', '300L', '400L', '500L', 'Postgraduate']
const semesters = ['First Semester', 'Second Semester']

export default function CoverPageGenerator() {
  const [form, setForm] = useState({
    documentType: '',
    institutionName: '',
    faculty: '',
    department: '',
    courseTitle: '',
    courseCode: '',
    supervisorName: '',
    studentName: '',
    matricNumber: '',
    level: '',
    semester: '',
    academicSession: '',
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [previewGenerated, setPreviewGenerated] = useState(false)
  const [feedback, setFeedback] = useState({ error: '', success: '' })
  const [toastVisible, setToastVisible] = useState(false)

  const filteredSchools = useMemo(() => {
    const query = form.institutionName.trim().toLowerCase()
    if (!query) return []
    return SCHOOLS.filter((school) =>
      school.name.toLowerCase().includes(query) || school.abbr.toLowerCase().includes(query)
    ).slice(0, 8)
  }, [form.institutionName])

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (feedback.error) {
      setFeedback({ error: '', success: '' })
    }
  }

  const selectSchool = (school) => {
    setForm((prev) => ({
      ...prev,
      institutionName: school.name,
    }))
    setShowSuggestions(false)
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleGeneratePreview = () => {
    const missingFields = []
    if (!form.institutionName.trim()) missingFields.push('Institution Name')
    if (!form.courseTitle.trim()) missingFields.push('Course Title')
    if (!form.studentName.trim()) missingFields.push('Student Name')

    if (missingFields.length > 0) {
      setFeedback({
        error: `Please fill in: ${missingFields.join(', ')}`,
        success: '',
      })
      setPreviewGenerated(false)
      return
    }

    setPreviewGenerated(true)
    setFeedback({
      error: '',
      success: 'Cover page generated!',
    })
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const handleDownloadPDF = async () => {
    try {
      const el = document.getElementById('print-area')
      if (!el) return

      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('cover-page.pdf')
    } catch (err) {
      // fallback to print if PDF generation fails
      handlePrint()
    }
  }

  const previewAcademicSession = form.academicSession || '___'

  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10 relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-teal-300/80">PDF Tools</p>
            <h1 className="text-4xl sm:text-5xl font-bold">Cover Page Generator</h1>
            <p className="max-w-3xl text-gray-300 sm:text-lg">
              Create a polished Nigerian university cover page and download it as a PDF.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-teal-400/40 hover:bg-white/10"
          >
            Back to Home
          </Link>
        </div>

        {toastVisible && (
          <div className="pointer-events-none absolute right-0 top-0 z-20 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 shadow-xl shadow-emerald-500/10">
            Cover page generated!
          </div>
        )}

        <div className={`grid gap-8 ${previewGenerated ? 'xl:grid-cols-[1.1fr_0.9fr]' : 'grid-cols-1'}`}>
          <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10">
            <div className="rounded-3xl border border-white/10 bg-[#08101f] p-5">
              <div className="flex items-center gap-3 text-teal-300">
                <Search className="h-5 w-5" />
                <span className="font-semibold">Fill the cover page details</span>
              </div>
              <p className="mt-3 text-sm text-gray-300">
                Complete the required fields, then click Generate Cover Page to see the live preview and access download.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-gray-300">
                <span>Document Type</span>
                <select
                  value={form.documentType}
                  onChange={(event) => handleFieldChange('documentType', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Select document type</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="relative space-y-2 text-sm text-gray-300">
                <span>Institution Name</span>
                <input
                  type="text"
                  value={form.institutionName}
                  onChange={(event) => {
                    handleFieldChange('institutionName', event.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="University of Lagos"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                />
                {showSuggestions && filteredSchools.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220] text-sm text-gray-200 shadow-2xl shadow-black/30">
                    {filteredSchools.map((school) => (
                      <button
                        key={school.abbr || school.name}
                        type="button"
                        onMouseDown={() => selectSchool(school)}
                        className="w-full px-4 py-3 text-left hover:bg-white/10"
                      >
                        {school.name}
                      </button>
                    ))}
                  </div>
                )}
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-gray-300">
                <span>Faculty</span>
                <input
                  type="text"
                  value={form.faculty}
                  onChange={(event) => handleFieldChange('faculty', event.target.value)}
                  placeholder="Faculty of Engineering"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Department</span>
                <input
                  type="text"
                  value={form.department}
                  onChange={(event) => handleFieldChange('department', event.target.value)}
                  placeholder="Department of Computer Science"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-gray-300">
                <span>Course Title</span>
                <input
                  type="text"
                  value={form.courseTitle}
                  onChange={(event) => handleFieldChange('courseTitle', event.target.value)}
                  placeholder="Advanced Database Systems"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Course Code</span>
                <input
                  type="text"
                  value={form.courseCode}
                  onChange={(event) => handleFieldChange('courseCode', event.target.value)}
                  placeholder="CSE 411"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-gray-300">
                <span>Lecturer / Supervisor Name</span>
                <input
                  type="text"
                  value={form.supervisorName}
                  onChange={(event) => handleFieldChange('supervisorName', event.target.value)}
                  placeholder="Dr. A. A. Okonkwo"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Student Full Name</span>
                <input
                  type="text"
                  value={form.studentName}
                  onChange={(event) => handleFieldChange('studentName', event.target.value)}
                  placeholder="Chiamaka U. Eze"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-gray-300">
                <span>Matric Number</span>
                <input
                  type="text"
                  value={form.matricNumber}
                  onChange={(event) => handleFieldChange('matricNumber', event.target.value)}
                  placeholder="U2023/123456"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Level</span>
                <select
                  value={form.level}
                  onChange={(event) => handleFieldChange('level', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Select level</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-gray-300">
                <span>Semester</span>
                <select
                  value={form.semester}
                  onChange={(event) => handleFieldChange('semester', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Select semester</option>
                  {semesters.map((semester) => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Academic Session</span>
                <input
                  type="text"
                  value={form.academicSession}
                  onChange={(event) => handleFieldChange('academicSession', event.target.value)}
                  placeholder="2023/2024"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handleGeneratePreview}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-teal-400"
            >
              <Sparkles className="h-4 w-4" />
              Generate Cover Page
            </button>

            {feedback.error && (
              <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {feedback.error}
              </p>
            )}
            {feedback.success && (
              <p className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {feedback.success}
              </p>
            )}
          </div>

          {previewGenerated && (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 animate-slide-in">
              <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#08101f] p-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">Live Preview</h2>
                  <p className="mt-1 text-sm text-gray-400">Your cover page will print exactly like this.</p>
                </div>
                <span className="rounded-full bg-teal-500/10 px-3 py-1.5 text-xs uppercase tracking-[0.25em] text-teal-200">A4</span>
              </div>

              <div
                id="print-area"
                className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200/10 bg-white p-8 text-slate-950 shadow-xl transition duration-700 ease-out"
                style={{ aspectRatio: '0.707', minHeight: '720px', background: '#ffffff' }}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="space-y-8 text-center">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{form.institutionName || '___'}</p>
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                        {form.faculty ? `Faculty of ${form.faculty}` : 'Faculty of ___'}
                      </p>
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                        {form.department ? `Department of ${form.department}` : 'Department of ___'}
                      </p>
                    </div>

                    <div className="space-y-4 px-4">
                      <p className="uppercase text-xs tracking-[0.45em] text-slate-500">{form.documentType || '___'}</p>
                      <h1 className="text-3xl leading-tight text-slate-950 sm:text-4xl">
                        {form.courseTitle || '___'}
                      </h1>
                      <p className="text-lg text-slate-700">{form.courseCode || '___'}</p>
                    </div>
                  </div>

                  <div className="space-y-6 px-4 pb-2 text-slate-700">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-100/80 p-5">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Submitted to</p>
                        <p className="mt-2 text-base font-semibold text-slate-900">{form.supervisorName || '___'}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-100/80 p-5">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Submitted by</p>
                        <p className="mt-2 text-base font-semibold text-slate-900">{form.studentName || '___'}</p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-3xl bg-slate-100/80 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Matric Number</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{form.matricNumber || '___'}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-100/80 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Level</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{form.level || '___'}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-100/80 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Semester</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{form.semester || '___'}</p>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-slate-100/80 p-5 text-center">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Academic Session</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{previewAcademicSession}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/70 pt-4 text-center text-sm uppercase tracking-[0.35em] text-slate-500">
                    {form.institutionName || '___'} • {previewAcademicSession.includes('/') ? previewAcademicSession.split('/')[0] : previewAcademicSession}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00bcd4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
              >
                <Printer className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }

          #print-area,
          #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            background: white !important;
          }

          @page {
            size: A4 portrait;
            margin: 20mm;
          }
        }
      `}</style>
    </main>
  )
}
