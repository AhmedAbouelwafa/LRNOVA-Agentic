import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-script-review-canvas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './script-review-canvas.component.html',
  styleUrl: './script-review-canvas.component.css'
})
export class ScriptReviewCanvasComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);

  /** Editable script text */
  editableScript = signal<string>('');

  /** Whether the user is in edit mode */
  isEditingScript = signal<boolean>(false);

  /** Whether the script has been approved (show read-only view) */
  isApproved = signal<boolean>(false);

  /** Reveal animation */
  isRevealed = signal(false);

  /** Expose Math for template usage */
  protected Math = Math;

  constructor() {
    effect(() => {
      const review = this.state.activeScriptReview();
      if (review && review.questionnaire?.scriptContent) {
        setTimeout(() => {
          this.editableScript.set(review.questionnaire!.scriptContent!);
          this.isApproved.set(false);
        }, 0);
      }
    });

    // Watch for approved script — when set, show read-only approved state
    effect(() => {
      const approved = this.state.approvedScript();
      if (approved && !this.state.activeScriptReview()) {
        setTimeout(() => {
          this.editableScript.set(approved);
          this.isApproved.set(true);
          this.isEditingScript.set(false);
        }, 0);
      }
    });
  }

  ngOnInit() {
    setTimeout(() => this.isRevealed.set(true), 200);
  }

  toggleScriptEdit() {
    this.isEditingScript.update(v => !v);
  }

  approveScript() {
    const review = this.state.activeScriptReview();
    if (!review) return;

    const finalScript = this.editableScript().trim();
    if (!finalScript) return;

    this.state.approveScript(review.id, finalScript);
    this.isEditingScript.set(false);
    this.isApproved.set(true);
  }
}
