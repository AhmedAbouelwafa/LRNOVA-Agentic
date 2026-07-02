import { Component, inject, signal, OnInit } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';
import { RenderMarkdownPipe } from '../../../../shared/pipes/render-markdown.pipe';

@Component({
  selector: 'app-text-result',
  standalone: true,
  imports: [RenderMarkdownPipe],
  templateUrl: './text-result.component.html',
  styleUrl: './text-result.component.css'
})
export class TextResultComponent implements OnInit {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  protected isRevealed = signal(false);

  /** Returns a display title from the selected goal or submitted prompt */
  protected get resultTitle(): string {
    const goal = this.state.selectedGoal();
    const prompt = this.state.submittedPrompt();
    const tabId = this.state.activeTabId();

    const tool = this.state.selectedQuickTool();

    if (goal?.level === 2 && tabId) {
      if (tabId.includes('script')) return `Course Script: ${prompt}`;
      if (tabId.includes('assessment')) return `Course Assessment: ${prompt}`;
      if (tabId.includes('activity')) return `Learning Activity: ${prompt}`;
      if (tabId.includes('content') || tabId.includes('topic')) return `Course Content: ${prompt}`;
      return `Overview: ${prompt}`;
    }

    if (goal) {
      switch (goal.id) {
        case 'explain-it': return `Topic Explanation: ${prompt}`;
        case 'script-it': return `Generated Script: ${prompt}`;
        case 'test-it': return `Assessment: ${prompt}`;
        case 'full-course': return `Course Content: ${prompt}`;
        case 'learn-kit': return `Learning Kit: ${prompt}`;
        default: return prompt;
      }
    }
    
    if (tool) {
      switch (tool) {
        case 'Topic': return `Topic Explanation: ${prompt}`;
        case 'Script': 
        case 'Full Course Script': return `Generated Script: ${prompt}`;
        case 'Assessment': return `Assessment: ${prompt}`;
        case 'Activity': return `Learning Activity: ${prompt}`;
        case 'Full Course Content': return `Course Content: ${prompt}`;
      }
    }

    return prompt || 'Generated Content';
  }

  /** Returns fake generated content based on goal type */
  protected get resultContent(): string {
    const goal = this.state.selectedGoal();
    const prompt = this.state.submittedPrompt() || 'the requested topic';
    const tabId = this.state.activeTabId();

    const tool = this.state.selectedQuickTool();

    if (goal?.level === 2 && tabId) {
      if (tabId.includes('script')) return this.generateScriptContent(prompt);
      if (tabId.includes('assessment')) return this.generateAssessmentContent(prompt);
      if (tabId.includes('activity')) return this.generateActivityContent(prompt);
      if (tabId.includes('content') || tabId.includes('topic')) return this.generateCourseContent(prompt);
      return this.generateExplanationContent(prompt); // Main tab overview
    }

    if (goal?.id === 'test-it' || tool === 'Assessment') {
      return this.generateAssessmentContent(prompt);
    }
    if (goal?.id === 'script-it' || tool === 'Script' || tool === 'Full Course Script') {
      return this.generateScriptContent(prompt);
    }
    if (goal?.id === 'explain-it' || tool === 'Topic') {
      return this.generateExplanationContent(prompt);
    }
    if (tool === 'Activity') {
      return this.generateActivityContent(prompt);
    }
    // Default: general course/text content
    return this.generateCourseContent(prompt);
  }

  ngOnInit() {
    // Animate text reveal
    setTimeout(() => this.isRevealed.set(true), 200);
  }

