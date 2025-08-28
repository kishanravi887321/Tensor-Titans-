import { type NextRequest, NextResponse } from "next/server"
import type { CoachFeedback } from "@/types/models"

export async function POST(request: NextRequest) {
  try {
    const { prompt, role, context } = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock AI coaching response based on role and prompt
    const feedback: CoachFeedback = generateMockFeedback(prompt, role, context)

    return NextResponse.json(feedback)
  } catch (error) {
    return NextResponse.json({ error: "Failed to evaluate prompt" }, { status: 500 })
  }
}

function generateMockFeedback(prompt: string, role: string, context: any): CoachFeedback {
  const promptLength = prompt.trim().split(/\s+/).length

  // Base feedback structure
  const feedback: CoachFeedback = {
    good: [],
    gaps: [],
    suggestion: "",
    automation: [],
    aiOutput: "",
  }

  // Role-specific feedback
  switch (role) {
    case "marketing":
      feedback.good = [
        "Clear target audience identification",
        "Strong call-to-action included",
        "Benefit-focused messaging",
      ]
      feedback.gaps =
        promptLength < 15 ? ["Add more specific details about the product", "Include urgency or scarcity"] : []
      feedback.suggestion = `Create compelling ad copy for ${context?.product || "your product"} targeting ${
        context?.audience || "your audience"
      }. Focus on the main benefit, create urgency, and include a clear call-to-action. Use ${
        context?.tone || "professional"
      } tone.`
      feedback.automation = ["Slack", "Sheets", "Zapier"]
      feedback.aiOutput = `🎯 **Attention ${context?.audience || "Professionals"}!**

Transform your workflow with ${context?.product || "our innovative solution"}. 

✅ Save 5+ hours per week
✅ Increase productivity by 40%
✅ Join 10,000+ satisfied users

**Limited time: 30% off your first month!**

[Start Free Trial] - No credit card required`
      break

    case "hr":
      feedback.good = ["Professional tone maintained", "Clear policy explanation", "Employee-focused language"]
      feedback.gaps = promptLength < 20 ? ["Add implementation timeline", "Include contact for questions"] : []
      feedback.suggestion = `Draft a ${context?.policy_type || "policy"} communication that explains the change clearly, provides context for why it's happening, includes implementation timeline, and offers support resources. Use empathetic but professional tone.`
      feedback.automation = ["Slack", "Email", "HRIS"]
      feedback.aiOutput = `Subject: Important Update: ${context?.policy_type || "Policy"} Changes

Dear Team,

We're writing to inform you about upcoming changes to our ${
        context?.policy_type || "workplace policies"
      } that will take effect on [DATE].

**What's Changing:**
[Brief explanation of the change]

**Why This Change:**
This update helps us [reason for change] and ensures we continue to support your success.

**Next Steps:**
- Review the updated policy document (attached)
- Attend the information session on [DATE]
- Reach out to HR with any questions

We're here to support you through this transition.

Best regards,
HR Team`
      break

    case "ops":
      feedback.good = ["Step-by-step structure", "Clear process definition", "Measurable outcomes"]
      feedback.gaps = promptLength < 25 ? ["Add quality checkpoints", "Include error handling steps"] : []
      feedback.suggestion = `Document the ${
        context?.process || "workflow"
      } process with clear steps, responsibilities, quality checks, and error handling procedures. Include automation opportunities and success metrics.`
      feedback.automation = ["Zapier", "Sheets", "Slack"]
      feedback.aiOutput = `# ${context?.process || "Process"} Documentation

## Purpose
[Clear statement of what this process achieves]

## Steps
1. **Initial Setup** - [Description]
2. **Execution** - [Description]
3. **Quality Check** - [Description]
4. **Completion** - [Description]

## Quality Checkpoints
- [ ] Requirement A met
- [ ] Requirement B verified
- [ ] Final review completed

## Automation Opportunities
- Step 2 can be automated using [tool]
- Notifications can be sent via Slack

## Success Metrics
- Time to completion: [target]
- Error rate: [target]`
      break

    case "support":
      feedback.good = ["Empathetic tone", "Solution-focused approach", "Clear next steps"]
      feedback.gaps = promptLength < 10 ? ["Add personalization", "Include follow-up commitment"] : []
      feedback.suggestion = `Respond to the ${context?.issue_type || "customer inquiry"} with empathy for their ${
        context?.customer_mood || "situation"
      }, provide a clear solution or next steps, and ensure they feel heard and valued.`
      feedback.automation = ["Zendesk", "Slack", "Email"]
      feedback.aiOutput = `Hi [Customer Name],

Thank you for reaching out about ${context?.issue_type || "your concern"}. I understand how ${
        context?.customer_mood === "frustrated" ? "frustrating" : "important"
      } this must be for you.

**Here's how we'll resolve this:**
1. [Immediate action taken]
2. [Next step with timeline]
3. [Follow-up commitment]

I'll personally monitor this and update you within [timeframe]. You can also track progress at [link].

Is there anything else I can help you with today?

Best regards,
[Your Name]
Customer Success Team`
      break

    default:
      feedback.good = ["Clear communication", "Well-structured prompt"]
      feedback.gaps = ["Consider adding more context"]
      feedback.suggestion = "Enhance your prompt with more specific details and clear objectives."
      feedback.automation = ["Zapier", "Slack"]
      feedback.aiOutput = "This is a sample AI response based on your prompt."
  }

  return feedback
}
