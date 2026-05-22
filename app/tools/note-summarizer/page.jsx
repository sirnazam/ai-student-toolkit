'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function NoteSummarizerPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) {
      setStatus('Please enter a valid email address.')
      return
    }

    const toolName = 'AI Note Summarizer'
    const mailto = `mailto:sirnazam01@gmail.com?subject=${encodeURIComponent(
      `Waitlist request for ${toolName}`
    )}&body=${encodeURIComponent(
      `Please add this email to the waitlist for ${toolName}: ${email}`
    )}`

    try {
      const stored = localStorage.getItem('waitlist_emails')
      const list = stored ? JSON.parse(stored) : []
      if (Array.isArray(list)) {
        list.push({ email, tool: toolName, createdAt: new Date().toISOString() })
        localStorage.setItem('waitlist_emails', JSON.stringify(list))
      }
    } catch {}

    setStatus('Thank you! You will be notified when the tool launches.')
    setEmail('')
    window.location.href = mailto
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0d1425] to-[#0a0a1a] text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-cyan-500/10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">AI Note Summarizer</h1>
            <p className="mt-3 text-gray-300">Coming Soon</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-cyan-200 border border-cyan-500/20">
            We&apos;re building this tool. Join the waitlist to be notified.
          </span>
        </div>

        <div className="mt-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-black hover:bg-cyan-400 transition"
            >
              Join Waitlist
            </button>
          </form>
          {status && <p className="text-sm text-cyan-200">{status}</p>}
          <div className="pt-4 border-t border-white/10 text-center">
            <Link href="/" className="text-sm text-gray-300 hover:text-white underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
