'use client'

import { useState } from 'react'

interface SuggestionItem {
  section?: string
  bulletPoint?: string
  [key: string]: any
}

interface AnalysisResult {
  atsScore?: number
  weakSections?: (string | SuggestionItem)[]
  suggestions?: (string | SuggestionItem)[]
  missingInfo?: (string | SuggestionItem)[]
  error?: string
}

// Helper function to safely render a value (string, object, or array)
const renderValue = (value: string | SuggestionItem | undefined | null): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    // Handle object with section and bulletPoint
    if ('bulletPoint' in value && value.bulletPoint) {
      return String(value.bulletPoint)
    }
    if ('section' in value && value.section) {
      return String(value.section)
    }
    // Fallback: try to stringify or get first property
    const keys = Object.keys(value)
    if (keys.length > 0) {
      return String(value[keys[0]])
    }
  }
  return String(value)
}

// Helper function to normalize array items
const normalizeArray = (arr: any[] | undefined | null): (string | SuggestionItem)[] => {
  if (!Array.isArray(arr)) return []
  return arr.map(item => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null) return item as SuggestionItem
    return String(item)
  })
}

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!resume.trim()) {
      setError('Please enter or paste your resume text')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('http://localhost:8000/resume-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: resume }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error || 'Failed to analyze resume')
      }

      // Normalize the data to handle various response formats
      const normalizedData: AnalysisResult = {
        atsScore: typeof data.atsScore === 'number' ? data.atsScore : undefined,
        weakSections: normalizeArray(data.weakSections),
        suggestions: normalizeArray(data.suggestions),
        missingInfo: normalizeArray(data.missingInfo),
      }

      setResult(normalizedData)
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Resume Analyzer
        </h2>
        <p className="text-gray-600 mb-6">
          Upload or paste your resume text to get an ATS score and improvement suggestions.
        </p>

        <div className="mb-6">
          <label
            htmlFor="resume"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Resume Text
          </label>
          <textarea
            id="resume"
            rows={12}
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume text here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-6">
            {/* ATS Score */}
            {typeof result.atsScore === 'number' && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ATS Score
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {result.atsScore}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, result.atsScore))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weak Sections */}
            {result.weakSections && result.weakSections.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Weak Sections
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.weakSections.map((section, idx) => {
                    const sectionText = renderValue(section)
                    if (!sectionText) return null
                    return (
                      <li key={idx} className="text-gray-700">
                        {sectionText}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Improvement Suggestions
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {result.suggestions.map((suggestion, idx) => {
                    const suggestionText = renderValue(suggestion)
                    if (!suggestionText) return null
                    // If it's an object with both section and bulletPoint, render both
                    if (typeof suggestion === 'object' && suggestion !== null && 'section' in suggestion && 'bulletPoint' in suggestion) {
                      return (
                        <li key={idx} className="text-gray-700">
                          <span className="font-medium">{suggestion.section}:</span> {suggestion.bulletPoint}
                        </li>
                      )
                    }
                    return (
                      <li key={idx} className="text-gray-700">
                        {suggestionText}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Missing Info */}
            {result.missingInfo && result.missingInfo.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Missing Information
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.missingInfo.map((info, idx) => {
                    const infoText = renderValue(info)
                    if (!infoText) return null
                    return (
                      <li key={idx} className="text-gray-700">
                        {infoText}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