  private generateExplanationContent(topic: string): string {
    return `## Understanding ${topic}

### Introduction
${topic} is a fundamental concept that plays a crucial role in modern understanding. This explanation breaks down the key principles, mechanisms, and real-world applications to give you a comprehensive overview.

### Core Concepts

**1. Foundation Principles**
At its core, ${topic} operates on several foundational principles that have been established through decades of research and practical observation. These principles form the building blocks for more advanced understanding.

- **Principle of Interaction** — Elements within ${topic} interact through well-defined rules that govern behavior and outcomes
- **Scalability** — The concepts scale from simple to complex scenarios while maintaining consistency  
- **Observable Patterns** — Recurring patterns emerge that allow for prediction and deeper analysis

**2. How It Works**
The mechanism behind ${topic} can be understood through a step-by-step breakdown:

1. **Initial State** — The system begins in a baseline configuration
2. **Input Processing** — External stimuli or data triggers a response
3. **Transformation** — Internal processes modify the state based on defined rules
4. **Output Generation** — The result manifests as observable changes or products

### Key Terminology

| Term | Definition |
|------|-----------|
| **Primary Component** | The main element driving the process |
| **Secondary Factor** | Supporting elements that influence outcomes |
| **Feedback Loop** | Self-regulating mechanism for stability |
| **Threshold** | Critical point where behavior changes |

### Real-World Applications
Understanding ${topic} has practical implications across many fields:

- **Education** — Designing effective learning experiences
- **Technology** — Building intelligent systems  
- **Industry** — Optimizing processes and workflows
- **Research** — Advancing scientific knowledge

### Summary
${topic} represents a rich area of study with broad applications. By understanding its core principles and mechanisms, learners can apply this knowledge to solve real-world problems and contribute to ongoing innovation.

---
*Generated by LRNOVA AI · Content ready for review and customization*`;
  }

  private generateScriptContent(topic: string): string {
    return `# Video Script: ${topic}

---

## 🎬 PRE-PRODUCTION NOTES
- **Duration:** 5-7 minutes  
- **Tone:** Professional, engaging, conversational  
- **Target Audience:** General learners  

---

## SCENE 1 — HOOK (0:00 - 0:30)

**[VISUAL: Dynamic title animation with topic keyword]**

**NARRATOR (V.O.):**
> "Have you ever wondered about ${topic}? In the next few minutes, we're going to break it down in a way that's easy to understand — and actually interesting. Let's dive in."

**[VISUAL: Transition swoosh to main content]**

---

## SCENE 2 — INTRODUCTION (0:30 - 1:30)

**[VISUAL: Animated infographic showing overview]**

**NARRATOR (V.O.):**
> "${topic} might sound complex at first, but once you understand the basics, everything starts to click. Think of it like building blocks — each piece connects to the next."

**[VISUAL: Building blocks animation]**

> "Let's start with the fundamentals."

---

## SCENE 3 — CORE CONCEPT #1 (1:30 - 3:00)

**[VISUAL: Diagram with labels appearing one by one]**

**NARRATOR (V.O.):**
> "The first thing you need to know is the foundation. Every great understanding of ${topic} begins here."

**[B-ROLL: Related imagery, examples]**

> "Here's why this matters: without this base, nothing else makes sense. It's like trying to read a book without knowing the alphabet."

**[VISUAL: Key point highlighted on screen]**

**ON-SCREEN TEXT:**  
\`💡 Key Point: The foundation of ${topic} determines everything that follows.\`

---

## SCENE 4 — CORE CONCEPT #2 (3:00 - 4:30)

**[VISUAL: Side-by-side comparison animation]**

**NARRATOR (V.O.):**
> "Now that we have the basics, let's look at how ${topic} actually works in practice. This is where it gets really interesting."

**[VISUAL: Process flow animation]**

> "Watch how each step builds on the previous one. This chain of connections is what makes ${topic} so powerful."

---

## SCENE 5 — PRACTICAL APPLICATION (4:30 - 5:30)

**[VISUAL: Real-world example montage]**

**NARRATOR (V.O.):**
> "So how does this apply to real life? Let me give you three quick examples..."

**[VISUAL: Example 1 with icon]**
> "First — in everyday decision-making..."

**[VISUAL: Example 2 with icon]**
> "Second — in professional settings..."

**[VISUAL: Example 3 with icon]**
> "And third — in creative problem-solving..."

---

## SCENE 6 — CONCLUSION & CTA (5:30 - 6:00)

**[VISUAL: Summary card with key takeaways]**

**NARRATOR (V.O.):**
> "And there you have it — ${topic} explained simply and clearly. Remember these three takeaways..."

**[VISUAL: Numbered list animation]**

> "If you found this helpful, share it with someone who might benefit. Until next time, keep learning!"

**[VISUAL: End card with branding]**

---

*Generated by LRNOVA AI · Script ready for production*`;
  }

