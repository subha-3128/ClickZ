# ClickZ 🔗

<div align="center">
  <img src="public/pwa-512.png" alt="ClickZ Logo" width="120" />
  
  **A minimal, blazing fast, and secure link management tool.**
  
  [Live Demo](https://click-z.vercel.app/) • [Report Bug](https://github.com/subha-3128/ClickZ/issues) • [Author](https://www.linkedin.com/in/subhajit-bepari/)
</div>

---

## 🌟 Features

- **Secure Authentication**: Passwordless Google OAuth login powered by Supabase.
- **Smart Logos**: Automatically fetches the correct logo for your links using the Iconify API based on URL context.
- **Full CRUD**: Easily add, edit, copy, and safely delete your saved links.
- **PWA Ready**: Installable as a Progressive Web App on mobile and desktop for a native-like experience. Offline-ready via Service Workers.
- **Responsive Design**: Premium "glassmorphism" UI that looks great on mobile, tablet, and desktop.
- **Real-time Search**: Instantly filter through your links without any lag.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS (CSS Modules)
- **Backend & Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Deployment**: Vercel
- **Assets**: Dynamic SVGs via Iconify MDI

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A Supabase Project with Google OAuth configured.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/subha-3128/ClickZ.git
   cd ClickZ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add your Supabase keys:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 👨‍💻 Author

**Subhajit Bepari**
- 💼 LinkedIn: [linkedin.com/in/subhajit-bepari](https://www.linkedin.com/in/subhajit-bepari/)
- 🐙 GitHub: [@subha-3128](https://github.com/subha-3128)
- 🌐 Live App: [click-z.vercel.app](https://click-z.vercel.app/)

---
*Built with ❤️ for better link management.*
