const buildHeuristicAnalysis = (text) => {
  const lowerText = text.toLowerCase()
  let priority = 'Low'
  let department = 'General'

  const highTriggers = [
    'fire',
    'electric',
    'gas',
    'accident',
    'short circuit',
    'injury',
    'fallen',
    'emergency',
  ]
  const mediumTriggers = ['water', 'leak', 'sewage', 'pipeline', 'road', 'pothole']

  if (highTriggers.some((word) => lowerText.includes(word))) {
    priority = 'High'
  } else if (mediumTriggers.some((word) => lowerText.includes(word))) {
    priority = 'Medium'
  }

  if (lowerText.includes('water') || lowerText.includes('pipeline')) {
    department = 'Water Supply'
  } else if (lowerText.includes('electric')) {
    department = 'Electricity'
  } else if (lowerText.includes('garbage') || lowerText.includes('sanitation')) {
    department = 'Sanitation'
  } else if (lowerText.includes('road') || lowerText.includes('pothole')) {
    department = 'Public Works'
  } else if (lowerText.includes('health') || lowerText.includes('hospital')) {
    department = 'Health Services'
  } else if (lowerText.includes('crime') || lowerText.includes('safety')) {
    department = 'Public Safety'
  }

  const summary = text.length > 160 ? `${text.slice(0, 157)}...` : text

  return {
    priority,
    department,
    response: `Thanks for reporting. We have logged your complaint and routed it to the ${department} team.`,
    summary,
    adminAdvice: 'Assign a field team, verify the location, and provide an ETA update to the complainant.',
    immediateActions:
      'Verify location, shut off risk sources if any, and capture photos for evidence.',
    escalation:
      'Escalate to regional supervisor if hazard expands or multiple reports occur.',
    etaSuggestion: 'Initial inspection within 4-6 hours; resolution within 24-48 hours.',
  }
}

const buildHeuristicAdvice = (text) => {
  const lowerText = text.toLowerCase()
  let category = 'General'

  if (lowerText.includes('water') || lowerText.includes('pipeline')) {
    category = 'Water Supply'
  } else if (lowerText.includes('sewage') || lowerText.includes('sanitation')) {
    category = 'Sanitation'
  } else if (lowerText.includes('electric') || lowerText.includes('short circuit')) {
    category = 'Electricity'
  } else if (lowerText.includes('road') || lowerText.includes('pothole')) {
    category = 'Public Works'
  }

  return (
    'I understand this is stressful. Take a deep breath; we will handle it step-by-step. ' +
    `First, register your complaint under the "${category}" category in the complaint form. ` +
    'Add exact location details, landmarks, and a short description of the issue. ' +
    'To tackle it quickly, include how long the issue has existed, any safety risk, and who is affected. ' +
    'If it is urgent (leak spreading, safety risk), mention that clearly in the description. ' +
    'After submitting, track your complaint status on the dashboard and keep any photos ready if asked.'
  )
}

const analyzeWithAI = async (payload) => {
  const apiKey = process.env.AI_API_KEY
  const baseUrl = process.env.AI_BASE_URL || 'https://api.mistral.ai'
  const model = process.env.AI_MODEL || 'mistral-large-latest'
  const fallbackText = payload.fallbackText || payload.prompt

  if (!apiKey) {
    return { data: buildHeuristicAnalysis(fallbackText) }
  }

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a complaint triage assistant. Respond with ONLY valid JSON containing priority, department, response, summary, adminAdvice, immediateActions, escalation, etaSuggestion. Priority must be High, Medium, or Low. If there is safety risk, accident, injury, or infrastructure danger, use High. Summary should be 15-25 words, plain sentence, no labels. Response should be 2-3 sentences with actionable next steps for the complainant, not generic. Admin advice should be 1-2 sentences on how to tackle the issue. Immediate actions should be 1 sentence. Escalation should be 1 sentence. ETA suggestion should be 1 sentence.',
        },
        {
          role: 'user',
          content: payload.prompt,
        },
      ],
      temperature: 0.2,
    }),
  })

  if (!response.ok) {
    const fallback = buildHeuristicAnalysis(fallbackText)
    return { data: fallback }
  }

  const result = await response.json()
  const message = result?.choices?.[0]?.message?.content || ''

  try {
    const parsed = JSON.parse(message)
    return { data: parsed }
  } catch (error) {
    return { data: buildHeuristicAnalysis(fallbackText) }
  }
}

const assistUser = async ({ prompt }) => {
  const apiKey = process.env.AI_API_KEY
  const baseUrl = process.env.AI_BASE_URL || 'https://api.mistral.ai'
  const model = process.env.AI_MODEL || 'mistral-large-latest'

  if (!apiKey) {
    return buildHeuristicAdvice(prompt)
  }

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a calm citizen helpdesk assistant. Start by reassuring the user briefly, then give clear steps that reference using the complaint form and the correct category (Water Supply, Sanitation, Electricity, Public Works, Health Services, Public Safety). Explicitly state what to do first and how to tackle the complaint efficiently. Keep it 4-6 sentences, no JSON, no lists.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    return buildHeuristicAdvice(prompt)
  }

  const result = await response.json()
  const message = result?.choices?.[0]?.message?.content || ''
  return message.trim() || buildHeuristicAdvice(prompt)
}

const analyzeComplaint = async ({ title, description, category, location }) => {
  const prompt = `Title: ${title}\nCategory: ${category}\nLocation: ${location}\nDescription: ${description}\nReturn JSON with priority, department, response, summary, adminAdvice, immediateActions, escalation, etaSuggestion.`
  const fallbackText = `Title: ${title}. Category: ${category}. Location: ${location}. Description: ${description}.`

  const result = await analyzeWithAI({ prompt, fallbackText })

  return {
    priority: result.data.priority || 'Medium',
    department: result.data.department || 'General',
    response: result.data.response || 'We have received your complaint.',
    summary: result.data.summary || description,
    adminAdvice:
      result.data.adminAdvice ||
      'Assign a field team, verify the location, and provide an ETA update to the complainant.',
    immediateActions:
      result.data.immediateActions ||
      'Verify location, shut off risk sources if any, and capture photos for evidence.',
    escalation:
      result.data.escalation ||
      'Escalate to regional supervisor if hazard expands or multiple reports occur.',
    etaSuggestion:
      result.data.etaSuggestion ||
      'Initial inspection within 4-6 hours; resolution within 24-48 hours.',
  }
}

module.exports = { analyzeComplaint, assistUser }
