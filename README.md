<div align="center">

<!-- Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=E50914&height=200&section=header&text=🎬%20CINEWAVE&fontSize=60&fontColor=FFFFFF&animation=fadeIn&fontAlignY=35&desc=Your%20Ultimate%20Movie%20Streaming%20Platform&descSize=18&descAlignY=55&descColor=E5E5E5" width="100%" />

<!-- Typing Animation -->
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=E50914&center=true&vCenter=true&multiline=true&repeat=true&width=600&height=80&lines=🍿+Stream+Movies+%26+Series;🔐+Authentication+%7C+💳+Payments;👤+Multi-Profile+%7C+🌍+Multi-Language;Built+with+Next.js+14+%2B+MongoDB" alt="Typing SVG" /></a>

<br />

<!-- Badges Row 1 -->
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<!-- Badges Row 2 -->
[![NextAuth](https://img.shields.io/badge/NextAuth.js-4.24-purple?style=for-the-badge&logo=auth0&logoColor=white)](https://next-auth.js.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br />

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

</div>

## 🎯 Overview

**CineWave** is a full-stack Netflix-inspired movie streaming platform built with modern web technologies. Stream movies and series, manage profiles, handle subscriptions, and enjoy a seamless cinematic experience — all in one platform.

<div align="center">

| 🎬 Feature | ✅ Status |
|:---|:---:|
| Movie & Series Catalog | ✅ |
| User Authentication (Email, Google, Phone) | ✅ |
| Multi-Profile Support (up to 5) | ✅ |
| Subscription & Payment (SSLCommerz) | ✅ |
| Admin Dashboard & Analytics | ✅ |
| YouTube Video Integration | ✅ |
| Real-time Search | ✅ |
| Watchlist (My List) | ✅ |
| Responsive Design | ✅ |
| Multi-Language Support | ✅ |

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎬 Content & Streaming
- Browse movies & series with infinite scroll
- Genre/category filtering
- Hero banner with featured content
- YouTube & direct video playback
- Episode management for series
- "More Like This" recommendations

</td>
<td width="50%">

### 🔐 Authentication & Profiles
- Email/Password registration & login
- Google OAuth sign-in
- Firebase phone OTP verification
- Email verification & password reset
- Up to 5 user profiles per account
- Custom avatars for each profile

</td>
</tr>
<tr>
<td width="50%">

### 💳 Subscription & Payments
- Multiple subscription plans (Basic / Standard / Premium)
- SSLCommerz payment gateway integration
- Free trial for new users
- Payment history tracking
- Automatic subscription management

</td>
<td width="50%">

### 🛡️ Admin Dashboard
- Content management (CRUD)
- User management & analytics
- Subscription monitoring
- Upload form with YouTube support
- Episode manager for series content
- Revenue & engagement analytics

</td>
</tr>
</table>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## 🛠️ Tech Stack

<div align="center">

```
┌─────────────────────────────────────────────────┐
│                   CINEWAVE                       │
├─────────────────────────────────────────────────┤
│  Frontend      │  Next.js 14 (App Router)       │
│                │  React 18 + Tailwind CSS 3.4   │
│                │  Framer Motion + Zustand        │
│                │  React Hook Form + Zod          │
├────────────────┼────────────────────────────────┤
│  Backend       │  Next.js API Routes            │
│                │  NextAuth.js 4 (Auth)          │
│                │  Mongoose 9 (ODM)              │
│                │  Nodemailer (Email)            │
├────────────────┼────────────────────────────────┤
│  Database      │  MongoDB Atlas (Cloud)         │
├────────────────┼────────────────────────────────┤
│  Storage       │  Cloudinary (Images/Videos)    │
│                │  YouTube (Video Streaming)     │
├────────────────┼────────────────────────────────┤
│  Auth          │  Google OAuth 2.0              │
│                │  Firebase Phone Auth           │
│                │  Email/Password (bcrypt)       │
├────────────────┼────────────────────────────────┤
│  Payment       │  SSLCommerz Gateway            │
├────────────────┼────────────────────────────────┤
│  Deployment    │  Vercel                        │
└────────────────┴────────────────────────────────┘
```

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## 📁 Project Structure

```
cinewave/
├── app/
│   ├── (auth)/          # Auth pages (login, register, forgot-password)
│   ├── (main)/          # Main app (home, browse, movies, series, watch)
│   ├── admin/           # Admin dashboard (content, users, analytics)
│   ├── api/             # API routes (auth, content, payment, upload)
│   └── fonts/           # Custom fonts
├── components/
│   ├── admin/           # Admin panel components
│   ├── auth/            # Auth forms & social buttons
│   ├── content/         # Content cards, banners, video player
│   ├── layout/          # Navbar, Footer, Sidebar
│   ├── profile/         # Profile management
│   ├── search/          # Search components
│   ├── subscription/    # Plan cards & payment
│   └── ui/              # Shared UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities (auth, db, cloudinary, email)
├── models/              # Mongoose models
├── public/              # Static assets
├── scripts/             # Seed & utility scripts
└── store/               # Zustand state stores
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **MongoDB Atlas** account (free M0 cluster)
- **Cloudinary** account (free tier)
- **Google Cloud** project (for OAuth)
- **Firebase** project (for phone auth)

### Installation

```bash
# Clone the repository
git clone https://github.com/md-asif-iqbal/CINEWAVE-Movie-Platform-.git
cd CINEWAVE-Movie-Platform-/cinewave

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## ⚙️ Environment Variables

Create a `.env.local` file from the example and configure:

| Variable | Description | Required |
|:---|:---|:---:|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000` for dev) | ✅ |
| `NEXTAUTH_SECRET` | Random secret (`openssl rand -base64 32`) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public Cloudinary cloud name | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset | ✅ |
| `TMDB_API_KEY` | TMDB API key (for seeding only) | ⚡ |
| `SSLCOMMERZ_STORE_ID` | SSLCommerz store ID | ✅ |
| `SSLCOMMERZ_STORE_PASSWORD` | SSLCommerz store password | ✅ |
| `SSLCOMMERZ_IS_LIVE` | `false` for sandbox, `true` for prod | ✅ |
| `EMAIL_HOST` | SMTP host (`smtp.gmail.com`) | ✅ |
| `EMAIL_PORT` | SMTP port (`587`) | ✅ |
| `EMAIL_USER` | Email address for sending | ✅ |
| `EMAIL_PASS` | Email app password | ✅ |
| `EMAIL_FROM` | From address display | ✅ |
| `NEXT_PUBLIC_APP_URL` | Public app URL | ✅ |

> ⚡ = Only required for database seeding scripts

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## 🌐 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
3. Set **Root Directory** to `cinewave`
4. Add all environment variables from the table above in **Settings → Environment Variables**
5. Change `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel domain (e.g., `https://cinewave.vercel.app`)
6. Add your Vercel URL to Google OAuth authorized redirect URIs
7. Click **Deploy**

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## 📜 Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with TMDB content |
| `npm run seed:force` | Force re-seed (overwrites existing) |
| `npm run seed:clear` | Clear all database collections |
| `npm run seed:users` | Seed sample users |
| `npm run seed:tehran` | Seed Tehran series with YouTube |

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## 🧑‍💻 Author

<div align="center">

**Asif Iqbal**

[![GitHub](https://img.shields.io/badge/GitHub-md--asif--iqbal-181717?style=for-the-badge&logo=github)](https://github.com/md-asif-iqbal)

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

<div align="center">

### ⭐ Star this repo if you find it useful!

<br />

![Visitor Count](https://komarev.com/ghpvc/?username=md-asif-iqbal&repo=CINEWAVE-Movie-Platform-&color=E50914&style=for-the-badge&label=VISITORS)

</div>

<!-- Animated Footer -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=E50914&height=120&section=footer" width="100%" />

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
