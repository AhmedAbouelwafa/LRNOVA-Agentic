import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';
import { Goal } from '../../../../core/models';

@Component({
  selector: 'app-agent-selector',
  standalone: true,
  templateUrl: './agent-selector.component.html',
  styleUrl: './agent-selector.component.css'
})
export class AgentSelectorComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  private router = inject(Router);

  activeGoalId = signal<string | null>(null);
  hoveredGoal = signal<Goal | null>(null);
  hoverCardStyle = signal<{ left: string; top: string }>({ left: '0px', top: '0px' });
  isHoverMultiTool = signal(false);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('wrapperEl') wrapperEl!: ElementRef<HTMLDivElement>;

  scrollLeft(event: Event) {
    event.stopPropagation();
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -250, behavior: 'smooth' });
    }
  }

  scrollRight(event: Event) {
    event.stopPropagation();
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 250, behavior: 'smooth' });
    }
  }

  onGoalHover(goal: Goal, event: MouseEvent) {
    this.hoveredGoal.set(goal);
    this.isHoverMultiTool.set(goal.level === 2);
    const btn = event.currentTarget as HTMLElement;
    const wrapper = this.wrapperEl?.nativeElement;
    if (wrapper) {
      const btnRect = btn.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      this.hoverCardStyle.set({
        left: (btnRect.left + btnRect.width / 2 - wrapperRect.left) + 'px',
        top: (btnRect.bottom - wrapperRect.top + 10) + 'px'
      });
    }
  }

  onGoalLeave() {
    this.hoveredGoal.set(null);
  }

  readonly goals: Goal[] = [
    {
      id: 'explain-it',
      slug: 'explain-it',
      label: 'Explain It',
      description: 'Generate a focused AI-powered topic explanation.',
      icon: 'lightbulb',
      level: 1,
      gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
      accentColor: '#F59E0B',
      pipeline: [{ toolId: 'Topic Explainer', tabLabel: 'Topic', order: 1 }],
      estimatedTime: '~2 min'
    },
    {
      id: 'script-it',
      slug: 'script-it',
      label: 'Script It',
      description: 'Create professional scripts and written content in minutes.',
      icon: 'pen',
      level: 1,
      gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
      accentColor: '#3B82F6',
      pipeline: [{ toolId: 'Script Generator', tabLabel: 'Script', order: 1 }],
      estimatedTime: '~3 min'
    },
    {
      id: 'test-it',
      slug: 'test-it',
      label: 'Test It',
      description: 'Build quizzes and assessments to evaluate learner knowledge.',
      icon: 'clipboard-check',
      level: 1,
      gradient: 'linear-gradient(135deg, #10B981, #3B82F6)',
      accentColor: '#10B981',
      pipeline: [{ toolId: 'Assessment', tabLabel: 'Assessment', order: 1 }],
      estimatedTime: '~3 min'
    },
    {
      id: 'video-clip',
      slug: 'video-clip',
      label: 'Video Clip',
      description: 'Create an AI avatar video lesson instantly.',
      icon: 'video',
      level: 1,
      gradient: 'linear-gradient(135deg, #EF4444, #F59E0B)',
      accentColor: '#EF4444',
      pipeline: [{ toolId: 'Video Avatar', tabLabel: 'Video', order: 1 }],
      estimatedTime: '~5 min'
    },
    {
      id: 'full-course',
      slug: 'full-course',
      label: 'Full Course',
      description: 'Complete learning package: Script, Content, Activities and Assessment.',
      icon: 'layers',
      level: 2,
      gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
      accentColor: '#8B5CF6',
      pipeline: [
        { toolId: 'Script', tabLabel: 'Script', order: 1 },
        { toolId: 'Course Content', tabLabel: 'Content', order: 2 },
        { toolId: 'Activity', tabLabel: 'Activity', order: 3 },
        { toolId: 'Assessment', tabLabel: 'Assessment', order: 4 }
      ],
      estimatedTime: '~15 min'
    },
    {
      id: 'video-course',
      slug: 'video-course',
      label: 'Video Course',
      description: 'Script writing, AI Avatar Video and Assessment in one seamless flow.',
      icon: 'film',
      level: 2,
      gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
      accentColor: '#EC4899',
      pipeline: [
        { toolId: 'Script', tabLabel: 'Script', order: 1 },
        { toolId: 'Video Avatar', tabLabel: 'Video', order: 2 },
        { toolId: 'Assessment', tabLabel: 'Assessment', order: 3 }
      ],
      estimatedTime: '~12 min'
    },
    {
      id: 'learn-kit',
      slug: 'learn-kit',
      label: 'Learn Kit',
      description: 'Topic Overview, Course Content, Activities and a final Quiz in one kit.',
      icon: 'book',
      level: 2,
      gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
      accentColor: '#06B6D4',
      pipeline: [
        { toolId: 'Topic', tabLabel: 'Topic', order: 1 },
        { toolId: 'Course Content', tabLabel: 'Content', order: 2 },
        { toolId: 'Activity', tabLabel: 'Activity', order: 3 },
        { toolId: 'Assessment', tabLabel: 'Assessment', order: 4 }
      ],
      estimatedTime: '~10 min'
    }
  ];

  readonly goalLabelAr: Record<string, string> = {
    'explain-it': 'اشرح',
    'script-it': 'اكتب نصًا',
    'test-it': 'اختبر',
    'video-clip': 'مقطع فيديو',
    'full-course': 'دورة كاملة',
    'video-course': 'دورة فيديو',
    'learn-kit': 'حزمة تعلم'
  };

  selectGoal(goal: Goal, event: Event) {
    event.stopPropagation();
    this.activeGoalId.set(goal.id);
    this.state.activeGoalLevel.set(goal.level);
    this.state.selectedGoal.set(goal);
    // Note: this sets selectedGoal but not selectedQuickTool
  }

  isGoalActive(goal: Goal): boolean {
    return this.activeGoalId() === goal.id;
  }

  selectLevel(level: 1 | 2, event: Event) {
    event.stopPropagation();
    this.state.activeGoalLevel.set(level);
  }
}