  private generateActivityContent(topic: string): string {
    return `# Interactive Activity: ${topic}

---

## 🎯 Activity Overview
- **Objective:** Apply core concepts of ${topic} in a practical scenario
- **Duration:** 15-20 minutes
- **Format:** Group discussion & problem-solving

### Instructions
1. **Review the Scenario:** Read the case study provided below.
2. **Identify Key Elements:** Highlight the main factors related to ${topic}.
3. **Brainstorm Solutions:** Work with your team to develop 3 potential solutions.
4. **Present Findings:** Share your best solution and the reasoning behind it.

### Case Study Scenario
Imagine you are tasked with implementing a new strategy based on ${topic} for a local business. The business has limited resources but needs to see a 20% improvement in their core metrics within 3 months.

### Discussion Questions
- What is the most critical aspect of ${topic} to address first?
- How can you measure the success of your implementation?
- What potential roadblocks might you encounter, and how would you overcome them?

---
*Generated by LRNOVA AI · Activity ready for learners*`;
  }

  private generateAssessmentContent(topic: string): string {
    return `# Assessment: ${topic}

---

## 📋 Quiz Overview
- **Subject:** ${topic}  
- **Questions:** 10  
- **Time Limit:** 15 minutes  
- **Passing Score:** 70%  

---

## Section A: Multiple Choice (4 questions)

### Question 1
**Which of the following best describes the primary characteristic of ${topic}?**

- A) It operates independently without external influence
- B) It relies on interconnected principles that build upon each other ✅
- C) It can only be observed in controlled environments
- D) It has no practical application in everyday life

> **Explanation:** ${topic} is characterized by its interconnected nature, where foundational principles support and influence more complex aspects.

---

### Question 2
**What is the first step in understanding ${topic}?**

- A) Memorizing all related terminology
- B) Skipping to advanced applications
- C) Establishing a solid foundation of core concepts ✅
- D) Reading only the most recent research

> **Explanation:** Building understanding from the ground up ensures a stable knowledge base.

---

### Question 3
**In the context of ${topic}, a "feedback loop" refers to:**

- A) A type of error in the system
- B) A self-regulating mechanism that maintains stability ✅
- C) An external input source
- D) A one-time process that doesn't repeat

> **Explanation:** Feedback loops are crucial self-correcting mechanisms within ${topic}.

---

### Question 4
**Which field does NOT commonly apply concepts from ${topic}?**

- A) Education
- B) Technology
- C) None — it applies to all fields ✅
- D) Healthcare

> **Explanation:** The principles of ${topic} have broad, cross-disciplinary applications.

---

## Section B: True or False (3 questions)

### Question 5
**${topic} can only be studied through theoretical analysis, not practical observation.**

- ☐ True
- ☑ False ✅

> **Explanation:** ${topic} can be studied through both theoretical and practical approaches.

---

### Question 6
**The concepts within ${topic} scale from simple to complex while maintaining consistency.**

- ☑ True ✅
- ☐ False

---

### Question 7
**Understanding the fundamentals of ${topic} is optional for advanced study.**

- ☐ True
- ☑ False ✅

> **Explanation:** Fundamentals are essential building blocks for advanced understanding.

---

## Section C: Short Answer (3 questions)

### Question 8
**Explain in 2-3 sentences why ${topic} is relevant in modern education.**

*Sample Answer:* ${topic} is relevant because it provides frameworks for understanding complex systems. In education, these frameworks help design effective learning experiences and assessments. Its cross-disciplinary nature also encourages critical thinking.

---

### Question 9
**List three real-world applications of ${topic}.**

*Sample Answer:*
1. Optimizing educational curriculum design
2. Improving technological system architecture  
3. Enhancing research methodologies

---

### Question 10
**Describe the relationship between "input processing" and "transformation" in the context of ${topic}.**

*Sample Answer:* Input processing is the stage where external data or stimuli are received and interpreted. Transformation then takes this processed information and applies defined rules to modify the system state, producing new outputs or behaviors.

---

## 📊 Scoring Guide
| Score | Grade | Feedback |
|-------|-------|----------|
| 90-100% | A | Excellent understanding! |
| 80-89% | B | Strong grasp of concepts |
| 70-79% | C | Meets passing requirements |
| Below 70% | F | Review material and retake |

---
*Generated by LRNOVA AI · Assessment ready for review and customization*`;
  }

