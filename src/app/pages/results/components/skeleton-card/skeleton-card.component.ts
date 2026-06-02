import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  template: `
    <div class="result-card-skeleton glass-card">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-title-lines">
          <div class="skeleton-line w-40"></div>
          <div class="skeleton-line w-60"></div>
        </div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line w-80"></div>
      </div>
      <div class="skeleton-gallery">
        <div class="skeleton-img"></div>
        <div class="skeleton-img"></div>
        <div class="skeleton-img"></div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .glass-card {
      background: rgba(255, 255, 255, 0.28); border: 1px solid rgba(255, 255, 255, 0.65);
      border-radius: 24px; padding: 40px;
      box-shadow: 0 10px 40px rgba(139, 92, 246, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.5), inset 0 -1px 1px rgba(0, 0, 0, 0.02);
      backdrop-filter: blur(35px) saturate(1.7); -webkit-backdrop-filter: blur(35px) saturate(1.7);
    }
    .result-card-skeleton { display: flex; flex-direction: column; gap: 24px; }
    .skeleton-header { display: flex; align-items: center; gap: 16px; }
    .skeleton-avatar {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.07) 50%, rgba(0,0,0,0.04) 75%);
      background-size: 200% 100%; animation: shimmer 2s infinite;
    }
    .skeleton-title-lines { display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .skeleton-line {
      height: 12px; border-radius: 6px;
      background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.07) 50%, rgba(0,0,0,0.04) 75%);
      background-size: 200% 100%; animation: shimmer 2s infinite;
    }
    .w-40 { width: 40%; } .w-60 { width: 60%; } .w-80 { width: 80%; }
    .skeleton-content { display: flex; flex-direction: column; gap: 12px; }
    .skeleton-gallery { display: flex; gap: 16px; margin-top: 16px; }
    .skeleton-img {
      width: 140px; height: 90px; border-radius: 12px;
      background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.07) 50%, rgba(0,0,0,0.04) 75%);
      background-size: 200% 100%; animation: shimmer 2s infinite;
    }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `]
})
export class SkeletonCardComponent {}
