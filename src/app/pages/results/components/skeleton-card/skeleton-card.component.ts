import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  template: `
    <div class="canvas-workspace">
      <!-- Top Pills Row -->
      <div class="workspace-top-row">
        <div class="pill-panel pill-sm"></div>
        <div class="pill-panel pill-md"></div>
        <div class="pill-panel pill-sm"></div>
      </div>

      <div class="workspace-main">
        <!-- Left Sidebar -->
        <div class="sidebar-left">
          <div class="sidebar-block tall"></div>
          <div class="sidebar-block short"></div>
        </div>

        <!-- Central Canvas -->
        <div class="central-canvas">
          <div class="canvas-loading-state">
            <div class="wireframe-spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-ring inner"></div>
              <svg class="spinner-logo" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <span class="loading-label">Generating workspace...</span>
          </div>
        </div>

        <!-- Right Panels -->
        <div class="sidebar-right">
          <div class="right-block square"></div>
          <div class="right-block square"></div>
          <div class="right-block rect"></div>
        </div>
      </div>

      <!-- Bottom Pills Row -->
      <div class="workspace-bottom-row">
        <div class="pill-panel pill-lg"></div>
        <div class="pill-panel pill-md"></div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .canvas-workspace {
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-top: none;
      border-radius: 0 0 14px 14px;
      padding: 14px;
      min-height: 520px;
    }

    /* Top & Bottom Pill Rows */
    .workspace-top-row, .workspace-bottom-row {
      display: flex;
      gap: 10px;
    }
    .pill-panel {
      height: 36px;
      border-radius: 18px;
      background: #F3F4F6;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }
    .pill-sm { flex: 1; }
    .pill-md { flex: 2; }
    .pill-lg { flex: 3; }

    /* Main 3-Column Layout */
    .workspace-main {
      flex: 1;
      display: flex;
      gap: 10px;
    }

    /* Left Sidebar */
    .sidebar-left {
      width: 80px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex-shrink: 0;
    }
    .sidebar-block {
      border-radius: 12px;
      background: #F3F4F6;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }
    .sidebar-block.tall { flex: 3; }
    .sidebar-block.short { flex: 1; }

    /* Central Canvas */
    .central-canvas {
      flex: 1;
      border-radius: 14px;
      background: #FAFBFC;
      border: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .central-canvas::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.03) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Loading State */
    .canvas-loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      z-index: 1;
    }
    .wireframe-spinner {
      position: relative;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .spinner-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1.5px solid rgba(0, 0, 0, 0.06);
      border-top-color: rgba(139, 92, 246, 0.5);
      animation: canvasSpin 2s linear infinite;
    }
    .spinner-ring.inner {
      inset: 8px;
      border-top-color: rgba(99, 102, 241, 0.35);
      animation-duration: 3s;
      animation-direction: reverse;
    }
    .spinner-logo {
      color: rgba(0, 0, 0, 0.15);
      animation: logoPulse 3s ease-in-out infinite;
    }
    .loading-label {
      font-size: 0.78rem;
      color: #9CA3AF;
      font-weight: 500;
      letter-spacing: 0.02em;
      animation: labelPulse 2.5s ease-in-out infinite;
    }

    /* Right Sidebar */
    .sidebar-right {
      width: 120px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex-shrink: 0;
    }
    .right-block {
      border-radius: 12px;
      background: #F3F4F6;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }
    .right-block.square { flex: 1; }
    .right-block.rect { flex: 1.2; }

    /* Animations */
    @keyframes canvasSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes logoPulse {
      0%, 100% { opacity: 0.15; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(1.05); }
    }
    @keyframes labelPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 0.9; }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar-left { width: 50px; }
      .sidebar-right { width: 70px; }
      .canvas-workspace { min-height: 360px; }
    }
    @media (max-width: 480px) {
      .sidebar-left, .sidebar-right { display: none; }
      .workspace-top-row, .workspace-bottom-row { display: none; }
      .canvas-workspace { min-height: 280px; padding: 10px; }
    }
  `]
})
export class SkeletonCardComponent {}
