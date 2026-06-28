import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PromptStateService } from '../../../../core/services/prompt-state.service';

interface AvatarOption {
  id: number;
  label: string;
  image: string;
  isCustom?: boolean;
}

interface AudioOption {
  id: number;
  label: string;
  audio: string;
  isCustom?: boolean;
}

@Component({
  selector: 'app-video-avatar-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './video-avatar-dialog.component.html',
  styleUrl: './video-avatar-dialog.component.css'
})
export class VideoAvatarDialogComponent {
  protected state = inject(PromptStateService);
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<{
    script: string;
    avatar: AvatarOption | null;
    audio: AudioOption | null;
  }>();

  activeTab = signal<'script' | 'avatars' | 'audio'>('script');

  scriptText = signal('');

  selectedAvatar = signal<AvatarOption | null>(null);
  selectedAudio = signal<AudioOption | null>(null);

  activeAudioUrl = signal<string | null>(null);
  private audioPlayer: HTMLAudioElement | null = null;

  customAvatars = signal<AvatarOption[]>([]);
  customAudios = signal<AudioOption[]>([]);

  readonly defaultAvatars: AvatarOption[] = [
    { id: 1, label: 'Male Professional', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=300&q=80' },
    { id: 2, label: 'Female Professional', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
    { id: 3, label: 'Casual Male', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { id: 4, label: 'Casual Female', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' },
    { id: 5, label: 'Creative Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { id: 6, label: 'Tech Expert', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' }
  ];

  readonly defaultAudios: AudioOption[] = [
    { id: 1, label: 'English - Male (Deep)', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 2, label: 'English - Female (Clear)', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 3, label: 'Arabic - Male', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: 4, label: 'Arabic - Female', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { id: 5, label: 'Spanish - Male', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { id: 6, label: 'French - Female', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' }
  ];

  setTab(tab: 'script' | 'avatars' | 'audio') {
    this.activeTab.set(tab);
  }

  selectAvatar(avatar: AvatarOption) {
    this.selectedAvatar.set(avatar);
  }

  selectAudio(audio: AudioOption) {
    this.selectedAudio.set(audio);
  }

  playAudio(url: string, event: Event) {
    event.stopPropagation();

    if (this.activeAudioUrl() === url && this.audioPlayer) {
      this.audioPlayer.pause();
      this.activeAudioUrl.set(null);
      return;
    }

    if (this.audioPlayer) {
      this.audioPlayer.pause();
    }

    this.audioPlayer = new Audio(url);
    this.audioPlayer.play();
    this.activeAudioUrl.set(url);

    this.audioPlayer.onended = () => {
      this.activeAudioUrl.set(null);
    };
  }

  onAvatarFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const url = URL.createObjectURL(file);
      const newAvatar: AvatarOption = {
        id: Date.now(),
        label: file.name.replace(/\.[^/.]+$/, ''),
        image: url,
        isCustom: true
      };
      this.customAvatars.update(list => [...list, newAvatar]);
      this.selectedAvatar.set(newAvatar);
      input.value = '';
    }
  }

  onAudioFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const url = URL.createObjectURL(file);
      const newAudio: AudioOption = {
        id: Date.now(),
        label: file.name.replace(/\.[^/.]+$/, ''),
        audio: url,
        isCustom: true
      };
      this.customAudios.update(list => [...list, newAudio]);
      this.selectedAudio.set(newAudio);
      input.value = '';
    }
  }

  removeCustomAvatar(avatar: AvatarOption, event: Event) {
    event.stopPropagation();
    this.customAvatars.update(list => list.filter(a => a.id !== avatar.id));
    if (this.selectedAvatar()?.id === avatar.id) {
      this.selectedAvatar.set(null);
    }
    URL.revokeObjectURL(avatar.image);
  }

  removeCustomAudio(audio: AudioOption, event: Event) {
    event.stopPropagation();
    this.customAudios.update(list => list.filter(a => a.id !== audio.id));
    if (this.selectedAudio()?.id === audio.id) {
      this.selectedAudio.set(null);
    }
    URL.revokeObjectURL(audio.audio);
  }

  close() {
    this.stopAudio();
    this.closed.emit();
  }

  generate() {
    this.stopAudio();
    this.confirmed.emit({
      script: this.scriptText(),
      avatar: this.selectedAvatar(),
      audio: this.selectedAudio()
    });
  }

  private stopAudio() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer = null;
      this.activeAudioUrl.set(null);
    }
  }

  get canGenerate(): boolean {
    return this.scriptText().trim().length > 0 &&
           this.selectedAvatar() !== null &&
           this.selectedAudio() !== null;
  }
}
