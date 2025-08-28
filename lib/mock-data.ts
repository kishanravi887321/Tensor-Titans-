import type { Lesson, Badge, Role } from "@/types/models"

export const ROLES: { id: Role; label: string; description: string; color: string }[] = [
  {
    id: "marketing",
    label: "Marketing",
    description: "Create compelling campaigns and content with AI",
    color: "bg-blue-500",
  },
  {
    id: "hr",
    label: "HR",
    description: "Streamline hiring and employee communications",
    color: "bg-green-500",
  },
  {
    id: "ops",
    label: "Operations",
    description: "Optimize processes and automate workflows",
    color: "bg-purple-500",
  },
  {
    id: "support",
    label: "Support",
    description: "Deliver exceptional customer experiences",
    color: "bg-orange-500",
  },
]

export const MOCK_LESSONS: Lesson[] = [
  // Marketing Lessons
  {
    id: "marketing-1",
    role: "marketing",
    title: "Write Compelling Ad Copy",
    duration: 8,
    skills: ["copywriting", "persuasion", "targeting"],
    description: "Learn to craft ad copy that converts using AI-powered frameworks",
    brief: "Create ad copy that captures attention and drives action using proven frameworks like AIDA and PAS.",
    contextInputs: [
      {
        id: "audience",
        label: "Target Audience",
        type: "select",
        options: ["Young professionals", "Small business owners", "Students", "Retirees"],
      },
      {
        id: "product",
        label: "Product/Service",
        type: "text",
        placeholder: "e.g., Project management software",
      },
      {
        id: "tone",
        label: "Tone",
        type: "select",
        options: ["Professional", "Casual", "Urgent", "Friendly"],
      },
    ],
  },
  {
    id: "marketing-2",
    role: "marketing",
    title: "Analyze Campaign Performance",
    duration: 10,
    skills: ["analytics", "optimization", "reporting"],
    description: "Use AI to interpret campaign data and generate actionable insights",
    brief: "Transform raw campaign data into clear insights and recommendations for optimization.",
    contextInputs: [
      {
        id: "platform",
        label: "Platform",
        type: "select",
        options: ["Google Ads", "Facebook Ads", "LinkedIn Ads", "Email Campaign"],
      },
      {
        id: "metrics",
        label: "Key Metrics",
        type: "textarea",
        placeholder: "e.g., CTR: 2.3%, CPC: $1.50, Conversions: 45",
      },
    ],
  },
  {
    id: "marketing-project",
    role: "marketing",
    title: "Launch Product Campaign",
    duration: 25,
    skills: ["strategy", "execution", "measurement"],
    description: "Plan and execute a complete product launch campaign",
    project: true,
    brief:
      "Create a comprehensive campaign strategy for a new product launch, including messaging, channels, and success metrics.",
  },

  // HR Lessons
  {
    id: "hr-1",
    role: "hr",
    title: "Draft Policy Communications",
    duration: 7,
    skills: ["communication", "policy", "clarity"],
    description: "Create clear, empathetic policy announcements that employees understand",
    brief: "Write policy communications that are clear, compliant, and considerate of employee concerns.",
    contextInputs: [
      {
        id: "policy_type",
        label: "Policy Type",
        type: "select",
        options: ["Remote work", "Benefits change", "Code of conduct", "Safety protocol"],
      },
      {
        id: "urgency",
        label: "Urgency Level",
        type: "select",
        options: ["Low", "Medium", "High", "Immediate"],
      },
    ],
  },
  {
    id: "hr-2",
    role: "hr",
    title: "Screen Candidate Resumes",
    duration: 6,
    skills: ["evaluation", "matching", "efficiency"],
    description: "Use AI to quickly identify top candidates from resume pools",
    brief: "Efficiently evaluate resumes against job requirements and identify the best matches.",
    contextInputs: [
      {
        id: "role",
        label: "Job Role",
        type: "text",
        placeholder: "e.g., Senior Software Engineer",
      },
      {
        id: "requirements",
        label: "Key Requirements",
        type: "textarea",
        placeholder: "List must-have skills and experience",
      },
    ],
  },

  // Operations Lessons
  {
    id: "ops-1",
    role: "ops",
    title: "Automate Workflow Documentation",
    duration: 9,
    skills: ["documentation", "automation", "processes"],
    description: "Create clear process documentation that teams can follow",
    brief: "Document complex workflows in a way that enables automation and reduces errors.",
    contextInputs: [
      {
        id: "process",
        label: "Process Type",
        type: "select",
        options: ["Onboarding", "Order fulfillment", "Quality control", "Reporting"],
      },
      {
        id: "complexity",
        label: "Complexity Level",
        type: "select",
        options: ["Simple", "Moderate", "Complex", "Very complex"],
      },
    ],
  },

  // Support Lessons
  {
    id: "support-1",
    role: "support",
    title: "Generate Tone-Adjusted Responses",
    duration: 5,
    skills: ["empathy", "communication", "resolution"],
    description: "Craft support responses that match customer emotions and needs",
    brief: "Respond to customer inquiries with the right tone and helpful solutions.",
    contextInputs: [
      {
        id: "customer_mood",
        label: "Customer Mood",
        type: "select",
        options: ["Frustrated", "Confused", "Urgent", "Neutral", "Happy"],
      },
      {
        id: "issue_type",
        label: "Issue Type",
        type: "select",
        options: ["Technical problem", "Billing question", "Feature request", "Complaint"],
      },
    ],
  },
]

export const MOCK_BADGES: Badge[] = [
  {
    id: "first-lesson",
    label: "Getting Started",
    description: "Completed your first lesson",
    earned: false,
    icon: "🎯",
  },
  {
    id: "marketing-apprentice",
    label: "Marketing Apprentice",
    description: "Completed 3 marketing lessons",
    earned: false,
    icon: "📈",
  },
  {
    id: "hr-helper",
    label: "HR Helper",
    description: "Mastered HR communications",
    earned: false,
    icon: "👥",
  },
  {
    id: "ops-optimizer",
    label: "Operations Optimizer",
    description: "Streamlined 5 processes",
    earned: false,
    icon: "⚙️",
  },
  {
    id: "support-star",
    label: "Support Star",
    description: "Achieved 90%+ satisfaction rating",
    earned: false,
    icon: "⭐",
  },
  {
    id: "streak-week",
    label: "Week Warrior",
    description: "7-day learning streak",
    earned: false,
    icon: "🔥",
  },
]

export const PROMPT_TEMPLATES = {
  marketing: [
    { id: "aida", label: "AIDA", template: "Attention: [Hook]\nInterest: [Benefit]\nDesire: [Proof]\nAction: [CTA]" },
    { id: "pas", label: "PAS", template: "Problem: [Pain point]\nAgitate: [Consequences]\nSolution: [Your offer]" },
  ],
  hr: [
    { id: "policy", label: "Policy", template: "What: [Change]\nWhy: [Reason]\nWhen: [Timeline]\nHow: [Next steps]" },
    {
      id: "announcement",
      label: "Announcement",
      template: "Subject: [Clear title]\nContext: [Background]\nDetails: [Specifics]\nAction: [What to do]",
    },
  ],
  ops: [
    { id: "sop", label: "SOP", template: "Purpose: [Goal]\nScope: [Coverage]\nSteps: [Process]\nChecks: [Validation]" },
  ],
  support: [
    {
      id: "empathy",
      label: "Empathy",
      template: "Acknowledge: [Customer feeling]\nApologize: [If needed]\nAction: [Solution]\nAssure: [Follow-up]",
    },
  ],
}
