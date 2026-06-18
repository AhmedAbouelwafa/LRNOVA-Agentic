import { Component, inject, output } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
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

  tools = [
    { 
      id: 'Video', label: 'Video', desc: 'Generate a video presentation',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 'Text Video', label: 'Text Video', desc: 'Convert text to a video lesson',
      image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 'Script', label: 'Script', desc: 'Create a detailed script',
      image: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 'Assessment', label: 'Assessment', desc: 'Generate quizzes and tests',
      image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 'Activity', label: 'Activity', desc: 'Interactive learning activities',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 'Topic', label: 'Topic', desc: 'Explore specific topics',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 'Full Course Script', label: 'Course Script', desc: 'Generate a full course script',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 'Full Course Content', label: 'Course Content', desc: 'Generate full course content',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80'
    }
  ];

  selectTool(toolId: string) {
    this.state.selectedQuickTool.set(toolId);
    this.toolSelected.emit();
  }
}
