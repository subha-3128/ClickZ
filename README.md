<div align="center">
  <img src="public/pwa-512.png" alt="ClickZ Logo" width="105" />
  <h1>ClickZ 🔗</h1>
  <p><strong>A minimal, blazing fast, and secure Liquid Glass link management platform.</strong></p>

  [![Deployment](https://img.shields.io/badge/Vercel-Deploys_Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://click-z.vercel.app/)
  [![React](https://img.shields.io/badge/React_19-00D8FF?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![PWA Ready](https://img.shields.io/badge/PWA-Offline_Ready-FF6F00?style=for-the-badge&logo=pwa&logoColor=white)](https://click-z.vercel.app/)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

  <br />

  [🌐 **Explore Live App**](https://click-z.vercel.app/) • [🐛 **Report an Issue**](https://github.com/subha-3128/ClickZ/issues) • [👨‍💻 **Connect with Author**](https://www.linkedin.com/in/subhajit-bepari/)
</div>

---

## 📖 Table of Contents

- [🌟 Key Features](#-key-features)
- [💎 Liquid Glass Design System](#-liquid-glass-design-system)
- [🎨 Theme Palette Specs](#-theme-palette-specs)
- [⚡ Motion & Physics Architecture](#-motion--physics-architecture)
- [🔍 SEO & Social Sharing Engine](#-seo--social-sharing-engine)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Quick Start (Local Setup)](#-quick-start-local-setup)
- [👨‍💻 Author & Credits](#-author--credits)

---

## 🌟 Key Features

- 🔐 **Secure Google OAuth**: Passwordless 1-click Google authentication powered by **Supabase Auth**.
- ⚡ **Instant Real-Time Search**: Search through saved URLs, custom identifiers, and titles with zero latency.
- 🎯 **Smart Auto-Logo Discovery**: Automatically resolves domain favicons and brand logos using the **Iconify API** with initial fallback avatars.
- 📱 **Progressive Web App (PWA)**: Fully installable on iOS, Android, macOS, and Windows. Works offline via custom Service Worker caching.
- 💎 **Liquid Glass UI**: Ultra-premium frosted glass panels with specular glare sweep reflections and morphing ambient liquid background orbs.
- 📱 **1-Row Responsive Header**: Strict single-line alignment of `ClickZ` title, light/dark mode shifting icon, and Google profile avatar across all viewports.
- 📋 **One-Click Copy Feedback**: Instant clipboard copy with animated emerald glass checkmark indicators.
- 🛡️ **Safe CRUD Operations**: Add, edit, open in new tab, and safely confirm link deletions.

---



## ⚡ Motion & Physics Architecture

- **Custom Cubic-Bezier Easings**: Powered by custom physics curves (`var(--ease-spring)`: `cubic-bezier(0.34, 1.56, 0.64, 1)` and `var(--ease-out-fluid)`: `cubic-bezier(0.16, 1, 0.3, 1)`).
- **Staggered Card Cascade**: Link card list items cascade into view with a 45ms staggered delay per card.
- **Sun/Moon Spin Animation**: 360-degree rotation spin and scale bounce when toggling theme mode.
- **450ms Global Theme Shift**: Smooth surface color interpolation across all UI components when shifting between Light and Dark mode.

---

## 🔍 SEO & Social Sharing Engine

- **Open Graph & Twitter Cards**: High-resolution custom social card previews (`og:image`, `twitter:card`).
- **Structured Data (Schema.org)**: Embedded JSON-LD `WebApplication` & `Person` schemas for Google rich search results.
- **Preconnected Fonts**: Preconnected Google Fonts (`Plus Jakarta Sans` & `Manrope`) for fast text rendering.
- **PWA Manifest & Theme-Color**: Media-query responsive `theme-color` headers matching mobile status bars.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Build Tool & Server** | [Vite 8](https://vitejs.dev/) |
| **Styling** | Vanilla CSS (Liquid Glass Tokens & Keyframe Animations) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Authentication** | Supabase Auth (Google OAuth 2.0) |
| **PWA & Offline** | Web App Manifest & Service Workers |
| **Icons & Logos** | [Iconify API](https://iconify.design/) & Custom SVGs |
| **Analytics** | [Vercel Speed Insights](https://vercel.com/analytics) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📂 Project Structure

```bash
ClickZ/
├── public/
│   ├── favicon.svg          # App Favicon
│   ├── manifest.webmanifest # PWA Web Manifest
│   ├── og-image.png         # 1200x630 Social Preview Card
│   ├── robots.txt           # Search Engine Directives
│   ├── sitemap.xml          # Search Engine Sitemap
│   └── sw.js                # Service Worker for Offline PWA Support
├── src/
│   ├── components/
│   │   ├── auth/            # LoginScreen & Liquid Auth Styling
│   │   ├── layout/          # 1-Row Header, Theme Toggle, Profile Chip
│   │   ├── links/           # LinkCard, LinkForm Modal, SkeletonList
│   │   └── ui/              # EmptyState, Toast Notifications, SVG Icons
│   ├── lib/
│   │   └── supabase.js      # Supabase Client Initialization
│   ├── utils/
│   │   └── helpers.js       # Auto-Logo Candidate Generator & Helpers
│   ├── App.jsx              # Main Application Orchestrator
│   ├── App.css              # Global Liquid Glass Tokens & Color Palettes
│   ├── index.css            # Base Resets, Motion Easings & Keyframes
│   └── main.jsx             # React DOM Root Entry
├── index.html               # Primary HTML5 Shell & Schema.org JSON-LD
└── package.json             # Project Dependencies & Scripts
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A **Supabase** account with Google OAuth enabled

### 1. Clone the Repository
```bash
git clone https://github.com/subha-3128/ClickZ.git
cd ClickZ
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👨‍💻 Author & Credits

<div align="center">

### **Subhajit Bepari**
*Full-Stack Software Engineer & UI/UX Designer*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/subhajit-bepari/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/subha-3128)
[![Live Demo](https://img.shields.io/badge/Live_App-Visit-00B4D8?style=for-the-badge&logo=vercel&logoColor=white)](https://click-z.vercel.app/)

</div>

---

<div align="center">
  <sub>Built with ❤️ by Subhajit Bepari. Powered by React 19, Supabase & Liquid Glass.</sub>
</div>

