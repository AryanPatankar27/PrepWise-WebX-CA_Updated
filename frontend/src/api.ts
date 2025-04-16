const CONSOLEGROQ_API_KEY = import.meta.env.VITE_API_KEY;

export async function callConsoleGroqApi(prompt: string, systemMessage: string, temperature = 1) {
  const headers = {
    "Authorization": `Bearer ${CONSOLEGROQ_API_KEY}`,
    "Content-Type": "application/json",
  }
  const payload = {
    "model": "llama-3.3-70b-versatile",
    "temperature": temperature,
    "max_tokens": 2048,
    "messages": [
      {"role": "system", "content": systemMessage},
      {"role": "user", "content": prompt},
    ],
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error calling ConsoleGroq API:", error)
    throw error
  }
}