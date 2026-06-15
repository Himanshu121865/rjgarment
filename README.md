# 👕 RJ Garment — Rajesh Garments

A brutalist clothing brand storefront for **Rajesh Garments**, a men's & kids' clothing store in Sant Nagar, Delhi. Built as a digital lookbook and catalog.

## ![Project Logo](public/Uploads/homepage.png)

## ✨ Features

### For Visitors

- **Collections** — Browse all products, filter by season (Spring / Summer / Fall / Winter), click for full-screen detail views
- **Saved Items** — Heart/bookmark products (stored in your browser via localStorage)
- **Contact** — Phone, WhatsApp, Facebook, Instagram links

### For the Store Owner (Admin)

The **password-protected admin panel** at `/admin` lets you:

| Action                     | How                                              |
| -------------------------- | ------------------------------------------------ |
| **Upload** images & videos | Drag-and-drop or click to browse (max 50MB each) |
| **Edit product details**   | Inline name, price (₹), and season category      |
| **Delete products**        | Individual or bulk delete with confirmation      |
| **Preview media**          | Click any item for a full-screen preview         |

All media is hosted on **Cloudinary** — no database to manage.

---

## 🛠 Tech Stack

| Tool                          | Purpose                          |
| ----------------------------- | -------------------------------- |
| **Next.js 16** + **React 19** | Framework                        |
| **TypeScript**                | Type safety                      |
| **Tailwind CSS v4**           | Styling (brutalist design)       |
| **Cloudinary**                | Image/video hosting & management |
| **Lucide**                    | Icons                            |
| **Vercel**                    | Hosting & analytics              |

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

---

## 🔐 Admin Access

1. Go to `/admin`
2. Enter the password (set via `ADMIN_PASSWORD` env var)
3. Upload, edit, or delete products — changes reflect immediately on the live site

---

Built for a local customer. Need something similar? [Let's talk](mailto:himanshujha1218@gmail.com).
