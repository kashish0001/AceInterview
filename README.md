# AceInterview - AI Interview Preparation Tool

A simple, clean AI-powered interview preparation web application built with Next.js, featuring three specialized agents to help you prepare for interviews.

## Features

### 1. Resume Analyzer Agent
- Analyzes your resume and provides an ATS (Applicant Tracking System) score (0-100)
- Identifies weak sections that need improvement
- Suggests improved bullet points
- Highlights missing information

### 2. Job Description Matcher Agent
- Compares your resume against a job description
- Provides a match score (0-100)
- Shows matched and missing keywords
- Generates an optimized resume summary
- Suggests improved bullet points tailored to the job

### 3. STAR Answer Generator Agent
- Generates structured STAR (Situation, Task, Action, Result) answers
- Optimizes tone based on selected job role
- Prompts for context if needed for better personalization

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Python FastAPI
- **AI**: OpenAI API (GPT-4o-mini)

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd AceInterview
   ```

2. **Set up the Python Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
   
   - Copy `.env.example` to `.env` in the backend folder (or create `.env`):
   ```bash
   # On Windows
   copy .env.example .env
   
   # On Mac/Linux
   cp .env.example .env
   ```
   
   - Open `backend/.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```
   
   - Start the FastAPI backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   
   The backend will run on [http://localhost:8000](http://localhost:8000)

3. **Set up the Frontend** (in a new terminal)
   ```bash
   # From the project root
   npm install
   ```

4. **Run the frontend development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Make sure the backend is running on port 8000

## Project Structure

```
AceInterview/
├── backend/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── resume_agent.py
│   │   ├── jd_matcher_agent.py
│   │   └── star_agent.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ResumeAnalyzer.tsx
│   ├── JDMatcher.tsx
│   └── STARGenerator.tsx
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Usage

### Resume Analyzer
1. Navigate to the "Resume Analyzer" tab
2. Paste your resume text into the textarea
3. Click "Analyze Resume"
4. Review your ATS score, weak sections, suggestions, and missing information

### JD Matcher
1. Navigate to the "JD Matcher" tab
2. Paste your resume text
3. Paste the job description
4. Click "Match Resume to JD"
5. Review the match score, keyword analysis, optimized summary, and improved bullet points

### STAR Generator
1. Navigate to the "STAR Generator" tab
2. (Optional) Enter the job role you're applying for
3. Enter the interview question
4. (Optional) Provide context/notes about your experience
5. Click "Generate STAR Answer"
6. Review the structured STAR response

## Development

### Running the Application

You need to run both the backend and frontend servers:

1. **Backend (Terminal 1)**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

2. **Frontend (Terminal 2)**
   ```bash
   npm run dev
   ```

### Frontend Commands

- **Development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint**: `npm run lint`

### Backend API Endpoints

- `POST /resume-analyzer` - Analyze resume text
- `POST /jd-matcher` - Match resume to job description
- `POST /star-generator` - Generate STAR answer
- `GET /` - Health check endpoint

## Notes

- The app uses GPT-4o-mini by default. You can modify the model in the agent files if needed.
- All API endpoints include error handling and fallback responses.
- The UI is responsive and works on mobile devices.
- The frontend connects to the FastAPI backend running on `http://localhost:8000`.

## License

This project is open source and available for personal use.

Demo Video of Project: https://drive.google.com/file/d/11byUzA4jN8NmVlPYxNFFZTjDJ3WNXR4K/view?usp=sharing

