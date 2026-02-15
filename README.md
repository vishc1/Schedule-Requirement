# Lynbrook Credit Tracker

A Next.js 14 application that helps Lynbrook High School students track their graduation progress by uploading course planning sheets, automatically extracting course information using OpenAI Vision API, and tracking requirements for Lynbrook, UC, and CSU graduation.

**⚠️ Disclaimer:** This is an independent student project and is not officially affiliated with, endorsed by, or created by Lynbrook High School or the Fremont Union High School District. Always verify requirements with your school counselor.

## Features

### 📸 Smart Course Detection
- Image upload with drag-and-drop support
- OpenAI Vision API integration for accurate text extraction
- Automatic course and credit parsing with fuzzy matching
- Support for AP, Honors, and standard courses

### 📊 Requirements Tracking
- **Lynbrook Graduation Requirements** - Track progress toward 220 credits
- **UC A-G Requirements** - Monitor 15 required college-prep courses
- **CSU A-G Requirements** - Ensure eligibility for California State Universities
- Color-coded progress indicators for each requirement category

### 📅 4-Year Course Planner
- Interactive drag-and-drop course assignment
- Plan all four years of high school (9th-12th grade)
- Auto-save to browser storage
- Print-friendly format for sharing with counselors

### ⚠️ Duplicate Detection
- Automatically detects courses assigned multiple times
- Visual warnings with red borders and alerts
- Helps prevent planning errors

### 📈 Credit Summary by Year
- Visual progress bars for each grade level
- Color-coded status (ahead, on track, below average)
- Comparison to expected graduation pace (55 credits/year)
- Overall analysis and recommendations

### 🎨 Modern UI
- Clean, professional interface with Tailwind CSS
- Responsive design for mobile and desktop
- Multiple view options (Overview, Planner, By Category)
- Print-optimized layouts

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd "School Credit Usage Count"
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_actual_api_key_here
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Credit System

The app uses the Lynbrook High School credit system:

- **Semester courses**: 5 credits
- **Full-year courses**: 10 credits
- **Team sports**: 5 credits per season
- **Failed courses**: 0 credits

The parser automatically recognizes common course names and assigns appropriate credit values based on these rules.

## Deployment to Vercel

### Prerequisites
- A [Vercel account](https://vercel.com/signup) (free tier works great!)
- An [OpenAI API key](https://platform.openai.com/api-keys)
- Your project pushed to GitHub, GitLab, or Bitbucket

### Step-by-Step Deployment

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New..." → "Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - Before deploying, click "Environment Variables"
   - Add the following variable:
     - **Name:** `OPENAI_API_KEY`
     - **Value:** Your OpenAI API key (starts with `sk-`)
     - **Environment:** Production, Preview, and Development
   - Click "Add"

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for the build to complete
   - Your app will be live at `your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to your project Settings → Domains
   - Add your custom domain and follow DNS instructions

### Automatic Deployments
- Every push to `main` branch automatically deploys to production
- Pull requests create preview deployments
- No manual deployment needed after initial setup!

### Monitoring
- View deployment logs in Vercel dashboard
- Check API usage in OpenAI dashboard
- Monitor performance with Vercel Analytics (optional)

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── process-image/
│   │       └── route.ts              # API route for image processing
│   ├── globals.css                    # Global styles with animations
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Main page component
├── components/
│   ├── CourseSchedulePrintable.tsx    # Printable course schedule by category
│   ├── FourYearPlanTable.tsx          # Interactive 4-year planner
│   ├── ImageUpload.tsx                # Image upload component
│   ├── RequirementsDisplay.tsx        # Requirements progress display
│   └── ResultsTable.tsx               # Extracted courses table
├── lib/
│   ├── courseNormalizer.ts            # Course name normalization (12-phase)
│   ├── lynbrookCourses.ts             # Official course database
│   └── requirementsTracker.ts         # Lynbrook/UC/CSU requirements
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── next.config.js                     # Next.js configuration
├── package.json                       # Dependencies
├── tailwind.config.ts                 # Tailwind CSS configuration
├── tsconfig.json                      # TypeScript configuration
└── vercel.json                        # Vercel deployment config
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and animations
- **OpenAI API (GPT-4o-mini)** - Vision model for OCR and text extraction
- **React 18** - UI library with hooks
- **localStorage** - Browser-based data persistence

## Troubleshooting

### Common Issues

**Image upload fails:**
- Check that your OpenAI API key is correctly set in environment variables
- Ensure the image is clear and contains course names
- Try a smaller image (<5MB recommended)

**Courses not detected:**
- Make sure course names are legible in the image
- The system uses fuzzy matching - slight variations are okay
- Check that courses follow standard naming (e.g., "AP Calculus BC", "Spanish 2")

**Build fails on Vercel:**
- Verify all dependencies are in `package.json`
- Check that TypeScript has no errors: `npm run build` locally
- Ensure `OPENAI_API_KEY` environment variable is set in Vercel

**localStorage data lost:**
- Browser storage is cleared when you clear browsing data
- Export your plan by printing to PDF for backup
- Data is browser-specific (not synced across devices)

### Getting Help

- Check [Vercel deployment docs](https://vercel.com/docs)
- Review [OpenAI API documentation](https://platform.openai.com/docs)
- Open an issue on GitHub

## Performance & Costs

- **OpenAI API Costs:** ~$0.01-0.02 per image upload (GPT-4o-mini Vision)
- **Vercel Hosting:** Free tier supports ~100GB bandwidth/month
- **Build Time:** ~1-2 minutes
- **Response Time:** ~2-5 seconds per image upload

## Contributing

This is a student project for Lynbrook High School. Contributions, suggestions, and feedback are welcome!

## License

MIT

