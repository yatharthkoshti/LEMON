# 🍋 LEMON (લેમન) - Digital Labour Chowk & On-Demand Workforce Platform

> **Modern, mobile-first, visual-driven temporary workforce platform connecting blue-collar workers, family units, and trade teams with construction contractors and job posters across Gujarat and India.**

[![Android Native](https://img.shields.io/badge/Platform-Android%20Native%20%7C%20PWA-3DDC84.svg?logo=android&logoColor=white)](android/)
[![AWS Powered](https://img.shields.io/badge/AWS-S3%20%7C%20SES%20%7C%20ap--south--1-FF9900.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![Vite + React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?logo=react&logoColor=black)](src/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](tailwind.config.js)

---

## 📱 Live Web & Demo

- **Live AWS Cloud URL:** [http://lemon-web-app-1791565982304.s3-website.ap-south-1.amazonaws.com](http://lemon-web-app-1791565982304.s3-website.ap-south-1.amazonaws.com)
- **Dispute Resolution Email:** `lemonabuses@gmail.com`
- **Admin Portal Demo PIN:** `9999` (Accessible from the start screen or Settings)

---

## ✨ Key Features & Architecture

### 1. 🚖 Map-First Discovery (Uber-Style UX)
- Interactive Leaflet map serves as the primary landing page for both Workers and Job Posters.
- Live nearby jobs and available trade workers displayed with dynamic custom pins.
- Smooth draggable bottom-sheet drawer with collapsible snaps (peek, half, expanded) to inspect details without losing map context.

### 2. 👥 Flexible Work Clusters (Low-Typing & Audio-First)
- Workers can register and discover work as:
  - **Individual** (વ્યક્તિગત)
  - **Group** (જૂથ)
  - **Family** (પરિવાર)
  - **Friends** (મિત્રો)
- Button & chip-driven workflow designed for low-literacy tradesmen (Mistri, Karigar, Helper, Tile Worker, Electrician, Plumber, Painter, Loader, Driver).
- Audio job descriptions with in-app voice recorder and playback.

### 3. 💳 Advance Platform Fee & Screenshot Verification (₹20 / Worker)
- **Advance Fee Calculation:** When a contractor/job poster creates a job requiring $N$ workers, an advance platform posting fee of **₹20 × N** is computed (e.g., 5 workers = ₹100).
- **UPI QR Code & Copy Button:** Contractor scans the dynamic UPI QR code or copies UPI ID (`lemonjobs@upi`).
- **Mandatory Payment Screenshot:** Contractor must upload the payment screenshot (transferred securely to AWS S3).
- **Posting Gate:** The "પોસ્ટ કરો (Confirm & Post Job)" button remains locked until the payment screenshot is uploaded and verified locally.
- **Admin Verification:** The job enters `pending_verification` status until approved by the Admin.

### 4. 🛡️ Admin Control Center
Full-featured Admin Dashboard equipped to manage operations:
- **Pending Payments & Job Approvals:** View uploaded payment screenshots, approve payments with one tap, or **Cancel Job / Reject Payment** with a custom reason.
- **Contractor Directory:** Complete list of registered contractors, active postings, total spends, phone numbers with direct click-to-call, and contractor verification toggles.
- **Worker & Trade Teams Directory:** Real-time view of workers, teams, ratings, attendance rates, trade skills, and contact details.
- **Dispute Resolution Desk:** Tracks wage and job dispute tickets with automated email integration to `lemonabuses@gmail.com`.
- **Admin Authentication:** Protected by an Admin PIN dialog (`9999`).

### 5. 🚌 Transportation Clarity
- Every job clearly highlights transportation arrangements:
  - 🟢 **લીલો (Green):** વાહન વ્યવસ્થા સામેલ છે (Transport Provided by Employer)
  - 🔴 **લાલ (Red):** મજૂરે જાતે આવવું (Worker Must Arrange Own Transport)

### 6. 💬 Temporary Group Chat & Contact Access
- When a job's worker quota is filled, an ephemeral group is created.
- Team members and contractor can exchange voice notes, text messages, and access phone numbers directly.

### 7. ☁️ AWS Cloud Integration (1-Day Media Lifecycle)
- **Amazon S3 (`lemon-media-storage-ap-south-1`):** Audio recordings and payment screenshots are uploaded with automatic 1-day expiration lifecycle rules.
- **Amazon SES:** Dispute tickets sent to `lemonabuses@gmail.com`.

---

## 🤖 Android App & Google Play Store Setup

The project is built natively using **Capacitor 7** with an Android Studio project in the [`android/`](android/) directory.

### Prerequisites
1. **Node.js** (v18+) & **npm**
2. **Android Studio Ladybug / Koala** with Android SDK (API 34+ recommended)
3. **Java JDK 17+**

### Step-by-Step Android Build

#### 1. Install Dependencies & Build Web Bundle
```bash
npm install
npm run build
```

#### 2. Sync Web Assets with Android Project
```bash
npx cap sync android
```

#### 3. Open in Android Studio
```bash
npx cap open android
```
*Or open the `android` folder directly in Android Studio.*

#### 4. Run on Device / Emulator
- In Android Studio, select your target Android device or emulator.
- Click **Run (Shift + F10)**.

#### 5. Generate APK or Google Play AAB Bundle
- In Android Studio:
  - Go to **Build > Generate Signed Bundle / APK...**
  - Select **Android App Bundle (.aab)** for Google Play Store, or **APK** for direct sideloading.
  - Create or choose your release keystore.
  - Choose `release` build variant and click **Finish**.
- Command-line build (Debug APK):
  ```bash
  cd android
  ./gradlew assembleDebug
  ```
  The generated APK will be at:
  `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🌐 Web Development & PWA

To run the web app locally:

```bash
# Start local development server
npm run dev

# Run TypeScript check and production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Repository Structure

```
LEMON/
├── android/                        # Native Android Gradle Project (Capacitor)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml # Permissions (Camera, Audio, GPS, Internet)
│   │   │   ├── java/com/lemon/app/ # MainActivity.java
│   │   │   └── res/                # App icons, splash screens, strings
│   │   └── build.gradle
│   ├── build.gradle
│   └── gradlew
├── capacitor.config.ts             # Capacitor configuration (appId: com.lemon.app)
├── src/
│   ├── components/                 # Reusable UI components (BottomSheet, Map, AudioRecorder)
│   ├── data/
│   │   ├── sampleJobs.ts           # Job fixtures with payment fees & statuses
│   │   ├── samplePosters.ts        # Contractor/Employer sample data
│   │   └── sampleWorkers.ts        # Worker profiles & trade groups
│   ├── screens/
│   │   ├── admin/
│   │   │   └── AdminDashboardScreen.tsx # Admin Control Desk (Payment verification, Contractors, Workers)
│   │   ├── poster/
│   │   │   ├── PosterCreateJobScreen.tsx # Job posting with ₹20/worker fee & QR screenshot
│   │   │   ├── PosterMapHomeScreen.tsx   # Poster map discovery
│   │   │   └── ...
│   │   ├── worker/
│   │   │   ├── WorkerMapHome.tsx   # Worker map view & job discovery
│   │   │   └── ...
│   │   ├── RoleSelectionScreen.tsx # First-time role selector (Worker / Poster / Admin)
│   │   └── SettingsScreen.tsx      # Language, preferences, and admin switch
│   ├── services/
│   │   └── awsService.ts           # AWS S3 upload with 1-day retention & SES disputes
│   ├── store/
│   │   └── useAppStore.ts          # Central Zustand state with persistence
│   ├── types/
│   │   └── index.ts                # TypeScript domain models
│   ├── App.tsx                     # Main application router
│   └── main.tsx
├── package.json
└── vite.config.ts
```

---

## 🔐 Environment Variables (Optional)

Configure your `.env` file for custom AWS deployments:

```env
VITE_AWS_REGION=ap-south-1
VITE_AWS_ACCESS_KEY_ID=your_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
VITE_AWS_S3_BUCKET=lemon-media-storage-ap-south-1
VITE_DISPUTE_EMAIL=lemonabuses@gmail.com
```

---

## 📄 License

This project is licensed under the MIT License.
