# 👕 RJ Garment — Rajesh Garments

A brutalist clothing brand storefront for **Rajesh Garments**, a men's & kids' clothing store in Sant Nagar, Delhi. Built as a digital lookbook and catalog.

**[Live Site](https://rjgarment.vercel.app)**

---

## ✨ Features

### For Visitors
- **Homepage** — WebGL ferrofluid hero animation, magnetic hover effects, latest arrivals grid, store location with Google Maps
- **Collections** — Browse all products, filter by season (Spring / Summer / Fall / Winter), click for full-screen detail views
- **Saved Items** — Heart/bookmark products (stored in your browser via localStorage)
- **Contact** — Phone, WhatsApp, Facebook, Instagram links

### For the Store Owner (Admin)

The **password-protected admin panel** at `/admin` lets you:

| Action | How |
|---|---|
| **Upload** images & videos | Drag-and-drop or click to browse (max 50MB each) |
| **Edit product details** | Inline name, price (₹), and season category |
| **Delete products** | Individual or bulk delete with confirmation |
| **Preview media** | Click any item for a full-screen preview |

All media is hosted on **Cloudinary** — no database to manage.

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| **Next.js 16** + **React 19** | Framework |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling (brutalist design) |
| **Framer Motion** + **GSAP** | Animations |
| **OGL (WebGL)** | Ferrofluid shader effect |
| **Cloudinary** | Image/video hosting & management |
| **Lucide** | Icons |
| **Vercel** | Hosting & analytics |

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSWORD=your_admin_password
```

---

## 📁 Project Structure

```
src/
├── app/             # Pages & API routes
│   ├── admin/       # Password-protected admin panel
│   ├── collections/ # Season-filtered product archive
│   ├── contact/     # Contact info page
│   ├── saved/       # Locally saved/bookmarked items
│   └── api/         # API routes (public & admin)
├── components/
│   ├── admin/       # Upload zone, media grid, media card
│   ├── collections/ # Collection cards & detail modals
│   ├── layout/      # NavBar, footer, LayoutProvider
│   ├── sections/    # Hero, arrivals, statement, gallery
│   └── ui/          # Ferrofluid, tilt card, marquee, etc.
├── context/         # SavedItemsContext (localStorage)
├── lib/             # Cloudinary SDK, helpers, utils
└── types/           # TypeScript type definitions
```

---

## 🔐 Admin Access

1. Go to `/admin`
2. Enter the password (set via `ADMIN_PASSWORD` env var)
3. Upload, edit, or delete products — changes reflect immediately on the live site

---

Built for a local customer. Need something similar? [Let's talk](mailto:himanshujha1218@gmail.com).
