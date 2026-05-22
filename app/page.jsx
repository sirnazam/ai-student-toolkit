'use client'

import { useCallback } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import HeroCard from '@/components/sections/HeroCard'
import PopularTools from '@/components/sections/PopularTools'
import CTASection from '@/components/sections/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  const handleExplore = useCallback(() => {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleJoinWaitlist = useCallback(() => {
    alert('Thank you! You will be notified when we launch more features.')
  }, [])

  return (
    <main className="min-h-screen bg-gradient-dark overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 sm:pt-0">
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-8 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Hero Left */}
            <div className="w-full max-w-none">
              <Hero onExplore={handleExplore} onJoinWaitlist={handleJoinWaitlist} />
            </div>

            {/* Hero Right - Floating Card */}
            <div className="hidden lg:flex w-full max-w-lg justify-center">
              <HeroCard />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section id="tools">
        <PopularTools />
      </section>

      {/* CTA Section */}
      <section>
        <CTASection />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
