'use client'

import { useState } from 'react'
import ResumeAnalyzer from '@/components/ResumeAnalyzer'
import JDMatcher from '@/components/JDMatcher'
import STARGenerator from '@/components/STARGenerator'

type Tab = 'resume' | 'jd' | 'star'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('resume')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">AceInterview</h1>
            <p className="text-sm text-gray-600">AI-Powered Interview Preparation</p>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('resume')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resume'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resume Analyzer
            </button>
            <button
              onClick={() => setActiveTab('jd')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jd'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              JD Matcher
            </button>
            <button
              onClick={() => setActiveTab('star')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'star'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              STAR Generator
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'resume' && <ResumeAnalyzer />}
          {activeTab === 'jd' && <JDMatcher />}
          {activeTab === 'star' && <STARGenerator />}
        </div>
      </div>
    </div>
  )
}

