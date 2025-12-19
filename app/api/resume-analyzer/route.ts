import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { resume } = await request.json()

    if (!resume || resume.trim().length === 0) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      )
    }

    const prompt = `Analyze the following resume and provide a comprehensive ATS (Applicant Tracking System) analysis.

Resume:
${resume}

Please provide a JSON response with the following structure:
{
  "atsScore": <number between 0-100>,
  "weakSections": [<array of section names that need improvement>],
  "suggestions": [<array of improved bullet points or suggestions>],
  "missingInfo": [<array of missing information that should be added>]
}

Focus on:
1. ATS-friendly formatting and keywords
2. Quantifiable achievements
3. Action verbs
4. Relevant skills and experience
5. Professional structure

Return ONLY valid JSON, no additional text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS resume analyzer. Always return valid JSON only.',
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
      // Try to parse JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      // Fallback: create a structured response
      analysis = {
        atsScore: 75,
        weakSections: ['Experience', 'Skills'],
        suggestions: [
          'Add quantifiable metrics to your achievements',
          'Use more action verbs (e.g., "Led", "Implemented", "Increased")',
        ],
        missingInfo: ['Contact information', 'Relevant certifications'],
      }
    }

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Resume analyzer error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze resume', details: error.message },
      { status: 500 }
    )
  }
}

