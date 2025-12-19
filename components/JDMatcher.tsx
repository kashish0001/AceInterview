'use client'

import { useState } from 'react'

interface BulletItem {
  section?: string
  bulletPoint?: string
  [key: string]: any
}

interface MatchResult {
  matchScore?: number
  keywordMatches?: {
    matched?: (string | BulletItem)[]
    missing?: (string | BulletItem)[]
  }
  optimizedSummary?: string
  improvedBullets?: (string | BulletItem)[]
  error?: string
}

// Helper function to safely render a value
const renderValue = (value: string | BulletItem | undefined | null): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    if ('bulletPoint' in value && value.bulletPoint) {
      return String(value.bulletPoint)
    }
    if ('section' in value && value.section) {
      return String(value.section)
    }
    const keys = Object.keys(value)
    if (keys.length > 0) {
      return String(value[keys[0]])
    }
  }
  return String(value)
}

// Helper function to normalize array items
const normalizeArray = (arr: any[] | undefined | null): (string | BulletItem)[] => {
  if (!Array.isArray(arr)) return []
  return arr.map(item => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null) return item as BulletItem
    return String(item)
  })
}

export default function JDMatcher() {
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleMatch = async () => {
    if (!resume.trim()) {
      setError('Please enter your resume text')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please enter the job description')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('http://localhost:8000/jd-matcher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume, jd: jobDescription }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error || 'Failed to match resume with job description')
      }

      // Normalize the data
      const normalizedData: MatchResult = {
        matchScore: typeof data.matchScore === 'number' ? data.matchScore : undefined,
        keywordMatches: {
          matched: normalizeArray(data.keywordMatches?.matched),
          missing: normalizeArray(data.keywordMatches?.missing),
        },
        optimizedSummary: typeof data.optimizedSummary === 'string' ? data.optimizedSummary : undefined,
        improvedBullets: normalizeArray(data.improvedBullets),
      }

      setResult(normalizedData)
    } catch (err: any) {
      setError(err.message || 'An error occurred while matching the resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Job Description Matcher
        </h2>
        <p className="text-gray-600 mb-6">
          Paste your resume and job description to see how well they match and get optimized suggestions.
        </p>

        <div className="space-y-6 mb-6">
          <div>
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Resume Text
            </label>
            <textarea
              id="resume"
              rows={8}
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="jd"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Job Description
            </label>
            <textarea
              id="jd"
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleMatch}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Analyzing Match...' : 'Match Resume to JD'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-6">
            {/* Match Score */}
            {typeof result.matchScore === 'number' && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Match Score
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {result.matchScore}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, result.matchScore))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Keyword Matches */}
            {result.keywordMatches && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.keywordMatches.matched && result.keywordMatches.matched.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Matched Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.keywordMatches.matched.map((keyword, idx) => {
                        const keywordText = renderValue(keyword)
                        if (!keywordText) return null
                        return (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                          >
                            {keywordText}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {result.keywordMatches.missing && result.keywordMatches.missing.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.keywordMatches.missing.map((keyword, idx) => {
                        const keywordText = renderValue(keyword)
                        if (!keywordText) return null
                        return (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm"
                          >
                            {keywordText}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Optimized Summary */}
            {result.optimizedSummary && (
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Optimized Resume Summary
                </h3>
                <p className="text-gray-700">{result.optimizedSummary}</p>
              </div>
            )}

            {/* Improved Bullets */}
            {result.improvedBullets && result.improvedBullets.length > 0 && (
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Improved Bullet Points
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {result.improvedBullets.map((bullet, idx) => {
                    const bulletText = renderValue(bullet)
                    if (!bulletText) return null
                    // If it's an object with both section and bulletPoint, render both
                    if (typeof bullet === 'object' && bullet !== null && 'section' in bullet && 'bulletPoint' in bullet) {
                      return (
                        <li key={idx} className="text-gray-700">
                          <span className="font-medium">{bullet.section}:</span> {bullet.bulletPoint}
                        </li>
                      )
                    }
                    return (
                      <li key={idx} className="text-gray-700">
                        {bulletText}
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
