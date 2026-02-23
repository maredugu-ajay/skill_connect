import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// You should set this in your .env file: VITE_OPENROUTER_API_KEY=your_key_here
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const sendMessageToAI = async (messages) => {
    if (!API_KEY) {
        // Return a mock response if no key is provided
        return {
            content: "I'm currently running in demo mode. Please configure the VITE_OPENROUTER_API_KEY environment variable to enable full AI functionality."
        };
    }

    try {
        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model: "openai/gpt-3.5-turbo", // Or any other model supported by OpenRouter
                messages: [
                    {
                        role: "system",
                        content: "You are SkillBot, a helpful assistant for the Skill-Trainer Marketplace. You help learners find trainers and trainers improve their profiles. Be concise and friendly."
                    },
                    ...messages
                ],
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "HTTP-Referer": window.location.origin, // Required by OpenRouter
                    "X-Title": "Skill-Trainer Marketplace", // Optional
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message;
    } catch (error) {
        console.error("AI Chat Error:", error);
        throw new Error("Failed to get response from AI.");
    }
};
