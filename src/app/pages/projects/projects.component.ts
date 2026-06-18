import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PromptStateService } from '../../core/services/prompt-state.service';
import { LocalizationService } from '../../core/services/localization.service';
import { DatePipe } from '@angular/common';

export interface ProjectCard {
  id: string;
  title: string;
  tool: string;
  prompt: string;
  date: Date;
  image: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  private router = inject(Router);

  instantCreations: ProjectCard[] = [
    {
      id: 'inst-1',
      title: 'Introduction to Machine Learning',
      tool: 'Script',
      prompt: 'Create a detailed script about introduction to machine learning for beginners',
      date: new Date(2026, 5, 17, 14, 30),
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'inst-2',
      title: 'DNA Explainer Video',
      tool: 'Video',
      prompt: 'Generate an explainer video about DNA structure and replication',
      date: new Date(2026, 5, 16, 9, 15),
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'inst-3',
      title: 'Physics Assessment Quiz',
      tool: 'Assessment',
      prompt: 'Build a comprehensive assessment quiz for high school physics covering Newton\'s laws',
      date: new Date(2026, 5, 15, 11, 0),
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'inst-4',
      title: 'World History Topics',
      tool: 'Topic',
      prompt: 'Explore the topic of Ancient Roman civilization and its impact on modern society',
      date: new Date(2026, 5, 14, 16, 45),
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'inst-5',
      title: 'Team Building Activities',
      tool: 'Activity',
      prompt: 'Design interactive team building activities for remote learning environments',
      date: new Date(2026, 5, 13, 10, 20),
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80'
    }
  ];

  projectCreations: ProjectCard[] = [
    {
      id: 'proj-1',
      title: 'Complete Python Programming Course',
      tool: 'Full Course Content',
      prompt: 'Generate a full course on Python programming from basics to advanced topics',
      date: new Date(2026, 5, 18, 8, 0),
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'proj-2',
      title: 'Digital Marketing Masterclass',
      tool: 'Full Course Script',
      prompt: 'Generate a full course script for Digital Marketing covering SEO, SEM, and social media',
      date: new Date(2026, 5, 17, 12, 0),
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'proj-3',
      title: 'Chemistry Lab Safety Training',
      tool: 'Text Video',
      prompt: 'Convert the chemistry lab safety manual into an engaging video lesson series',
      date: new Date(2026, 5, 16, 15, 30),
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'proj-4',
      title: 'Leadership Skills Workshop',
      tool: 'Full Course Content',
      prompt: 'Create comprehensive content for a leadership skills development workshop',
      date: new Date(2026, 5, 12, 9, 0),
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80'
    }
  ];

  openProject(card: ProjectCard, isProject: boolean = false) {
    // Reset state and set up as if we submitted the prompt
    this.state.isAnimatingOut.set(true);
    this.state.submittedPrompt.set(card.prompt);
    
    if (isProject) {
      this.state.selectedQuickTool.set('Projects');
      this.state.canvasTabs.set([
        { id: 'main', label: 'Overview' },
        { id: 'tab1', label: 'Chapter 1' },
        { id: 'tab2', label: 'Chapter 2' },
        { id: 'tab3', label: 'Resources' }
      ]);
    } else {
      this.state.selectedQuickTool.set(card.tool);
      this.state.canvasTabs.set([{ id: 'main', label: card.title.slice(0, 30) }]);
    }

    this.state.isGenerationComplete.set(true);
    this.state.isGenerating.set(false);
    this.state.activeTabId.set('main');

    // Populate fake chat history for this project
    this.state.chatHistory.set([
      {
        id: 'hist-1',
        role: 'user',
        content: card.prompt,
        timestamp: card.date
      },
      {
        id: 'hist-2',
        role: 'agent',
        content: 'Great topic! Let me ask a few questions to make sure we build the right content.',
        type: 'questionnaire',
        questionnaire: {
          title: 'Who is this lesson for?',
          options: [
            { id: 1, label: 'Elementary school students (ages 8-11)' },
            { id: 2, label: 'Middle school students (ages 11-14)' },
            { id: 3, label: 'High school students (ages 14-18)' },
            { id: 4, label: 'College / university students' }
          ],
          answered: true,
          step: 1,
          totalSteps: 3
        },
        timestamp: new Date(card.date.getTime() + 5000)
      },
      {
        id: 'hist-3',
        role: 'agent',
        content: '',
        type: 'questionnaire',
        questionnaire: {
          title: 'What should the primary tone be?',
          options: [
            { id: 1, label: 'Fun and engaging' },
            { id: 2, label: 'Professional and formal' },
            { id: 3, label: 'Inspirational and storytelling' }
          ],
          answered: true,
          step: 2,
          totalSteps: 3
        },
        timestamp: new Date(card.date.getTime() + 15000)
      },
      {
        id: 'hist-4',
        role: 'agent',
        content: `I've finished generating your "${card.title}" content. You can review and edit it in the workspace.`,
        timestamp: new Date(card.date.getTime() + 60000)
      }
    ]);

    // Navigate to results
    this.router.navigate(['/results']);
  }
}
