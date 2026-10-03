# 🎓 EventHive — Swaminarayan University Event Gateway

EventHive is a modern, responsive campus event gateway and ticketing portal built for Swaminarayan University. It empowers students, faculty, and guests to explore upcoming university symposiums, hackathons, sports tournaments, and cultural galas, complete with customizable QR entry passes, wishlist management, and role-based authentication.

---

## 🌟 Key Features

- 🌓 **Instant Dark & Light Theme**: Toggle dynamically between themes across the entire portal.
- 🎟️ **Downloadable Event Pass (Thanganat-5 & All Events)**: High-resolution branded entry pass with student credentials, dynamic barcode, and high-contrast QR code generated directly to PNG.
- 🔐 **Authentication & Registration**: Real role-based sign-in (Student, Faculty, Admin, Guest) and custom Sign-Up with persistent `localStorage` storage.
- 🔔 **Interactive Notification Dropdown**: Dismisses automatically on mouse leave with unread counters.
- 💖 **Wishlist Manager**: Save favorite events with persistent bookmarks.
- 📱 **100% Mobile Responsive**: Glassmorphism navbar with backdrop blur and fluid mobile drawer.

---

## 📂 Project Structure

```
├── index.html              # HTML5 entry with EventHive branding
├── package.json            # Scripts & dependencies (React 19, Tailwind, Lucide)
├── vite.config.ts          # Vite configuration with Tailwind CSS plugin
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # SPA routing rewrite rule for Vercel
├── .gitignore              # Files excluded from Git commits
├── README.md               # Project documentation & hosting guide
└── src/
    ├── main.tsx            # React application entry point
    ├── App.tsx             # Root component, state management & theme provider
    ├── index.css           # Tailwind CSS imports & custom styles
    ├── components/         # Reusable modular components
    │   ├── Navbar.tsx      # Responsive header with blur & notification drawer
    │   ├── Footer.tsx      # Campus directory & social links
    │   ├── PassClaimModal.tsx # Pass reservation dialog
    │   ├── FeedbackModal.tsx  # User feedback collection dialog
    │   └── SettingsModal.tsx  # User preferences modal
    ├── views/              # View pages
    │   ├── HomeView.tsx    # Hero section & featured campus gatherings
    │   ├── ExploreView.tsx # Event directory with live search & filters
    │   ├── EventDetailsView.tsx # Detailed agenda & venue information
    │   ├── MyPassesView.tsx   # Digital pass wallet & PNG download
    │   ├── ProfileView.tsx # Student ID card & profile manager
    │   ├── LoginView.tsx   # Sign-in & Sign-up authentication form
    │   └── WishlistView.tsx # Saved bookmarks & direct pass claiming
    ├── data/
    │   └── eventsData.ts   # Campus events catalog & default student profiles
    └── utils/
        └── passGenerator.ts # Canvas ticket generator with QR & PNG export
```

---

## 🚀 Steps to Push to GitHub & Host on Vercel 

Aapne apna GitHub repo pehle se bana rakha hai. Ab is project ko apne GitHub repository me push karke **Vercel** par free me live host karne ke liye niche diye gaye steps follow karein:

### Step 1: Apne Computer par Project Files Ready Karein
1. Saari project files ko ek single folder me rakhein (jaise `eventhive`).
2. Confirm karein ki `package.json`, `index.html`, aur `src` folder is main folder ke andar directly maujood hain.

### Step 2: GitHub Repository me Code Push Karein (Terminal / Git Bash)
Apne terminal ya Command Prompt me project folder open karein aur yeh commands run karein:

```bash
# 1. Git repository initialize karein (agar pehle se nahi hai)
git init

# 2. Saari files ko staging area me add karein
git add .

# 3. First commit create karein
git commit -m "feat: complete EventHive university event portal"

# 4. Main branch set karein
git branch -M main

# 5. Apne GitHub repository ka remote link add karein
# (NOTE: <YOUR_GITHUB_REPO_URL> ki jagah apna actual repo link dalein, jaise https://github.com/username/eventhive.git)
git remote add origin <YOUR_GITHUB_REPO_URL>

# 6. Code ko GitHub par push karein
git push -u origin main
```

*(Agar GitHub pehle se initialized hai aur remote set hai, toh bas `git add .`, `git commit -m "update"` aur `git push` karein.)*

---

### Step 3: Vercel Par 1-Click Me Live Host Karein

1. **Vercel Website Open Karein**: [vercel.com](https://vercel.com) par jayein aur **"Sign Up"** ya **"Log In"** karein (apne GitHub account se login karein).
2. **Dashboard par "Add New" par click karein**:
   - Upar right corner me **"Add New..."** button dabayein aur **"Project"** select karein.
3. **Apna GitHub Repo Select Karein**:
   - List me se apna EventHive wala repository dhoondhein aur **"Import"** button par click karein.
4. **Project Settings Check Karein (Automatic)**:
   - **Framework Preset**: Vercel automatically **Vite** detect kar lega.
   - **Root Directory**: `./` (Default root hi rehne dein).
   - **Build Command**: `npm run build` (Default).
   - **Output Directory**: `dist` (Default).
5. **"Deploy" Button Dabayein**:
   - Vercel 30–60 seconds me aapka code build karke deploy kar dega.
6. 🎉 **Congratulations!**
   - Aapko ek custom live production link mil jayega (jaise `https://eventhive-portal.vercel.app`), jise aap kisi ke sath bhi share kar sakte hain!

---

### Step 4: Future Updates Kaise Deploy Honge?

Jab bhi aap local code me koi change karenge, aapko Vercel par baar-baar upload karne ki zaroorat nahi hai. Bas terminal me yeh 3 commands run karein:

```bash
git add .
git commit -m "feat: your new update"
git push
```

Vercel automatically nayi commit ko detect karega aur 1 minute ke andar aapki live website ko update kar dega!

---

## 💻 Local Development (Apne Laptop par kaise chalayein)

Agar aapko is project ko locally apne computer par run karna ho:

```bash
# 1. Dependencies install karein
npm install

# 2. Local dev server start karein
npm run dev
```

Browser me `http://localhost:3000` open karein. Production build test karne ke liye:

```bash
npm run build
npm run preview
```

---

## 🏢 Credits & Organization

- **Owner & Developer**: **RenderX Limited**
- **Architecture & Engineering**: Designed and maintained by **RenderX Limited**
- **License**: © 2025 RenderX Limited. All rights reserved.

