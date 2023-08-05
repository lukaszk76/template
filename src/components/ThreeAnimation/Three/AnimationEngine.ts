import * as THREE from "three";
import {
  Clock,
  DataTexture,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
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

interface MouseI {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  speedX: number;
  speedY: number;
}

export class AnimationEngine {
  private readonly canvas: Element | null;
  private readonly scene: Scene;
  private renderer: WebGLRenderer | undefined;
  private camera: OrthographicCamera | undefined;
  private composer: EffectComposer | undefined;
  private mesh: Mesh<PlaneGeometry, ShaderMaterial> | undefined;
  private clock: Clock;
  private geometry: PlaneGeometry | undefined;
  private mouse: MouseI;
  private readonly imageRatio: number;
  private readonly size: number;
  private readonly fadeFactor: number;
  private initialOffsetFactor: number;
  private readonly mouseOffsetFactor: number;
  private readonly distortionSize: number;
  private dataTexture: DataTexture | undefined;
  private canvasWidth: number | undefined;
  private canvasHeight: number | undefined;

  constructor(id: string, textureFile: string, imageRatio: number) {
    this.size = 64;
    this.fadeFactor = 0.97;
    this.initialOffsetFactor = 20;
    this.mouseOffsetFactor = 50;
    this.distortionSize = 10;
    this.canvas = document.getElementById(id);
    this.scene = new THREE.Scene();
    this.getRenderer();
    this.getCamera();
    this.getComposer();
    this.clock = new THREE.Clock();
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.imageRatio = imageRatio;
    this.mouse = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      speedX: 0,
      speedY: 0,
    };
    this.getDataTexture();
    this.getMesh(textureFile).then(() => {
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

      window.addEventListener("mousemove", (e) => {
        this.onMouseMove(e);
      });

      this.animate();
    });
  }
  private getDataTexture() {
    const textureSize = this.size * this.size;
    const data = new Float32Array(4 * textureSize);

    for (let i = 0; i < textureSize; i++) {
      const stride = i * 4;
      data[stride] = Math.random();
      data[stride + 1] = Math.random();
      data[stride + 2] = 0;
      data[stride + 3] = 0;
    }

    const texture = new THREE.DataTexture(
      data,
      this.size,
      this.size,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    texture.needsUpdate = true;
    this.dataTexture = texture;
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer = renderer;
  }

  private getCamera() {
    const range = 1;
    const camera = new THREE.OrthographicCamera(
      -range / 2,
      range / 2,
      range / 2,
      -range / 2,
      0.1,
      1000,
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 3;
    this.camera = camera;
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

    if (!this.canvas) {
      throw new Error("canvas is not defined");
    }
    const composer = new EffectComposer(this.renderer);
    composer.addPass(new RenderPass(this.scene, this.camera));

    this.composer = composer;
  }

  private async getMesh(textureFile: string) {
    if (!this.geometry) {
      this.getGeometry();
    }
    this.mesh = new THREE.Mesh(
      this.geometry,
      await this.getMaterial(textureFile),
    );
  }
  private updateDataTexture() {
    if (!this.mesh) {
      return;
    }

    const texture = this.mesh.material.uniforms.uDataTexture.value;
    const data = texture.image.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] *= this.fadeFactor;
      data[i + 1] *= this.fadeFactor;
    }

    const x0 = this.mouse.x * this.size;
    const y0 = this.mouse.y * this.size;

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const distanceSquared = (x0 - x) ** 2 + (y0 - y) ** 2;

        if (distanceSquared > this.distortionSize ** 2) continue;

        const distance = Math.sqrt(distanceSquared);
        const factor = (1 - distance / this.distortionSize) ** 2;

        const i = (x + y * this.size) * 4;
        data[i] +=
          this.mouse.speedX * factor * this.mouseOffsetFactor * Math.random();
        data[i + 1] +=
          this.mouse.speedY * factor * this.mouseOffsetFactor * Math.random();
      }
    }

    this.mouse.speedX *= this.fadeFactor;
    this.mouse.speedY *= this.fadeFactor;
    texture.needsUpdate = true;
  }
  private animate() {
    if (!this.renderer || !this.mesh || !this.composer) return;

    this.mesh.material.uniforms.uTime.value = this.clock.getElapsedTime();
    this.mesh.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.updateDataTexture();

    this.composer.render();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  private getGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
  }

  private async getMaterial(textureFile: string) {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: await this.getTexture(textureFile) },
        uDataTexture: {
          value: this.dataTexture,
        },
        resolution: { value: this.getResolution() },
        progress: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
  }

  private async getTexture(textureFile: string) {
    return new THREE.TextureLoader().load(textureFile, (texture) => texture);
  }

  private getResolution() {
    if (!this.canvas) {
      throw new Error("canvas is not defined");
    }

    const parent = this.canvas.parentElement;
    if (!parent) {
      throw new Error("parent is not defined");
    }

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    this.canvasWidth = width;
    this.canvasHeight = height;

    const screenRatio = width / height;
    let a1;
    let a2;
    if (this.imageRatio < screenRatio) {
      a1 = 1;
      a2 = this.imageRatio / screenRatio;
    } else {
      a1 = screenRatio / this.imageRatio;
      a2 = 1;
    }
    return { x: width, y: height, z: a1, w: a2 };
  }
  private onResize() {
    const resolution = this.getResolution();

    // this.camera.aspect = resolution.x / resolution.y;
    // this.camera.updateProjectionMatrix();

    if (!this.mesh) {
      throw new Error("mesh is not defined");
    }

    this.mesh.material.uniforms.resolution.value = resolution;
    this.mesh.material.uniforms.needsUpdate = new THREE.Uniform(true);

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
  onMouseMove(e: MouseEvent) {
    if (!this.canvasWidth || !this.canvasHeight) {
      return;
    }

    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
    this.mouse.x = e.offsetX / this.canvasWidth;
    this.mouse.y = 1 - e.offsetY / this.canvasHeight;
    this.mouse.speedX = this.mouse.x - this.mouse.prevX;
    this.mouse.speedY = this.mouse.y - this.mouse.prevY;
  }
}
