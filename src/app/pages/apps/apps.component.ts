import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptStateService } from '../../core/services/prompt-state.service';
import { LocalizationService } from '../../core/services/localization.service';
import { TypewriterService } from '../../core/services/typewriter.service';
import { SuggestionsComponent } from '../home/components/suggestions/suggestions.component';

import { AppTool } from '../../core/models';

@Component({
  selector: 'app-apps',
  standalone: true,
  imports: [SuggestionsComponent],
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.css'
})
export class AppsComponent implements OnInit, OnDestroy {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  private tw = inject(TypewriterService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedTool = signal<AppTool | null>(null);

  private heroWriter!: ReturnType<TypewriterService['create']>;
  protected typedToolName!: ReturnType<TypewriterService['create']>;

  tools: AppTool[] = [
    {
      id: 'Video', slug: 'video',
      label: 'Video',
      desc: 'Generate stunning AI-powered video presentations with avatars and animations',
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M4 6h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accentColor: '#764ba2',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Text Video', slug: 'text-video',
      label: 'Text Video',
      desc: 'Convert text content into engaging video lessons automatically',
      icon: 'M4 4h16v16H4z M12 8v8 M8 12h8',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accentColor: '#f5576c',
      image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Script', slug: 'script',
      label: 'Script',
      desc: 'Create detailed scripts for videos, podcasts, and educational content',
      icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      accentColor: '#4facfe',
      image: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Assessment', slug: 'assessment',
      label: 'Assessment',
      desc: 'Generate comprehensive quizzes, tests, and evaluation materials',
      icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      accentColor: '#38d9a9',
      image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Activity', slug: 'activity',
      label: 'Activity',
      desc: 'Design interactive and engaging learning activities for any subject',
      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      accentColor: '#fa709a',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Topic', slug: 'topic',
      label: 'Topic',
      desc: 'Explore and break down complex topics into digestible learning modules',
      icon: 'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
      gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      accentColor: '#a18cd1',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Slides', slug: 'slides',
      label: 'Slides',
      desc: 'Generate stunning presentation slides automatically.',
      icon: 'M2 3h20v14H2z M2 7h20 M8 21h8 M12 17v4',
      gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      accentColor: '#fda085',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Full Course Script', slug: 'course-script',
      label: 'Course Script',
      desc: 'Generate complete course scripts with structured lessons and modules',
      icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5V4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      accentColor: '#f4845f',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Full Course Content', slug: 'course-content',
      label: 'Course Content',
      desc: 'Build comprehensive course materials with AI-generated content',
      icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
      gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      accentColor: '#66a6ff',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
    }
  ];

  ngOnInit() {
    // Reset state when entering apps page
    this.state.isGenerating.set(false);
    this.state.isAnimatingOut.set(false);

    // Check if we have a toolId in the route
    this.route.paramMap.subscribe(params => {
      const toolSlug = params.get('toolId');
      if (toolSlug) {
        const tool = this.tools.find(t => t.slug === toolSlug);
        if (tool) {
          this.activateTool(tool);
        } else {
          // Invalid tool slug, redirect to apps grid
          this.router.navigate(['/apps']);
        }
      } else {
        // No tool selected, show grid
        this.cleanupWriter();
        this.selectedTool.set(null);
        this.state.selectedQuickTool.set(null);
      }
    });
  }

  selectTool(tool: AppTool) {
    this.router.navigate(['/apps', tool.slug]);
  }

  private activateTool(tool: AppTool) {
    this.cleanupWriter();
    this.selectedTool.set(tool);
    this.state.selectedGoal.set(null);
    this.state.selectedQuickTool.set(tool.id);

    // Create typewriter for the tool name
    this.typedToolName = this.tw.create({
      phrases: [tool.label],
      typingSpeed: 80,
      deletingSpeed: 50,
      delayBetweenPhrases: 4000,
      initialPhrase: '',
      initialCharIndex: 0,
      startDeleting: false
    });
    this.heroWriter = this.typedToolName;
    this.heroWriter.start(300);
  }

  goBack() {
    this.router.navigate(['/apps']);
  }

  private cleanupWriter() {
    if (this.heroWriter) {
      this.heroWriter.destroy();
    }
  }

  ngOnDestroy() {
    this.cleanupWriter();
  }
}
