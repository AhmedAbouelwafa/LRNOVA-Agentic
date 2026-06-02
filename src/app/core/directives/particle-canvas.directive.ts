import { Directive, ElementRef, AfterViewInit, OnDestroy, inject } from '@angular/core';

@Directive({
  selector: '[appParticleCanvas]',
  standalone: true
})
export class ParticleCanvasDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLCanvasElement>);

  private particles: Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; hue: number;
  }> = [];
  private animationId = 0;
  private mouseX = -1000;
  private mouseY = -1000;
  private resizeHandler!: () => void;
  private mouseMoveHandler!: (e: MouseEvent) => void;

  ngAfterViewInit() {
    this.initParticles();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  private initParticles() {
    const canvas = this.el.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);

    this.mouseMoveHandler = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };
    window.addEventListener('mousemove', this.mouseMoveHandler);

    // Create particles
    for (let i = 0; i < 120; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 1.0,
        opacity: Math.random() * 0.2,
        hue: Math.random() > 0.5 ? 270 : 200,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach((p, i) => {
        // Mouse interaction — gentle push
        const dx = p.x - this.mouseX;
        const dy = p.y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx += dx * 0.00008;
          p.vy += dy * 0.00008;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 55%, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(260, 70%, 50%, ${0.4 * (1 - d / 150)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }
}
