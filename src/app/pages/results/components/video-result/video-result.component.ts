import { Component, inject, signal } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-video-result',
  standalone: true,
  templateUrl: './video-result.component.html',
  styleUrl: './video-result.component.css'
})
export class VideoResultComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);

  // Avatar selection
  readonly avatars = [
    { id: 'sofia', name: 'Sofia', img: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sofia&backgroundColor=b6e3f4' },
    { id: 'marcus', name: 'Marcus', img: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus&backgroundColor=ffd5dc' },
    { id: 'aria', name: 'Aria', img: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aria&backgroundColor=d1d4f9' },
    { id: 'omar', name: 'Omar', img: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Omar&backgroundColor=c0aede' },
    { id: 'lina', name: 'Lina', img: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Lina&backgroundColor=ffd5dc' },
    { id: 'alex', name: 'Alex', img: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4' },
  ];
  readonly selectedAvatar = signal('sofia');

  // Audio / Voice
  readonly voices = [
    { id: 'natural-female', label: 'Natural Female', lang: 'EN' },
    { id: 'natural-male', label: 'Natural Male', lang: 'EN' },
    { id: 'professional', label: 'Professional', lang: 'EN' },
    { id: 'arabic-female', label: 'Arabic Female', lang: 'AR' },
    { id: 'arabic-male', label: 'Arabic Male', lang: 'AR' },
  ];
  readonly selectedVoice = signal('natural-female');

  // Video settings
  readonly resolutions = ['720p HD', '1080p UHD'];
  readonly selectedResolution = signal('1080p UHD');

  readonly durations = ['1 min', '2 min', '3 min', '5 min'];
  readonly selectedDuration = signal('3 min');

  // Panel state
  readonly activePanel = signal<'avatar' | 'audio' | 'settings' | null>(null);

  // Edit mode toggle (no editor UI, just state)
  readonly isEditMode = signal(false);

  // Toolbar expansion state
  readonly isToolbarExpanded = signal(false);

  togglePanel(panel: 'avatar' | 'audio' | 'settings') {
    if (this.activePanel() === panel) {
      this.activePanel.set(null);
    } else {
      this.activePanel.set(panel);
    }
  }

  toggleEditMode() {
    this.isEditMode.update(v => !v);
  }

  toggleToolbar() {
    if (this.isToolbarExpanded()) {
      this.isToolbarExpanded.set(false);
      this.activePanel.set(null);
    } else {
      this.isToolbarExpanded.set(true);
    }
  }

  selectAvatar(id: string) {
    this.selectedAvatar.set(id);
  }

  selectVoice(id: string) {
    this.selectedVoice.set(id);
  }

  regenerate() {
    // Reset and re-trigger generation
    this.state.isGenerationComplete.set(false);
    this.state.loadingText.set('Regenerating with new settings...');

    let msgIndex = 0;
    const msgs = ['Applying avatar...', 'Rendering video...', 'Processing audio...', 'Finalizing...'];
    const interval = setInterval(() => {
      if (msgIndex < msgs.length) {
        this.state.loadingText.set(msgs[msgIndex]);
        msgIndex++;
      } else {
        clearInterval(interval);
        this.state.isGenerationComplete.set(true);
      }
    }, 1800);
  }
}
