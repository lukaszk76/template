import * as THREE from "three";
import {
  BufferGeometry,
  Clock,
  NormalBufferAttributes,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
// @ts-ignore
import vertex from "./glsl/vertex.glsl";
// @ts-ignore
import fragment from "./glsl/fragment.glsl";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CustomShader } from "./CustomShader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class AnimationEngine {
  private readonly canvas: Element | null;
  private readonly scene: Scene;
  private renderer: WebGLRenderer | undefined;
  private camera: PerspectiveCamera | undefined;
  private composer: EffectComposer | undefined;
  private mesh: Points<BufferGeometry<NormalBufferAttributes>, ShaderMaterial>;
  private clock: Clock;
  private geometry: BufferGeometry<NormalBufferAttributes> | undefined;
  private controls: OrbitControls | undefined;
  private positions: Float32Array | undefined;
  private randoms: Float32Array | undefined;
  private sizes: Float32Array | undefined;
  constructor(id: string) {
    this.canvas = document.getElementById(id);
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    this.getRenderer();
    this.getCamera();
    this.getComposer();
    this.addOrbitControls();
    this.getGeometry();
    this.getMesh();

    if (!this.mesh) {
      throw new Error("mesh is not defined");
    }
    this.scene.add(this.mesh);

    if (!this.camera) {
      throw new Error("camera is not defined");
    }
    this.scene.add(this.camera);

    window.addEventListener("resize", () => {
      this.onResize();
    });

    this.onResize();
    this.animate();
  }

  private getRenderer() {
    if (!this.canvas) {
      throw new Error("canvas is not defined");
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer = renderer;
  }

  private getCamera() {
    if (!this.canvas) {
      throw new Error("canvas is not defined");
    }

    const range = 1;
    const camera = new THREE.PerspectiveCamera(
      2 * Math.atan(range / 2 / 3) * (180 / Math.PI),
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 10;
    this.camera = camera;
    this.controls?.update();
  }

  private addOrbitControls() {
    if (!this.renderer) {
      throw new Error("renderer is not defined");
    }
    if (!this.camera) {
      throw new Error("camera is not defined");
    }
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 0.2;
    controls.maxDistance = 100.0;
    controls.target.set(0, 0, 0);
    this.controls = controls;
  }
  private getComposer() {
    if (!this.renderer) {
      throw new Error("renderer is not defined");
    }
    if (!this.scene) {
      throw new Error("scene is not defined");
    }
    if (!this.camera) {
      throw new Error("camera is not defined");
    }
    const composer = new EffectComposer(this.renderer);
    composer.addPass(new RenderPass(this.scene, this.camera));

    const customShader = new ShaderPass(CustomShader);
    composer.addPass(customShader);

    this.composer = composer;
  }

  private getMesh() {
    this.mesh = new THREE.Points(this.geometry, this.getMaterial());
    this.mesh.position.x = 0;
    this.mesh.position.y = 0;
    this.mesh.position.z = 0;
  }

  private animate() {
    if (!this.renderer || !this.mesh || !this.composer) return;

    this.mesh.material.uniforms.uTime.value = this.clock.getElapsedTime();
    this.mesh.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.controls?.update();

    this.composer.render();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  private getGeometry() {
    const number = 10000;
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(number * 3);
    this.randoms = new Float32Array(number * 3);
    this.sizes = new Float32Array(number);

    for (let i = 0; i < number * 3; i += 3) {
      this.positions[i] = Math.random() - 0.5;
      this.positions[i + 1] = Math.random() - 0.5;
      this.positions[i + 2] = Math.random() - 0.5;
      this.randoms[i] = Math.random();
      this.randoms[i + 1] = Math.random();
      this.randoms[i + 2] = Math.random();
      this.sizes[i] = 0.5 + 0.5 * Math.random();
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3),
    );
    this.geometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(this.randoms, 3),
    );
    this.geometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(this.sizes, 1),
    );
  }

  private getMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
  }

  private getResolution() {
    if (!this.canvas?.parentElement) {
      throw new Error("canvas is not defined");
    }
    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight;

    return { x: width, y: height };
  }
  private onResize() {
    const resolution = this.getResolution();

    if (this.camera) {
      this.camera.aspect = resolution.x / resolution.y;
      this.camera.updateProjectionMatrix();
    }

    if (!this.mesh) {
      throw new Error("mesh is not defined");
    }

    if (!this.renderer) {
      throw new Error("renderer is not defined");
    }
    this.renderer.setSize(resolution.x, resolution.y);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (!this.composer) {
      throw new Error("composer is not defined");
    }
    this.composer.setSize(resolution.x, resolution.y);
  }
}
