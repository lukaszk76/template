import * as THREE from "three";
import {
  DirectionalLight,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  PerspectiveCamera,
  OrthographicCamera,
  Raycaster,
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
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
  private camera: PerspectiveCamera | OrthographicCamera | undefined;
  private composer: EffectComposer | undefined;
  private raycaster: Raycaster;
  private mesh:
    | Mesh<BufferGeometry<NormalBufferAttributes>, MeshPhysicalMaterial>
    | undefined;
  private geometry: BufferGeometry<NormalBufferAttributes> | undefined;
  private mouse: MouseI;
  private previouslySelectedObject: Object3D<THREE.Event> | null;
  private light: DirectionalLight | undefined;
  private envMap: DataTexture | undefined;
  constructor(id: string, textureFile?: string, color?: number) {
    this.canvas = document.getElementById(id);
    this.scene = new THREE.Scene();
    this.getRenderer();
    this.getCamera();
    this.getComposer();
    this.getLight();
    this.raycaster = new THREE.Raycaster();
    this.previouslySelectedObject = null;

    if (this.camera && this.canvas) {
      const controls = new OrbitControls(
        this.camera,
        this.canvas as HTMLElement,
      );
      controls.enableDamping = false;
      controls.enableZoom = false;
    }

    this.mouse = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      speedX: 0,
      speedY: 0,
    };

    this.getEnvMap().then((envMap) => {
      this.envMap = envMap;
      this.getMesh(textureFile, color).then((mesh) => {
        this.mesh = mesh;
        this.scene.add(mesh);

        if (!this.camera) {
          throw new Error("camera is not defined");
        }
        this.scene.add(this.camera);

        // if (!this.light) {
        //   throw new Error("light is not defined");
        // }
        // this.scene.add(this.light);

        window.addEventListener("resize", () => {
          this.onResize();
        });

        this.onResize();

        window.addEventListener("mousemove", (e) => {
          this.onMouseMove(e);
        });

        this.animate();
      });
    });
  }

  private getNormalMap() {
    const texture = new THREE.CanvasTexture(new FlakesTexture());
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 6);
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
    camera.position.z = 1.2;
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

    // const customShader = new ShaderPass(CustomShader);
    // composer.addPass(customShader);

    this.composer = composer;
  }

  private async getMesh(textureFile?: string, color?: number) {
    const mesh = new THREE.Mesh(
      await this.getGeometry(),
      await this.getMaterial(textureFile, color),
    );
    mesh.position.set(0, 0, 0);

    return mesh;
  }

  private animate() {
    if (!this.renderer || !this.composer || !this.mesh) return;

    this.composer.render();

    this.mesh.rotateY(0.005 * (Math.random() - 0.2));
    this.mesh.rotateX(0.002 * Math.random());

    window.requestAnimationFrame(this.animate.bind(this));
  }

  private async getGeometry() {
    // this.geometry = new THREE.DodecahedronGeometry(0.5, 0);
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
      transmission: 0.8,
      reflectivity: 0.3,
      thickness: 0.1,
      clearcoat: 0.1,
      clearcoatRoughness: 0.3,
      ior: 1,
      envMap: this.envMap,
      envMapIntensity: 3,
      normalMap: this.getNormalMap(),
      normalScale: new THREE.Vector2(0.2, 0.2),
    });
  }

  private async getTexture(textureFile?: string) {
    if (textureFile) {
      return new THREE.TextureLoader().load(textureFile, (texture) => texture);
    }
    return undefined;
  }

  private getLight() {
    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(3, 1, 5);
    this.light = light;
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
  onMouseMove(e: MouseEvent) {
    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
    this.mouse.x = e.clientX / window.innerWidth;
    this.mouse.y = 1 - e.clientY / window.innerHeight;
    this.mouse.speedX = this.mouse.x - this.mouse.prevX;
    this.mouse.speedY = this.mouse.y - this.mouse.prevY;
  }

  checkIntersection() {
    if (!this.camera) {
      return;
    }

    this.raycaster.setFromCamera(
      new THREE.Vector2(this.mouse.x, this.mouse.y),
      this.camera,
    );

    const intersects = this.raycaster.intersectObject(this.scene, true);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      if (
        !this.previouslySelectedObject ||
        selectedObject.name !== this.previouslySelectedObject.name
      ) {
        this.previouslySelectedObject = selectedObject;
        console.log(selectedObject);
      }
    } else {
      if (this.previouslySelectedObject) {
        console.log(this.previouslySelectedObject);
        this.previouslySelectedObject = null;
      }
    }
  }
}
