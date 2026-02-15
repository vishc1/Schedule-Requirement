# School Credit Counter

A Next.js 14 application that allows users to upload an image of a school course list or transcript, extract course information using OpenAI Vision API, and calculate total credits based on the Lynbrook High School credit system.

## Features

- 📸 Image upload with drag-and-drop support
- 🤖 OpenAI Vision API integration for text extraction
- 📊 Automatic course and credit parsing
- 📋 Results displayed in a clean table format
- 🧮 Total credits calculation
- 🎨 Modern UI with Tailwind CSS

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

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

3. Add environment variables:
   - In your Vercel project settings, go to "Environment Variables"
   - Add `OPENAI_API_KEY` with your OpenAI API key value

4. Deploy:
   - Vercel will automatically deploy your project
   - Your app will be live at `your-project.vercel.app`

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── process-image/
│   │       └── route.ts          # API route for image processing
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page component
├── components/
│   ├── ImageUpload.tsx            # Image upload component
│   └── ResultsTable.tsx           # Results display component
├── lib/
│   └── creditParser.ts            # Course parsing logic
├── .env.example                   # Environment variables template
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies
├── tailwind.config.ts             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI API** - Vision model for text extraction
- **React** - UI library

## License

MIT

