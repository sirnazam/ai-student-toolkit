import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export const metadata = {
  title: 'AI Student Toolkit | Free Tools for African Students',
  description: 'Free student utilities for calculating CGPA, generating CVs, summarizing notes, and boosting academic productivity. Built for African students.',
  keywords: 'CGPA Calculator, CV Builder, Note Summarizer, Student Tools, African Students',
  openGraph: {
    title: 'AI Student Toolkit',
    description: 'Free student utilities designed for African universities',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: 'var(--bg-gradient)', color: 'var(--text-primary)' }}>
        <ThemeProvider>
          {children}
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  )
}
