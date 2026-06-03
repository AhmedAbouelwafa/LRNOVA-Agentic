import { Component, inject } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-results-toolbar',
  standalone: true,
  templateUrl: './results-toolbar.component.html',
  styleUrl: './results-toolbar.component.css'
})
export class ResultsToolbarComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);

  translateTool(tool: string): string {
    const toolMap: Record<string, string> = {
      'Course Content': 'results.tool.courseContent',
      'Script': 'results.tool.script',
      'Assessment': 'results.tool.assessment',
      'Topic': 'results.tool.topic',
      'Activity': 'results.tool.activity',
      'Video Avatar': 'results.tool.videoAvatar',
      'Scorm Video': 'results.tool.scormVideo',
    };
    const key = toolMap[tool];
    return key ? this.i18n.t(key) : tool;
  }
}
