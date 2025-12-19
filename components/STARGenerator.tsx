'use client'

import { useState } from 'react'

interface STARResult {
  situation?: string
  task?: string
  action?: string
  result?: string
  fullAnswer?: string
  needsContext?: boolean
  message?: string
  error?: string
}

// Helper function to safely render text
const renderText = (value: any): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    // Try to extract meaningful text from object
    if ('text' in value) return String(value.text)
    if ('content' in value) return String(value.content)
    return JSON.stringify(value)
  }
  return String(value)
}

export default function STARGenerator() {
  const [question, setQuestion] = useState('')
  const [userNotes, setUserNotes] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<STARResult | null>(null)
  const [needsContext, setNeedsContext] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!question.trim()) {
      setError('Please enter an interview question')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setNeedsContext(false)

    try {
      const response = await fetch('http://localhost:8000/star-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, notes: userNotes || null, jobRole: jobRole || null }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error || 'Failed to generate STAR answer')
      }

      if (data.needsContext) {
        setNeedsContext(true)
        setResult({
          needsContext: true,
          message: data.message || 'Please provide some context about the situation, task, action, or result to generate a personalized STAR answer.',
        })
      } else {
        // Normalize the data to ensure all fields are strings
        const normalizedData: STARResult = {
          situation: renderText(data.situation),
          task: renderText(data.task),
          action: renderText(data.action),
          result: renderText(data.result),
          fullAnswer: renderText(data.fullAnswer),
        }
        setResult(normalizedData)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the STAR answer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          STAR Answer Generator
        </h2>
        <p className="text-gray-600 mb-6">
          Enter an interview question and your context to generate a structured STAR (Situation, Task, Action, Result) answer.
        </p>

        <div className="space-y-6 mb-6">
          <div>
            <label
              htmlFor="jobRole"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Job Role (Optional)
            </label>
            <input
              id="jobRole"
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Interview Question *
            </label>
            <textarea
              id="question"
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Tell me about a time when you had to deal with a difficult situation..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Notes / Context (Optional)
            </label>
            <textarea
              id="notes"
              rows={6}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Describe the situation, task, actions you took, or results achieved. The more detail you provide, the better the answer will be."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-2 text-sm text-gray-500">
              Tip: Include specific details about the situation, what you did, and measurable results.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Generating...' : 'Generate STAR Answer'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {needsContext && result?.message && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 font-medium mb-2">
              More Context Needed
            </p>
            <p className="text-yellow-700">
              {result.message}
            </p>
          </div>
        )}

        {result && !result.needsContext && (
          <div className="mt-6 space-y-6">
            {/* Full Answer */}
            {result.fullAnswer && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Complete STAR Answer
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">{result.fullAnswer}</p>
              </div>
            )}

            {/* Structured Breakdown */}
            <div className="space-y-4">
              {result.situation && (
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    <span className="text-blue-600">S</span>ituation
                  </h4>
                  <p className="text-gray-700">{result.situation}</p>
                </div>
              )}

              {result.task && (
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    <span className="text-blue-600">T</span>ask
                  </h4>
                  <p className="text-gray-700">{result.task}</p>
                </div>
              )}

              {result.action && (
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    <span className="text-blue-600">A</span>ction
                  </h4>
                  <p className="text-gray-700">{result.action}</p>
                </div>
              )}

              {result.result && (
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    <span className="text-blue-600">R</span>esult
                  </h4>
                  <p className="text-gray-700">{result.result}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
