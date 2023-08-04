import * as THREE from "three";
import {
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  DataTexture,
  BufferGeometry,
  NormalBufferAttributes,
} from "three";
// @ts-ignore
import vertex from "./glsl/vertex.glsl";
// @ts-ignore
import fragment from "./glsl/fragment.glsl";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import VirtualScroll, { VirtualScrollEvent } from "virtual-scroll";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

export class AnimationEngine {
  private shouldAnimate = true;
  private readonly canvas: Element | null;
  private readonly scene: Scene;
  private renderer: WebGLRenderer | undefined;
  private camera: PerspectiveCamera | OrthographicCamera | undefined;
  private composer: EffectComposer | undefined;
  private mesh:
    | Mesh<BufferGeometry<NormalBufferAttributes>, MeshPhysicalMaterial>
    | undefined;
  private geometry: BufferGeometry<NormalBufferAttributes> | undefined;
  private envMap: DataTexture | undefined;
  private virtualScroll: VirtualScroll;
  constructor(id: string, textureFile?: string, color?: number) {
    this.canvas = document.getElementById(id);
    this.scene = new THREE.Scene();
    this.getRenderer();
    this.getCamera();
    this.getComposer();
    this.virtualScroll = new VirtualScroll();
    this.virtualScroll.on(this.handleScroll);

    if (this.camera && this.canvas) {
      const controls = new OrbitControls(
        this.camera,
        this.canvas as HTMLElement,
      );
      controls.enableDamping = false;
      controls.enableZoom = false;
    }

    this.getEnvMap().then((envMap) => {
      this.envMap = envMap;
      this.getMesh(textureFile, color).then((mesh) => {
        this.mesh = mesh;
        this.scene.add(mesh);

        if (!this.camera) {
          throw new Error("camera is not defined");
        }
        this.scene.add(this.camera);

        window.addEventListener("resize", () => {
          this.onResize();
        });

        this.onResize();

        this.animate();
      });
    });
  }

  private handleScroll = (e: VirtualScrollEvent) => {
    if (!this.mesh || e.y <= 0) return;

    this.shouldAnimate = e.y <= 100;

    this.mesh.position.x -= e.deltaY * (this.mesh.position.x / 1000);
    this.mesh.rotation.x -= e.deltaY * (this.mesh.rotation.x / 1000);
    this.mesh.rotation.y -= e.deltaY * (this.mesh.rotation.y / 1000);

    this.mesh.scale.x += e.deltaY * (this.mesh.scale.x / 1000);
    this.mesh.scale.y += e.deltaY * (this.mesh.scale.y / 1000);
    this.mesh.scale.z += e.deltaY * (this.mesh.scale.z / 1000);
  };

  private getNormalMap() {
    // const texture = new THREE.CanvasTexture(new FlakesTexture());
    const texture = new THREE.TextureLoader().load("/normal_map.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    return texture;
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
      throw new Error("Canvas is not defined!");
    }
    const camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      100,
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2;
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

    const RGBPass = new ShaderPass(RGBShiftShader);
    RGBPass.uniforms["amount"].value = 0.0;
    composer.addPass(RGBPass);

    this.composer = composer;
  }

  private async getMesh(textureFile?: string, color?: number) {
    const mesh = new THREE.Mesh(
      await this.getGeometry(),
      await this.getMaterial(textureFile, color),
    );
    mesh.position.set(1.5, 0, 0);

    return mesh;
  }

  private animate() {
    if (!this.renderer || !this.composer || !this.mesh) return;

    this.composer.render();

    if (this.shouldAnimate) {
      this.mesh.rotateY(0.003);
      this.mesh.rotateX(0.002);
    }

    window.requestAnimationFrame(this.animate.bind(this));
  }

  private async getGeometry() {
    const loader = new GLTFLoader();
    const model = await loader.loadAsync("/hexagon.glb");

    const mesh = model.scene.children[0].children[0].children[0].children[0]
      .children[0] as Mesh;

    const geometry = mesh.geometry;
    geometry.scale(0.5, 0.5, 0.1);
    this.geometry = geometry;
    return geometry;
  }

  private async getEnvMap() {
    return new RGBELoader().load("/sky.hdr", (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      return texture;
    });
  }
  private async getMaterial(textureFile?: string, color?: number) {
    return new THREE.MeshPhysicalMaterial({
      map: await this.getTexture(textureFile),
      color: color ?? 0xffffff,
      roughness: 0.3,
      metalness: 0.2,
      transmission: 0.0,
      reflectivity: 0.2,
      thickness: 0.1,
      clearcoat: 0.1,
      clearcoatRoughness: 0.3,
      ior: 1,
      envMap: this.envMap,
      envMapIntensity: 3,
      normalMap: this.getNormalMap(),
      normalScale: new THREE.Vector2(0.1, 0.1),
      normalMapType: 0,
    });
  }

  private async getTexture(textureFile?: string) {
    if (textureFile) {
      return new THREE.TextureLoader().load(textureFile, (texture) => texture);
    }
    return undefined;
  }

  private getResolution() {
    if (!this.canvas) {
      throw new Error("Canvas is not defined!");
    }
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    return { x: width, y: height };
  }
  private onResize() {
    const resolution = this.getResolution();

    if (this.camera) {
      if (!(this.camera instanceof OrthographicCamera)) {
        this.camera.aspect = resolution.x / resolution.y;
      }
      this.camera.updateProjectionMatrix();
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
