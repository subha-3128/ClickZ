<div align="center">
  <img src="public/pwa-512.png" alt="ClickZ Logo" width="100" />
  <h1>ClickZ 🔗</h1>
  <p><strong>A minimal, blazing fast, and secure 3D Claymorphic link management platform.</strong></p>

  [![Deployment](https://img.shields.io/badge/Vercel-Deploys_Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://click-z.vercel.app/)
  [![React](https://img.shields.io/badge/React_19-00D8FF?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![PWA Ready](https://img.shields.io/badge/PWA-Offline_Ready-FF6F00?style=for-the-badge&logo=pwa&logoColor=white)](https://click-z.vercel.app/)

  <br />

  [🌐 **Explore Live App**](https://click-z.vercel.app/) • [🐛 **Report an Issue**](https://github.com/subha-3128/ClickZ/issues) • [👨‍💻 **Connect with Author**](https://www.linkedin.com/in/subhajit-bepari/)
</div>

---

## 📖 Table of Contents

- [🌟 Key Features](#-key-features)
- [🎨 3D Claymorphism Design System](#-3d-claymorphism-design-system)
- [🔍 SEO & Social Sharing Engine](#-seo--social-sharing-engine)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Quick Start (Local Setup)](#-quick-start-local-setup)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [👨‍💻 Author & Credits](#-author--credits)
- [📄 License](#-license)

---

## 🌟 Key Features

- 🔐 **Secure Google OAuth**: Passwordless 1-click Google authentication powered by **Supabase Auth**.
- ⚡ **Instant Real-Time Search**: Search through saved URLs, custom identifiers, and titles with zero latency.
- 🎯 **Smart Auto-Logo Retrieval**: Automatically resolves domain logos using the **Iconify API** with initial fallback avatars.
- 📱 **Progressive Web App (PWA)**: Fully installable on iOS, Android, macOS, and Windows. Works offline via custom Service Worker caching.
- 🌓 **Dual 3D Clay Themes**: Toggle seamlessly between **Dark Clay** (Deep Charcoal & Electric Cyan) and **Light Clay** (Pastel Slate & Deep Blue).
- 📋 **One-Click Quick Copy**: Instant clipboard copy feedback for fast sharing.
- 🔒 **Safe CRUD Operations**: Add, edit, copy, and safely confirm link deletions.

---

## 🎨 3D Claymorphism Design System

ClickZ implements a state-of-the-art **Claymorphism** visual language featuring:

- **Soft 3D Volumetric Panels**: Dual inner lighting reflections (`inset 3px 3px 6px rgba(255, 255, 255, 0.22)`) paired with deep bottom-right inset shadows and floating drop shadows.
- **Spring Physics Micro-Interactions**: Interactive buttons feature tactile 3D hover lifting (`transform: translateY(-3px) scale(1.03)`) and satisfying press squishing (`transform: translateY(2px) scale(0.96)`).
- **Sunken Carved Inputs**: Deep inset shadows (`--clay-input-shadow`) creating a 3D tactile groove for the real-time search bar and modal form fields.

---

## 🔍 SEO & Social Sharing Engine

ClickZ is fully optimized for top search engine visibility and rich social media previews:

- **Open Graph & Twitter Cards**: High-resolution custom social card previews (`og:image`, `twitter:card`).
- **Structured Data (Schema.org)**: Embedded JSON-LD `WebApplication` & `Person` schemas for Google rich search results.
- **Robots & Sitemap**: Production `robots.txt` and `sitemap.xml` for automated crawler discovery.
- **Semantic HTML5**: Native landmarks (`<main>`, `<header>`, `<section>`, `<footer>`) ensuring high accessibility (a11y) and crawlability.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Build Tool & Server** | [Vite 8](https://vitejs.dev/) |
| **Styling** | Vanilla CSS (Claymorphic Design Tokens & CSS Modules) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Authentication** | Supabase Auth (Google OAuth 2.0) |
| **PWA & Offline** | Web App Manifest & Service Workers |
| **Icons & Logos** | [Iconify API](https://iconify.design/) & Custom SVGs |
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
│   │   ├── auth/            # LoginScreen & Clay Auth Styling
│   │   ├── layout/          # Sticky Header, Theme Toggle, Profile Chip
│   │   ├── links/           # LinkCard, LinkForm Modal, SkeletonList
│   │   └── ui/              # EmptyState, Toast Notifications, SVG Icons
│   ├── lib/
│   │   └── supabase.js      # Supabase Client Initialization
│   ├── utils/
│   │   └── helpers.js       # Auto-Logo Candidate Generator & Helpers
│   ├── App.jsx              # Main Application Orchestrator
│   ├── App.css              # Global Claymorphic Tokens & Layout
│   ├── index.css            # Base Resets & Keyframe Animations
│   └── main.jsx             # React DOM Root Entry
├── eslint.config.js         # ESLint Configuration
├── index.html               # Primary HTML5 Shell & Schema.org JSON-LD
└── package.json             # Project Dependencies & Scripts
```

---

## 🚀 Quick Start (Local Setup)

Follow these steps to run ClickZ locally on your machine:

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
  <sub>Built with ❤️ by Subhajit Bepari. Powered by React 19, Supabase & Claymorphism.</sub>
</div>
