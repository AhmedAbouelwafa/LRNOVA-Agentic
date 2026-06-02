import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { TypewriterService } from '../../../../core/services/typewriter.service';

@Component({
  selector: 'app-prompt-field',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './prompt-field.component.html',
  styleUrl: './prompt-field.component.css'
})
export class PromptFieldComponent implements OnInit, OnDestroy {
  protected state = inject(PromptStateService);
  private tw = inject(TypewriterService);
  private placeholderWriter!: ReturnType<TypewriterService['create']>;

  private defaultPhrases = [
    'Describe what you want to create...',
    'Try: "A 5-minute video on DNA"',
    'Try: "A full course about Python"'
  ];
  private videoPhrases = [
    'Describe the video you want...',
    'Try: "Explain Quantum Physics"',
    'Try: "A historical documentary on Rome"'
  ];
  private textPhrases = [
    'Describe the course or script...',
    'Try: "A lesson plan for Algebra"',
    'Try: "A 10-question quiz on Biology"'
  ];

  protected typedPlaceholder!: ReturnType<TypewriterService['create']>;

  ngOnInit() {
    this.typedPlaceholder = this.tw.create({
      phrases: this.defaultPhrases,
      typingSpeed: 60,
      deletingSpeed: 30,
      delayBetweenPhrases: 2500
    });
    this.placeholderWriter = this.typedPlaceholder;
    this.placeholderWriter.start(3000);
  }

  ngOnDestroy() {
    this.placeholderWriter.destroy();
  }

  onAgentChanged() {
    const agent = this.state.activeAgent();
    if (agent === 'video') {
      this.placeholderWriter.updatePhrases(this.videoPhrases);
    } else if (agent === 'text') {
      this.placeholderWriter.updatePhrases(this.textPhrases);
    } else {
      this.placeholderWriter.updatePhrases(this.defaultPhrases);
    }
  }

  onSubmit() {
    this.state.submitPrompt();
  }

  onTogglePlan(event: Event) {
    this.state.togglePlan(event);
  }
}
