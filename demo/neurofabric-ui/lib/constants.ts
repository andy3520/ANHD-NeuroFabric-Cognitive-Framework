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
    title: "Simple Analysis",
    description: "5 reviews - baseline comparison",
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
    title: "Medium-Scale Analysis 📊",
    description: "50 reviews - shows token efficiency",
    prompt: `Analyze 50 customer reviews for a comprehensive business report:

Provide:
- Statistical breakdown of ratings (distribution, mean, median, variance)
- Sentiment analysis with positive/negative/neutral percentages
- Top 5 recurring themes or topics mentioned
- Key strengths and weaknesses identified
- Customer satisfaction trend (improving/declining/stable)
- Actionable recommendations for improvement

This requires processing substantial data and synthesizing insights.`,
  },
  {
    id: 3,
    title: "Large-Scale Deep Analysis 🔥",
    description: "500 reviews - demonstrates massive savings",
    prompt: `Perform comprehensive analysis of 500 customer reviews:

Deep analysis requirements:
- Full statistical analysis: mean, median, mode, standard deviation, confidence intervals
- Sentiment analysis with emotion classification (joy, frustration, satisfaction, etc.)
- Theme extraction and categorization across all reviews
- Temporal trend analysis (quarterly performance over 18 months)
- Customer segmentation (promoters, passives, detractors)
- Correlation analysis between rating factors
- Geographic/demographic patterns (if mentioned)
- Product quality vs service quality breakdown
- Competitive positioning insights
- Risk assessment and early warning indicators
- Detailed actionable recommendations with priority ranking
- ROI impact estimation for recommendations

Deliver a comprehensive executive report with data-driven insights.`,
  },
  {
    id: 4,
    title: "Multi-Document Legal Analysis ⚖️",
    description: "Contract review - context window challenge",
    prompt: `Analyze these 3 legal contracts for conflicts and risks:

Contract A (Employment): Standard terms, 2-year duration, non-compete clause
Contract B (Partnership): Revenue sharing 60/40, IP ownership unclear
Contract C (NDA): 5-year confidentiality, broad definition of trade secrets

Identify:
- Conflicting clauses between contracts
- Legal risks and exposure
- Missing critical terms
- Recommendations for amendments
- Priority issues requiring immediate attention`,
  },
  {
    id: 5,
    title: "Research Paper Synthesis 📚",
    description: "Multi-source synthesis task",
    prompt: `Synthesize findings from 5 research papers on AI safety:

Papers cover: alignment, interpretability, robustness, fairness, privacy

Provide:
- Key findings from each paper
- Common themes across papers
- Conflicting viewpoints or contradictions
- Research gaps identified
- Practical implications for AI development
- Future research directions suggested

Synthesize a coherent overview connecting all papers.`,
  },
];