  private generateCourseContent(topic: string): string {
    return `# Course: ${topic}

---

## 📘 Course Overview

This comprehensive course covers the essential aspects of **${topic}**, designed to take learners from foundational understanding to practical application. Each module builds upon the previous, ensuring a structured and progressive learning journey.

---

## Module 1: Introduction to ${topic}

### Learning Objectives
By the end of this module, learners will be able to:
- Define ${topic} and its core components
- Explain the historical context and evolution
- Identify key stakeholders and their roles

### 1.1 What is ${topic}?
${topic} encompasses a broad set of principles and practices that have evolved significantly over time. At its essence, it represents a systematic approach to understanding and solving complex challenges.

### 1.2 Historical Context
The study of ${topic} traces its roots to early theoretical frameworks developed in the mid-20th century. Since then, it has undergone several paradigm shifts:

| Era | Development | Impact |
|-----|------------|--------|
| **Foundation (1950s-70s)** | Initial theories established | Created academic foundation |
| **Growth (1980s-90s)** | Practical applications emerged | Industry adoption began |
| **Digital Age (2000s-10s)** | Technology integration | Exponential growth |
| **AI Era (2020s+)** | AI-powered approaches | Revolutionary transformation |

### 1.3 Why It Matters
Understanding ${topic} is essential for:
- 🎯 Making informed decisions in professional contexts
- 💡 Driving innovation and creative problem-solving
- 🌍 Contributing to global knowledge advancement

---

## Module 2: Core Principles

### 2.1 Fundamental Concepts
The three pillars of ${topic}:

1. **Structural Foundation** — The organizational framework
2. **Dynamic Processes** — How elements interact and evolve  
3. **Outcome Measurement** — Evaluating effectiveness

### 2.2 Theoretical Frameworks

> **Framework A: The Systems Model**
> Views ${topic} as an interconnected system where each component influences others. Changes in one area cascade through the entire structure.

> **Framework B: The Progressive Model**  
> Emphasizes sequential development, where understanding builds layer by layer from simple to complex.

### 2.3 Key Principles in Practice

\`\`\`
┌─────────────────────────────────┐
│         INPUT LAYER             │
│   Data, Requirements, Context   │
├─────────────────────────────────┤
│       PROCESSING LAYER          │
│   Analysis, Synthesis, Design   │
├─────────────────────────────────┤
│         OUTPUT LAYER            │
│   Solutions, Products, Insights │
└─────────────────────────────────┘
\`\`\`

---

## Module 3: Practical Applications

### 3.1 Case Study: Education Sector
How ${topic} transformed learning at Global University:
- **Challenge:** Low student engagement in traditional courses
- **Solution:** Applied ${topic} principles to redesign curriculum
- **Result:** 45% increase in completion rates

### 3.2 Case Study: Technology Industry
Implementation of ${topic} at TechCorp:
- **Challenge:** Inefficient knowledge transfer between teams
- **Solution:** Integrated ${topic} framework into onboarding
- **Result:** 60% faster ramp-up time for new team members

### 3.3 Hands-On Exercise
Apply what you've learned to a scenario in your own field. Consider:
1. What problem could ${topic} principles help solve?
2. Which framework (A or B) best fits your context?
3. What metrics would you use to measure success?

---

## Module 4: Advanced Topics

### 4.1 Emerging Trends
- AI-augmented approaches to ${topic}
- Cross-disciplinary integration
- Real-time adaptive systems

### 4.2 Challenges and Solutions
Common challenges when implementing ${topic}:

| Challenge | Solution |
|-----------|----------|
| Resistance to change | Stakeholder engagement programs |
| Resource constraints | Phased implementation approach |
| Measurement difficulties | Multi-metric evaluation frameworks |
| Scalability issues | Modular architecture design |

### 4.3 Future Directions
The next frontier of ${topic} involves:
- 🤖 AI-powered personalization
- 🌐 Global collaborative frameworks
- 📊 Data-driven decision making
- 🔄 Continuous adaptive improvement

---

## 📝 Course Summary

This course provided a comprehensive journey through ${topic}, covering:
- ✅ Foundational definitions and historical context
- ✅ Core principles and theoretical frameworks
- ✅ Real-world case studies and practical exercises
- ✅ Advanced topics and future directions

---
*Generated by LRNOVA AI · Course content ready for review and customization*`;
  }
}
