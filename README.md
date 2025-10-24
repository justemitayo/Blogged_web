# 📝 Blogged — Modern Blogging Platform

**Blogged** is a full-featured blogging platform built with **ReactJS**, designed for seamless content creation, discovery, and community interaction.  
It includes **authentication**, **author profiles**, **likes, comments, tags**, and **infinite blog pagination**, with a responsive and dynamic UI inspired by leading blogging platforms.

---

## 🚀 Features

- 👤 **Full Authentication Flow**
  - Sign up, Sign in, Email Verification, Password Recovery
  - Token-based session persistence

- ✍️ **Author System**
  - Dedicated author pages with followers, following, and post counts  
  - Follow/Unfollow functionality with optimistic UI updates  

- 📰 **Dynamic Blog Feed**
  - Trending, Recommended, and Searchable blog lists  
  - Infinite scroll pagination using React Query  
  - Blog details page with likes, comments, and author info  

- 🏷️ **Tag System**
  - Explore and filter blogs by tags  
  - Tag-specific pages with infinite scrolling  

- 🖼️ **Profile & Media Management**
  - Update profile pictures  
  - Edit or delete posts with confirmation modals  

- ⚡ **Optimized Performance**
  - API-cached queries via TanStack Query  
  - Zustand store for global state management  
  - Seamless navigation and instant UI feedback  

- 🎨 **Responsive Design**
  - Clean, mobile-first layout with modular components  
  - Adaptive for desktop, tablet, and mobile screens  

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | ReactJS |
| State Management | Zustand |
| Data Fetching | TanStack Query (React Query) |
| Routing | React Router DOM |
| API | REST (Axios) |
| Styling | Tailwind CSS |
| Deployment | Netlify |

---

src/
│
├── api/               # Axios API service functions
├── assets/            # Icons, images
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── pages/             # Main app screens (Home, Details, Author, etc.)
├── store/             # Zustand stores (user, cart, like, theme, etc.)
├── utils/             # LocalStorage helpers and utilities
└── App.tsx            # Root application entry
