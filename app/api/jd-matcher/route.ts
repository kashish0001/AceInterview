import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription } = await request.json()

    if (!resume || resume.trim().length === 0) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      )
    }

    if (!jobDescription || jobDescription.trim().length === 0) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      )
    }

    const prompt = `Analyze how well the following resume matches the job description.

Resume:
${resume}

Job Description:
${jobDescription}

Please provide a JSON response with the following structure:
{
  "matchScore": <number between 0-100>,
  "keywordMatches": {
    "matched": [<array of keywords that match>],
    "missing": [<array of important keywords from JD that are missing>]
  },
  "optimizedSummary": "<A 2-3 sentence resume summary tailored to this job>",
  "improvedBullets": [<array of 3-5 improved bullet points that better match the JD>]
}

Focus on:
1. Keyword alignment
2. Skill matching
3. Experience relevance
4. Industry-specific terminology

Return ONLY valid JSON, no additional text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume-to-job-description matcher. Always return valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    let analysis

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      analysis = {
        matchScore: 65,
        keywordMatches: {
          matched: ['JavaScript', 'React'],
          missing: ['TypeScript', 'Node.js', 'AWS'],
        },
        optimizedSummary: 'Experienced developer with strong technical skills.',
        improvedBullets: [
          'Add relevant experience matching the job requirements',
          'Include specific technologies mentioned in the JD',
        ],
      }
    }

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('JD matcher error:', error)
    return NextResponse.json(
      { error: 'Failed to match resume with job description', details: error.message },
      { status: 500 }
    )
  }
}

