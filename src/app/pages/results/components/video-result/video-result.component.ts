import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
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
  private ngZone = inject(NgZone);

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer') videoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('progressFill') progressFill!: ElementRef<HTMLDivElement>;
  @ViewChild('currentTimeDisplay') currentTimeDisplay!: ElementRef<HTMLSpanElement>;
  @ViewChild('durationDisplay') durationDisplay!: ElementRef<HTMLSpanElement>;

  // Video Player State
  isPlaying = signal(false);
  isMuted = signal(false);
  volume = signal(1);
  isFullscreen = signal(false);

  private timeUpdateHandler!: () => void;
  private durationChangeHandler!: () => void;
  private endHandler!: () => void;
  private fullscreenChangeHandler!: () => void;

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

  ngAfterViewInit() {
    const video = this.videoPlayer.nativeElement;
    
    this.timeUpdateHandler = () => {
      if (this.currentTimeDisplay) {
        this.currentTimeDisplay.nativeElement.innerText = this.formatTime(video.currentTime);
      }
      if (video.duration && this.progressFill) {
        const percent = (video.currentTime / video.duration) * 100;
        this.progressFill.nativeElement.style.width = `${percent}%`;
      }
    };
    
    this.durationChangeHandler = () => {
      if (this.durationDisplay) {
        this.durationDisplay.nativeElement.innerText = this.formatTime(video.duration);
      }
    };

    this.endHandler = () => {
      this.isPlaying.set(false);
    };

    const playHandler = () => this.ngZone.run(() => this.isPlaying.set(true));
    const pauseHandler = () => this.ngZone.run(() => this.isPlaying.set(false));
    
    this.fullscreenChangeHandler = () => {
      this.ngZone.run(() => {
        this.isFullscreen.set(!!document.fullscreenElement || !!(document as any).webkitFullscreenElement);
      });
    };

    this.ngZone.runOutsideAngular(() => {
      video.addEventListener('timeupdate', this.timeUpdateHandler);
      video.addEventListener('loadedmetadata', this.durationChangeHandler);
      video.addEventListener('ended', this.endHandler);
      video.addEventListener('play', playHandler);
      video.addEventListener('pause', pauseHandler);
      document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);
      document.addEventListener('webkitfullscreenchange', this.fullscreenChangeHandler);
    });
    
    // Cleanup handlers will need to remove these too
    (this as any)._playHandler = playHandler;
    (this as any)._pauseHandler = pauseHandler;

    // Check initial mute state if browser muted autoplay
    this.isMuted.set(video.muted);
  }

  ngOnDestroy() {
    if (this.videoPlayer) {
      const video = this.videoPlayer.nativeElement;
      video.removeEventListener('timeupdate', this.timeUpdateHandler);
      video.removeEventListener('loadedmetadata', this.durationChangeHandler);
      video.removeEventListener('ended', this.endHandler);
      if ((this as any)._playHandler) {
        video.removeEventListener('play', (this as any)._playHandler);
        video.removeEventListener('pause', (this as any)._pauseHandler);
      }
      document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange', this.fullscreenChangeHandler);
    }
  }

  togglePlay() {
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying.set(true);
    } else {
      video.pause();
      this.isPlaying.set(false);
    }
  }

  skip(seconds: number) {
    const video = this.videoPlayer.nativeElement;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), video.duration || 0);
  }

  togglePiP() {
    const video = this.videoPlayer.nativeElement;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(console.error);
    } else if (document.pictureInPictureEnabled) {
      video.requestPictureInPicture().catch(console.error);
    }
  }

  toggleMute() {
    const video = this.videoPlayer.nativeElement;
    video.muted = !video.muted;
    this.isMuted.set(video.muted);
    if (!video.muted && video.volume === 0) {
      video.volume = 1;
      this.volume.set(1);
    }
  }

  setVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    const val = parseFloat(input.value);
    const video = this.videoPlayer.nativeElement;
    video.volume = val;
    this.volume.set(val);
    if (val === 0) {
      video.muted = true;
      this.isMuted.set(true);
    } else {
      video.muted = false;
      this.isMuted.set(false);
    }
  }

  seekVideo(event: MouseEvent, progressBar: HTMLElement) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    const video = this.videoPlayer.nativeElement;
    if (video.duration) {
      video.currentTime = pos * video.duration;
    }
  }

  toggleFullscreen() {
    const container = this.videoContainer.nativeElement as any;
    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch((err: any) => console.log(err));
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  }
}
