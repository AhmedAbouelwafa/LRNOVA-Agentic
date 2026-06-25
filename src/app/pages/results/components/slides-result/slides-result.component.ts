import { Component, inject, signal, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PromptStateService } from '../../../../core/services/prompt-state.service';

@Component({
  selector: 'app-slides-result',
  standalone: true,
  templateUrl: './slides-result.component.html',
  styleUrl: './slides-result.component.css'
})
export class SlidesResultComponent implements OnInit {
  protected state = inject(PromptStateService);
  private sanitizer = inject(DomSanitizer);
  protected isRevealed = signal(false);

  /** Google Slides embed URL — a real public presentation for demo purposes */
  protected slidesEmbedUrl: SafeResourceUrl;

  constructor() {
    this.slidesEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://docs.google.com/presentation/d/e/2PACX-1vTCMriqJXpvPz-KdJpPHVqRkY3rAKFBZ-Wfn-NrWIYRw3GtLgCaL1k2b-wqHixLr2-_0L-vZjQI7B9/embed?start=false&loop=false&delayms=3000'
    );
  }

  ngOnInit() {
    setTimeout(() => this.isRevealed.set(true), 300);
  }
}
