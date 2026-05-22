# AI Student Toolkit - Premium SaaS Landing Page

A modern, responsive landing page built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion** for the AI Student Toolkit - a platform designed for African/Nigerian students with smart academic tools.

## 🎨 Features

✨ **Premium Design**
- Dark-themed glassmorphism UI
- Smooth scroll animations with Framer Motion
- Responsive across all devices
- Premium SaaS aesthetic (Stripe/Linear/Vercel style)

🚀 **Performance**
- Next.js 14 with App Router
- Optimized for Core Web Vitals
- Fast page load times
- Mobile-first responsive design

🛠️ **Components**
- **Navbar** - Fixed navigation with mobile menu
- **Hero Section** - Eye-catching hero with stats
- **Hero Card** - Interactive CGPA calculator demo
- **Popular Tools** - 4 premium tool cards with hover animations
- **CTA Section** - Call-to-action for sign-ups
- **Footer** - Links and social connections

## 📋 Requirements

- Node.js 16+ or 18+
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Run Development Server

```bash
npm run dev
# or
yarn dev
```

The site will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
ai-student-toolkit/
├── app/
│   ├── layout.jsx          # Root layout with metadata
│   ├── page.jsx            # Main landing page
│   └── globals.css         # Global styles & animations
├── components/
│   ├── Navbar.jsx          # Navigation bar
│   ├── Footer.jsx          # Footer component
│   ├── sections/           # Page sections
│   │   ├── Hero.jsx        # Hero section
│   │   ├── HeroCard.jsx    # Interactive calculator card
│   │   ├── PopularTools.jsx # Tools showcase
│   │   └── CTASection.jsx  # Call-to-action section
│   └── ui/
│       └── ToolCard.jsx    # Reusable tool card component
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── jsconfig.json
```

## 🎯 Page Sections

### Hero Section
- Badge: "Built For African Students"
- Headline with blue gradient: "Study Smarter With AI-Powered Tools"
- Subtitle with key benefits
- Two CTA buttons: "Explore Tools" and "Join Waitlist"
- Stats section: 20k+ Users, 15+ Tools, 100% Mobile Friendly

### Hero Card (Right side)
- Interactive CGPA Calculator
- Live badge with pulsing indicator
- Course units input
- Grade selector (A-F)
- Calculate button
- Real-time result display

### Popular Tools Section
- 4 premium tool cards in responsive grid
- Each card: CGPA Calculator, Note Summarizer, CV Builder, Assignment Helper
- Hover animations and smooth transitions
- Icons and descriptions

### CTA Section
- Large, prominent call-to-action
- "Start Building Your Academic Advantage"
- Black button: "Get Started Free"
- Trust indicators

### Footer
- Brand information
- Quick links
- Social media links
- Copyright info

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Secondary**: Cyan (#06b6d4)
- **Background**: Dark gradient (#0f0f0f → #1a1a2e)
- **Text**: Light gray (#f3f4f6)

### Effects
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Animations**: Framer Motion for smooth transitions
- **Shadows**: Soft shadows for depth
- **Borders**: Rounded 2xl-3xl corners

### Spacing
- Responsive padding and margins
- Mobile-first approach
- Proper whitespace for readability

## 🎬 Animations

- **Fade In Up**: Initial page load
- **Float**: Decorative elements
- **Hover Effects**: Cards and buttons
- **Scroll Animations**: Elements animate on scroll view
- **Pulse**: Live indicators

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🛠️ Customization

### Change Colors
Edit `tailwind.config.js` to modify the color palette.

### Update Content
Edit component files directly:
- `components/sections/Hero.jsx` - Hero content
- `components/sections/PopularTools.jsx` - Tool cards
- `components/Footer.jsx` - Footer content

### Add New Sections
Create new component in `components/sections/` and import in `app/page.jsx`.

## 📦 Dependencies

- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
Build the project:
```bash
npm run build
```

Deploy the `.next` folder to your hosting provider.

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit a pull request.

## 💬 Support

For questions or issues, please create an issue on the repository.

---

Built with ❤️ for African Students
