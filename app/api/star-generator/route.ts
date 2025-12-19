import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { question, userNotes, jobRole } = await request.json()

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Interview question is required' },
        { status: 400 }
      )
    }

    // If no user notes provided, ask for context
    if (!userNotes || userNotes.trim().length === 0) {
      return NextResponse.json(
        {
          needsContext: true,
          message: 'Please provide some context about the situation, task, action, or result to generate a personalized STAR answer.',
        },
        { status: 200 }
      )
    }

    const roleContext = jobRole
      ? `The candidate is applying for a ${jobRole} role.`
      : ''

    const prompt = `Generate a structured STAR (Situation, Task, Action, Result) answer for the following interview question.

Interview Question:
${question}

User Context/Notes:
${userNotes}

${roleContext}

Please provide a JSON response with the following structure:
{
  "situation": "<Clear description of the situation/context>",
  "task": "<The task or challenge you faced>",
  "action": "<Specific actions you took to address the task>",
  "result": "<Quantifiable results and outcomes achieved>",
  "fullAnswer": "<A polished, complete STAR answer combining all elements>"
}

Make the answer:
- Professional and concise
- Quantifiable where possible
- Relevant to the question
- Tailored to the job role if provided

Return ONLY valid JSON, no additional text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview coach specializing in STAR method answers. Always return valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    let starAnswer

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        starAnswer = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      starAnswer = {
        situation: 'Based on your notes, describe the situation.',
        task: 'Based on your notes, describe the task.',
        action: 'Based on your notes, describe the actions taken.',
        result: 'Based on your notes, describe the results achieved.',
        fullAnswer: 'Please provide more specific context to generate a better answer.',
      }
    }

    return NextResponse.json(starAnswer)
  } catch (error: any) {
    console.error('STAR generator error:', error)
    return NextResponse.json(
      { error: 'Failed to generate STAR answer', details: error.message },
      { status: 500 }
    )
  }
}

