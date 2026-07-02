import { Component, inject, ViewChild, ElementRef, effect, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';
import { PromptFieldComponent } from '../../../home/components/prompt-field/prompt-field.component';
import { QuestionnairePanelComponent } from '../questionnaire-panel/questionnaire-panel.component';

@Component({
  selector: 'app-agentic-chat',
  standalone: true,
  imports: [
    DatePipe,
    PromptFieldComponent,
    QuestionnairePanelComponent
  ],
  templateUrl: './agentic-chat.component.html',
  styleUrl: './agentic-chat.component.css'
})
export class AgenticChatComponent { // two-state layout
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  
  @Input() isCollapsed = false;
  @Input() centered = false;
  @Output() isCollapsedChange = new EventEmitter<boolean>();
  
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  constructor() {
    effect(() => {
      this.state.chatHistory();
      this.state.isGenerationComplete();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  toggleCollapse(value: boolean) {
    this.isCollapsed = value;
    this.isCollapsedChange.emit(this.isCollapsed);
  }

  private scrollToBottom(): void {
    try {
      if (this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
}
