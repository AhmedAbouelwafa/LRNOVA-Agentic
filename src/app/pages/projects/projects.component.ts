import { Component, inject, signal, computed } from '@angular/core';
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

  readonly itemsPerPage = 4;

  // Pagination state
  readonly instantPage = signal(1);
  readonly projectPage = signal(1);

  instantCreations: ProjectCard[] = [
    {
      id: 'inst-1',
      title: 'Introduction to Machine Learning',
      tool: 'Script',
      prompt: 'Create a detailed script about introduction to machine learning for beginners',
      date: new Date(2026, 5, 17, 14, 30),
      image: ''
    },
    {
      id: 'inst-2',
      title: 'DNA Explainer Video',
      tool: 'Video',
      prompt: 'Generate an explainer video about DNA structure and replication',
      date: new Date(2026, 5, 16, 9, 15),
      image: ''
    },
    {
      id: 'inst-3',
      title: 'Physics Assessment Quiz',
      tool: 'Assessment',
      prompt: 'Build a comprehensive assessment quiz for high school physics covering Newton\'s laws',
      date: new Date(2026, 5, 15, 11, 0),
      image: ''
    },
    {
      id: 'inst-4',
      title: 'World History Topics',
      tool: 'Topic',
      prompt: 'Explore the topic of Ancient Roman civilization and its impact on modern society',
      date: new Date(2026, 5, 14, 16, 45),
      image: ''
    },
    {
      id: 'inst-5',
      title: 'Team Building Activities',
      tool: 'Activity',
      prompt: 'Design interactive team building activities for remote learning environments',
      date: new Date(2026, 5, 13, 10, 20),
      image: ''
    },
    {
      id: 'inst-6',
      title: 'Quantum Computing Basics',
      tool: 'Script',
      prompt: 'Write a script explaining quantum computing concepts for university students',
      date: new Date(2026, 5, 12, 13, 0),
      image: ''
    },
    {
      id: 'inst-7',
      title: 'Spanish for Beginners',
      tool: 'Activity',
      prompt: 'Design interactive learning activities for Spanish vocabulary and grammar',
      date: new Date(2026, 5, 11, 15, 30),
      image: ''
    },
    {
      id: 'inst-8',
      title: 'Biology Lab Safety',
      tool: 'Video',
      prompt: 'Create a safety training video for biology laboratory procedures',
      date: new Date(2026, 5, 10, 9, 0),
      image: ''
    },
    {
      id: 'inst-9',
      title: 'Algebra Quiz Set',
      tool: 'Assessment',
      prompt: 'Generate a set of algebra quizzes for 8th grade students with increasing difficulty',
      date: new Date(2026, 5, 9, 11, 45),
      image: ''
    },
    {
      id: 'inst-10',
      title: 'Climate Change Overview',
      tool: 'Topic',
      prompt: 'Explore the topic of climate change causes, effects, and solutions',
      date: new Date(2026, 5, 8, 14, 0),
      image: ''
    },
    {
      id: 'inst-11',
      title: 'Creative Writing Workshop',
      tool: 'Activity',
      prompt: 'Create engaging creative writing activities for high school English class',
      date: new Date(2026, 5, 7, 10, 30),
      image: ''
    },
    {
      id: 'inst-12',
      title: 'Solar System Presentation',
      tool: 'Text Video',
      prompt: 'Convert text about the solar system into an animated video presentation',
      date: new Date(2026, 5, 6, 16, 0),
      image: ''
    }
  ];

  projectCreations: ProjectCard[] = [
    {
      id: 'proj-1',
      title: 'Complete Python Programming Course',
      tool: 'Full Course Content',
      prompt: 'Generate a full course on Python programming from basics to advanced topics',
      date: new Date(2026, 5, 18, 8, 0),
      image: ''
    },
    {
      id: 'proj-2',
      title: 'Digital Marketing Masterclass',
      tool: 'Full Course Script',
      prompt: 'Generate a full course script for Digital Marketing covering SEO, SEM, and social media',
      date: new Date(2026, 5, 17, 12, 0),
      image: ''
    },
    {
      id: 'proj-3',
      title: 'Chemistry Lab Safety Training',
      tool: 'Text Video',
      prompt: 'Convert the chemistry lab safety manual into an engaging video lesson series',
      date: new Date(2026, 5, 16, 15, 30),
      image: ''
    },
    {
      id: 'proj-4',
      title: 'Leadership Skills Workshop',
      tool: 'Full Course Content',
      prompt: 'Create comprehensive content for a leadership skills development workshop',
      date: new Date(2026, 5, 12, 9, 0),
      image: ''
    },
    {
      id: 'proj-5',
      title: 'Data Science Bootcamp',
      tool: 'Full Course Content',
      prompt: 'Build a complete data science bootcamp curriculum with hands-on projects',
      date: new Date(2026, 5, 10, 10, 0),
      image: ''
    },
    {
      id: 'proj-6',
      title: 'UX Design Fundamentals',
      tool: 'Full Course Script',
      prompt: 'Create a full course script for UX design principles and user research methods',
      date: new Date(2026, 5, 8, 14, 30),
      image: ''
    },
    {
      id: 'proj-7',
      title: 'Photography Masterclass',
      tool: 'Full Course Content',
      prompt: 'Generate comprehensive course content for photography from composition to post-processing',
      date: new Date(2026, 5, 5, 11, 0),
      image: ''
    },
    {
      id: 'proj-8',
      title: 'Personal Finance 101',
      tool: 'Full Course Script',
      prompt: 'Draft a complete course script on personal finance, budgeting, and investing basics',
      date: new Date(2026, 5, 3, 9, 0),
      image: ''
    },
    {
      id: 'proj-9',
      title: 'Web Development Full Stack',
      tool: 'Full Course Content',
      prompt: 'Build a full-stack web development course covering HTML, CSS, JS, Node.js, and React',
      date: new Date(2026, 5, 1, 8, 0),
      image: ''
    }
  ];

  // Computed paginated lists
  readonly instantTotalPages = computed(() => Math.ceil(this.instantCreations.length / this.itemsPerPage));
  readonly projectTotalPages = computed(() => Math.ceil(this.projectCreations.length / this.itemsPerPage));

  readonly paginatedInstant = computed(() => {
    const start = (this.instantPage() - 1) * this.itemsPerPage;
    return this.instantCreations.slice(start, start + this.itemsPerPage);
  });

  readonly paginatedProjects = computed(() => {
    const start = (this.projectPage() - 1) * this.itemsPerPage;
    return this.projectCreations.slice(start, start + this.itemsPerPage);
  });

  getInstantPages(): number[] {
    return Array.from({ length: this.instantTotalPages() }, (_, i) => i + 1);
  }

  getProjectPages(): number[] {
    return Array.from({ length: this.projectTotalPages() }, (_, i) => i + 1);
  }

  goInstantPage(page: number) {
    if (page >= 1 && page <= this.instantTotalPages()) {
      this.instantPage.set(page);
    }
  }

  goProjectPage(page: number) {
    if (page >= 1 && page <= this.projectTotalPages()) {
      this.projectPage.set(page);
    }
  }

  private toolStyles: Record<string, { gradient: string; icon: string; accent: string }> = {
    'Video': {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M4 6h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z',
      accent: '#764ba2'
    },
    'Text Video': {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: 'M4 4h16v16H4z M12 8v8 M8 12h8',
      accent: '#f5576c'
    },
    'Script': {
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
      accent: '#4facfe'
    },
    'Assessment': {
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
      accent: '#38d9a9'
    },
    'Activity': {
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8',
      accent: '#fa709a'
    },
    'Topic': {
      gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      icon: 'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
      accent: '#a18cd1'
    },
    'Full Course Script': {
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5V4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z',
      accent: '#f4845f'
    },
    'Full Course Content': {
      gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
      accent: '#66a6ff'
    }
  };

  private defaultStyle = {
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    icon: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
    accent: '#8B5CF6'
  };

  getToolGradient(tool: string): string {
    return (this.toolStyles[tool] || this.defaultStyle).gradient;
  }

  getToolIcon(tool: string): string {
    return (this.toolStyles[tool] || this.defaultStyle).icon;
  }

  getToolAccent(tool: string): string {
    return (this.toolStyles[tool] || this.defaultStyle).accent;
  }

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
