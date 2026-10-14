import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import gsap from 'gsap';

@Component({
  selector: 'app-love-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './love-card.component.html',
  styleUrls: ['./love-card.component.css']
})
export class LoveCardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('glowText') glowText!: ElementRef<HTMLHeadingElement>;

  accepted = signal(false);
  matrixCols = Array(25).fill(0);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private heartMesh!: THREE.Mesh;
  private animationFrameId!: number;

  ngAfterViewInit(): void {
    this.initThreeJS();
  }

  private initThreeJS(): void {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // 3D Heart Geometry
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const geometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    });

    geometry.center();

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.heartMesh = new THREE.Mesh(geometry, material);
    this.heartMesh.rotation.x = Math.PI;
    this.heartMesh.scale.set(0, 0, 0);
    this.scene.add(this.heartMesh);

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  onAnswer(): void {
    this.accepted.set(true);

    setTimeout(() => {
      // Scale to ideal size (1.6) and stay static
      gsap.to(this.heartMesh.scale, {
        x: 1.6,
        y: 1.6,
        z: 1.6,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });

      if (this.glowText) {
        gsap.fromTo(this.glowText.nativeElement,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }
        );
      }
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer?.dispose();
  }
}