// Design system constants

export const AGENT_COLORS = {
  coordinator: "#8b5cf6", // purple
  analyst: "#3b82f6", // blue
  specialist_math: "#10b981", // green
  specialist_text: "#f59e0b", // orange
  super_critic: "#ef4444", // red
  traditional: "#6366f1", // indigo
} as const;

export const AGENT_LABELS = {
  coordinator: "Coordinator",
  analyst: "Analyst",
  specialist_math: "Math Specialist",
  specialist_text: "Text Specialist",
  super_critic: "Super-Critic",
  traditional: "Traditional AI",
} as const;

export type AgentType = keyof typeof AGENT_COLORS;

export const EXAMPLE_TASKS = [
  {
    id: 1,
    title: "Customer Review Analysis",
    description: "Math + Text hybrid analysis",
    prompt: `Analyze these customer reviews and provide insights:

Reviews:
1. "Great product! Very satisfied. Rating: 5/5"
2. "Decent quality but overpriced. Rating: 3/5"
3. "Excellent service and fast delivery! Rating: 5/5"
4. "Not what I expected, disappointed. Rating: 2/5"
5. "Amazing value for money! Rating: 4/5"

Calculate the average rating and analyze overall sentiment trends.`,
  },
  {
    id: 2,
    title: "Complex Reasoning",
    description: "Multi-step logic and calculation",
    prompt: `A company's revenue grew by 15% in Q1, decreased by 8% in Q2, and grew by 22% in Q3. If the starting revenue was $1,000,000, what is the final revenue? Also, summarize the quarterly performance trend.`,
  },
  {
    id: 3,
    title: "Quality Validation",
    description: "Shows super-critic's value",
    prompt: `Write a product description for a smart home thermostat that saves energy. The description should be compelling, accurate, and highlight key benefits.`,
  },
  {
    id: 4,
    title: "Research & Synthesis",
    description: "Requires decomposition",
    prompt: `Explain the key differences between supervised and unsupervised machine learning. Provide 2 real-world examples for each category.`,
  },
];
