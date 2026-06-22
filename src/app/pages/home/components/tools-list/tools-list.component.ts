import { Component, inject, output, computed } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { Goal } from '../../../../core/models';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-tools-list',
  standalone: true,
  templateUrl: './tools-list.component.html',
  styleUrl: './tools-list.component.css'
})
export class ToolsListComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  toolSelected = output<void>();

  allGoals: Goal[] = [
    // ── Level 1: Quick Goals (single tool) ──
    {
      id: 'explain-it', slug: 'explain-it',
      label: 'Explain It', description: 'Get a clear visual explanation of any concept',
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M4 6h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z',
      level: 1,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accentColor: '#764ba2',
      pipeline: [{ toolId: 'Video', tabLabel: 'Video Explanation', order: 1 }],
      estimatedTime: '~1 min'
    },
    {
      id: 'write-it', slug: 'write-it',
      label: 'Write It', description: 'Generate a well-structured written lesson',
      icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
      level: 1,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      accentColor: '#4facfe',
      pipeline: [{ toolId: 'Script', tabLabel: 'Written Lesson', order: 1 }],
      estimatedTime: '~1 min'
    },
    {
      id: 'test-it', slug: 'test-it',
      label: 'Test It', description: 'Create quizzes to assess understanding',
      icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
      level: 1,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      accentColor: '#38d9a9',
      pipeline: [{ toolId: 'Assessment', tabLabel: 'Quiz', order: 1 }],
      estimatedTime: '~1 min'
    },

    // ── Level 2: Project Goals (2-5 tools) ──
    {
      id: 'learn-it', slug: 'learn-it',
      label: 'Learn It', description: 'Full understanding package: read, watch, then test',
      icon: 'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
      level: 2,
      gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      accentColor: '#a18cd1',
      pipeline: [
        { toolId: 'Script', tabLabel: 'Script', order: 1 },
        { toolId: 'Video', tabLabel: 'Video', order: 2 },
        { toolId: 'Assessment', tabLabel: 'Quiz', order: 3 }
      ],
      estimatedTime: '~3 min'
    },
    {
      id: 'teach-it', slug: 'teach-it',
      label: 'Teach It', description: 'Everything a teacher needs to deliver a class',
      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8',
      level: 2,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      accentColor: '#fa709a',
      pipeline: [
        { toolId: 'Topic', tabLabel: 'Outline', order: 1 },
        { toolId: 'Script', tabLabel: 'Script', order: 2 },
        { toolId: 'Activity', tabLabel: 'Activity', order: 3 }
      ],
      estimatedTime: '~3 min'
    },
    {
      id: 'explore-it', slug: 'explore-it',
      label: 'Explore It', description: 'Research-level topic exploration with visual support',
      icon: 'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35',
      level: 2,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accentColor: '#f5576c',
      pipeline: [
        { toolId: 'Topic', tabLabel: 'Breakdown', order: 1 },
        { toolId: 'Script', tabLabel: 'Script', order: 2 },
        { toolId: 'Text Video', tabLabel: 'Video', order: 3 }
      ],
      estimatedTime: '~4 min'
    },

    // (Level 2 continuation - previously Level 3)
    {
      id: 'course-it', slug: 'course-it',
      label: 'Course It', description: 'End-to-end course creation with all materials',
      icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
      level: 2,
      gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      accentColor: '#66a6ff',
      pipeline: [
        { toolId: 'Topic', tabLabel: 'Outline', order: 1 },
        { toolId: 'Full Course Script', tabLabel: 'Script', order: 2 },
        { toolId: 'Full Course Content', tabLabel: 'Content', order: 3 },
        { toolId: 'Assessment', tabLabel: 'Quiz', order: 4 },
        { toolId: 'Video', tabLabel: 'Intro Video', order: 5 }
      ],
      estimatedTime: '~8 min'
    },
    {
      id: 'train-it', slug: 'train-it',
      label: 'Train It', description: 'Complete professional training program',
      icon: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M8.5 7a4 4 0 100-8 4 4 0 000 8 M20 8v6 M23 11h-6',
      level: 2,
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      accentColor: '#f4845f',
      pipeline: [
        { toolId: 'Topic', tabLabel: 'Overview', order: 1 },
        { toolId: 'Script', tabLabel: 'Script', order: 2 },
        { toolId: 'Video', tabLabel: 'Video', order: 3 },
        { toolId: 'Activity', tabLabel: 'Activities', order: 4 },
        { toolId: 'Assessment', tabLabel: 'Evaluation', order: 5 }
      ],
      estimatedTime: '~10 min'
    },
    {
      id: 'study-it', slug: 'study-it',
      label: 'Study It', description: 'Complete self-study package for any subject',
      icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5V4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z',
      level: 2,
      gradient: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
      accentColor: '#8B5CF6',
      pipeline: [
        { toolId: 'Topic', tabLabel: 'Topics', order: 1 },
        { toolId: 'Script', tabLabel: 'Notes', order: 2 },
        { toolId: 'Text Video', tabLabel: 'Videos', order: 3 },
        { toolId: 'Assessment', tabLabel: 'Quizzes', order: 4 },
        { toolId: 'Activity', tabLabel: 'Practice', order: 5 }
      ],
      estimatedTime: '~10 min'
    }
  ];

  readonly filteredGoals = computed(() => {
    const level = this.state.activeGoalLevel();
    return this.allGoals.filter(g => g.level === level);
  });

  selectGoal(goal: Goal) {
    this.state.selectedGoal.set(goal);
    this.state.selectedQuickTool.set(goal.label);
    this.toolSelected.emit();
  }
}
