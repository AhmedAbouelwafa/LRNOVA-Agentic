import { Component, inject, signal, computed, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PromptStateService } from '../../core/services/prompt-state.service';
import { LocalizationService } from '../../core/services/localization.service';
import { DatePipe } from '@angular/common';

import { ProjectCard, Goal } from '../../core/models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  private router = inject(Router);

  @ViewChild('scrollTrigger') scrollTrigger!: ElementRef;
  private observer: IntersectionObserver | null = null;
  isLoadingMore = signal(false);

  readonly itemsPerPage = 8;
  visibleItemsCount = signal(this.itemsPerPage);

  /** Goal definitions (same as agent-selector) */
  readonly goalMap: Record<string, { label: string; labelAr: string; icon: string; gradient: string; accentColor: string; level: 1 | 2 }> = {
    'explain-it':   { label: 'Explain It',    labelAr: 'اشرح',         icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)', accentColor: '#F59E0B', level: 1 },
    'script-it':    { label: 'Script It',     labelAr: 'اكتب نصًا',     icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', accentColor: '#3B82F6', level: 1 },
    'test-it':      { label: 'Test It',       labelAr: 'اختبر',         icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', gradient: 'linear-gradient(135deg, #10B981, #3B82F6)', accentColor: '#10B981', level: 1 },
    'video-clip':   { label: 'Video Clip',    labelAr: 'مقطع فيديو',    icon: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', gradient: 'linear-gradient(135deg, #EF4444, #F59E0B)', accentColor: '#EF4444', level: 1 },
    'slides':       { label: 'Slides',        labelAr: 'شرائح',         icon: 'M2 3h20v14H2z M2 7h20 M8 21h8 M12 17v4', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', accentColor: '#F59E0B', level: 1 },
    'full-course':  { label: 'Full Course',   labelAr: 'دورة كاملة',   icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)', accentColor: '#8B5CF6', level: 2 },
    'video-course': { label: 'Video Course',  labelAr: 'دورة فيديو',   icon: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)', accentColor: '#EC4899', level: 2 },
    'learn-kit':    { label: 'Learn Kit',     labelAr: 'حزمة تعلم',     icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)', accentColor: '#06B6D4', level: 2 },
  };

  allHistory: ProjectCard[] = [
    {
      id: 'proj-1',
      title: 'Complete Python Programming Course',
      goalId: 'full-course',
      prompt: 'Generate a full course on Python programming from basics to advanced topics',
      date: new Date(2026, 5, 18, 8, 0),
      image: ''
    },
    {
      id: 'inst-1',
      title: 'Introduction to Machine Learning',
      goalId: 'script-it',
      prompt: 'Create a detailed script about introduction to machine learning for beginners',
      date: new Date(2026, 5, 17, 14, 30),
      image: ''
    },
    {
      id: 'proj-2',
      title: 'Digital Marketing Masterclass',
      goalId: 'full-course',
      prompt: 'Generate a full course script for Digital Marketing covering SEO, SEM, and social media',
      date: new Date(2026, 5, 17, 12, 0),
      image: ''
    },
    {
      id: 'proj-3',
      title: 'Chemistry Lab Safety Training',
      goalId: 'video-course',
      prompt: 'Convert the chemistry lab safety manual into an engaging video lesson series',
      date: new Date(2026, 5, 16, 15, 30),
      image: ''
    },
    {
      id: 'inst-2',
      title: 'DNA Explainer Video',
      goalId: 'video-clip',
      prompt: 'Generate an explainer video about DNA structure and replication',
      date: new Date(2026, 5, 16, 9, 15),
      image: ''
    },
    {
      id: 'inst-3',
      title: 'Physics Assessment Quiz',
      goalId: 'test-it',
      prompt: 'Build a comprehensive assessment quiz for high school physics covering Newton\'s laws',
      date: new Date(2026, 5, 15, 11, 0),
      image: ''
    },
    {
      id: 'inst-4',
      title: 'World History Topics',
      goalId: 'explain-it',
      prompt: 'Explore the topic of Ancient Roman civilization and its impact on modern society',
      date: new Date(2026, 5, 14, 16, 45),
      image: ''
    },
    {
      id: 'inst-5',
      title: 'Team Building Activities',
      goalId: 'learn-kit',
      prompt: 'Design interactive team building activities for remote learning environments',
      date: new Date(2026, 5, 13, 10, 20),
      image: ''
    },
    {
      id: 'inst-6',
      title: 'Quantum Computing Basics',
      goalId: 'script-it',
      prompt: 'Write a script explaining quantum computing concepts for university students',
      date: new Date(2026, 5, 12, 13, 0),
      image: ''
    },
    {
      id: 'proj-4',
      title: 'Leadership Skills Workshop',
      goalId: 'full-course',
      prompt: 'Create comprehensive content for a leadership skills development workshop',
      date: new Date(2026, 5, 12, 9, 0),
      image: ''
    },
    {
      id: 'inst-7',
      title: 'Spanish for Beginners',
      goalId: 'learn-kit',
      prompt: 'Design interactive learning activities for Spanish vocabulary and grammar',
      date: new Date(2026, 5, 11, 15, 30),
      image: ''
    },
    {
      id: 'proj-5',
      title: 'Data Science Bootcamp',
      goalId: 'full-course',
      prompt: 'Build a complete data science bootcamp curriculum with hands-on projects',
      date: new Date(2026, 5, 10, 10, 0),
      image: ''
    },
    {
      id: 'inst-8',
      title: 'Biology Lab Safety',
      goalId: 'video-clip',
      prompt: 'Create a safety training video for biology laboratory procedures',
      date: new Date(2026, 5, 10, 9, 0),
      image: ''
    },
    {
      id: 'inst-9',
      title: 'Algebra Quiz Set',
      goalId: 'test-it',
      prompt: 'Generate a set of algebra quizzes for 8th grade students with increasing difficulty',
      date: new Date(2026, 5, 9, 11, 45),
      image: ''
    },
    {
      id: 'proj-6',
      title: 'UX Design Fundamentals',
      goalId: 'video-course',
      prompt: 'Create a full course script for UX design principles and user research methods',
      date: new Date(2026, 5, 8, 14, 30),
      image: ''
    },
    {
      id: 'inst-10',
      title: 'Climate Change Overview',
      goalId: 'explain-it',
      prompt: 'Explore the topic of climate change causes, effects, and solutions',
      date: new Date(2026, 5, 8, 14, 0),
      image: ''
    },
    {
      id: 'inst-11',
      title: 'Creative Writing Workshop',
      goalId: 'learn-kit',
      prompt: 'Create engaging creative writing activities for high school English class',
      date: new Date(2026, 5, 7, 10, 30),
      image: ''
    },
    {
      id: 'inst-12',
      title: 'Solar System Presentation',
      goalId: 'slides',
      prompt: 'Create an animated slide presentation about the solar system',
      date: new Date(2026, 5, 6, 16, 0),
      image: ''
    },
    {
      id: 'proj-7',
      title: 'Photography Masterclass',
      goalId: 'full-course',
      prompt: 'Generate comprehensive course content for photography from composition to post-processing',
      date: new Date(2026, 5, 5, 11, 0),
      image: ''
    },
    {
      id: 'proj-8',
      title: 'Personal Finance 101',
      goalId: 'video-course',
      prompt: 'Draft a complete course script on personal finance, budgeting, and investing basics',
      date: new Date(2026, 5, 3, 9, 0),
      image: ''
    },
    {
      id: 'proj-9',
      title: 'Web Development Full Stack',
      goalId: 'full-course',
      prompt: 'Build a full-stack web development course covering HTML, CSS, JS, Node.js, and React',
      date: new Date(2026, 5, 1, 8, 0),
      image: ''
    }
  ];

  selectedFilterGoal = signal<string>('All');
  isFilterDropdownOpen = signal(false);

  readonly availableFilters = computed(() => {
    const goalIds = new Set(this.allHistory.map(h => h.goalId));
    const filters: { id: string; label: string }[] = [{ id: 'All', label: this.i18n.currentLang() === 'ar' ? 'الكل' : 'All Goals' }];
    goalIds.forEach(gid => {
      const g = this.goalMap[gid];
      if (g) {
        filters.push({ id: gid, label: this.i18n.currentLang() === 'ar' ? g.labelAr : g.label });
      }
    });
    return filters;
  });

  readonly filteredHistory = computed(() => {
    const filter = this.selectedFilterGoal();
    if (filter === 'All') {
      return this.allHistory;
    }
    return this.allHistory.filter(h => h.goalId === filter);
  });

  readonly visibleHistory = computed(() => {
    return this.filteredHistory().slice(0, this.visibleItemsCount());
  });

  readonly hasMoreItems = computed(() => {
    return this.visibleItemsCount() < this.allHistory.length;
  });

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && this.hasMoreItems() && !this.isLoadingMore()) {
        this.triggerLoadMore();
      }
    }, { rootMargin: '100px' });
    
    setTimeout(() => {
      if (this.scrollTrigger) {
        this.observer?.observe(this.scrollTrigger.nativeElement);
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  triggerLoadMore() {
    this.isLoadingMore.set(true);
    setTimeout(() => {
      this.visibleItemsCount.update(c => c + this.itemsPerPage);
      this.isLoadingMore.set(false);
    }, 1500); // Simulate network delay to show the skeleton
  }

  toggleFilterDropdown(event: Event) {
    event.stopPropagation();
    this.isFilterDropdownOpen.update(v => !v);
  }

  selectFilter(filterId: string, event: Event) {
    event.stopPropagation();
    this.selectedFilterGoal.set(filterId);
    this.isFilterDropdownOpen.set(false);
    this.visibleItemsCount.set(this.itemsPerPage); // Reset pagination on filter change
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isFilterDropdownOpen.set(false);
  }

  getGoalInfo(goalId: string) {
    return this.goalMap[goalId] || { label: goalId, labelAr: goalId, icon: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', accentColor: '#8B5CF6', level: 1 as (1 | 2) };
  }

  getGoalLabel(goalId: string): string {
    const g = this.getGoalInfo(goalId);
    return this.i18n.currentLang() === 'ar' ? g.labelAr : g.label;
  }

  getSelectedFilterLabel(): string {
    const id = this.selectedFilterGoal();
    if (id === 'All') return this.i18n.currentLang() === 'ar' ? 'كل الأهداف' : 'All Goals';
    return this.getGoalLabel(id);
  }

  openProject(card: ProjectCard) {
    const goal = this.getGoalInfo(card.goalId);
    const isProject = goal.level === 2;

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
      this.state.selectedQuickTool.set(card.goalId);
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
