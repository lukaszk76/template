import * as THREE from "three";
import {
  BufferGeometry,
  Clock,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  TubeGeometry,
  WebGLRenderer,
} from "three";

import normals from "/sphere_normal.png";
import dots from "/dust.jpeg";
import stripes from "/stripes.jpeg";
import noise from "/noise1.jpg";

// @ts-ignore
import vertex from "./glsl/vertex.glsl";
// @ts-ignore
import fragment from "./glsl/fragment.glsl";
// @ts-ignore
import vertexTube from "./glsl/vertexTube.glsl";
// @ts-ignore
import fragmentTube from "./glsl/fragmentTube.glsl";
// @ts-ignore
import vertexRays from "./glsl/vertexRays.glsl";
// @ts-ignore
import fragmentRays from "./glsl/fragmentRays.glsl";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import gsap from "gsap";
import { ClearPass } from "three/examples/jsm/postprocessing/ClearPass";

interface MouseI {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  speedX: number;
  speedY: number;
}

interface CameraTargetI {
  x: number;
  y: number;
}

export class AnimationEngine {
  private mouse: MouseI;
  private readonly canvas: Element | null;
  private readonly scene: Scene;
  private renderer: WebGLRenderer | undefined;
  private camera: PerspectiveCamera | undefined;
  private composer: EffectComposer | undefined;
  private readonly pointsMesh1:
    | Points<BufferGeometry, ShaderMaterial>
    | undefined;
  private readonly pointsMesh2:
    | Points<BufferGeometry, ShaderMaterial>
    | undefined;
  private readonly pointsMesh3:
    | Points<BufferGeometry, ShaderMaterial>
    | undefined;
  private readonly pointsMesh4:
    | Points<BufferGeometry, ShaderMaterial>
    | undefined;
  private readonly pointsMesh5:
    | Points<BufferGeometry, ShaderMaterial>
    | undefined;
  private clock: Clock;
  private previousScrollProgress: number;
  private readonly tubeMesh1: Mesh<TubeGeometry, ShaderMaterial> | undefined;
  private readonly tubeMesh2: Mesh<TubeGeometry, ShaderMaterial> | undefined;
  private readonly tubeMesh3: Mesh<TubeGeometry, ShaderMaterial> | undefined;
  private readonly tubeMesh4: Mesh<TubeGeometry, ShaderMaterial> | undefined;
  private readonly tubeMesh5: Mesh<TubeGeometry, ShaderMaterial> | undefined;

  private cameraTarget: CameraTargetI;
  private readonly raysMesh: Mesh<PlaneGeometry, ShaderMaterial>;
  constructor(id: string) {
    this.canvas = document.getElementById(id);
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.previousScrollProgress = 0;
    this.getRenderer();
    this.getCamera();
    this.getComposer();

    this.mouse = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      speedX: 0,
      speedY: 0,
    };
    this.cameraTarget = {
      x: 0,
      y: 0,
    };

    const { pointsMesh, tubeMesh } = this.getCurve(
      new THREE.Vector3(0, 0, 2),
      new THREE.Vector3(0, 0, 0),
      0.3,
      new THREE.Vector3(0.482, 0.491, 0.422),
      new THREE.Vector3(0.913, 0.237, 0.256),
      new THREE.Vector3(0.482, 0.491, 0.422),
      new THREE.Vector3(0.913, 0.237, 0.256),
    );

    this.pointsMesh1 = pointsMesh;
    this.tubeMesh1 = tubeMesh;

    const { pointsMesh: pointsMesh2, tubeMesh: tubeMesh2 } = this.getCurve(
      new THREE.Vector3(2, -1, 0),
      new THREE.Vector3(-1, -2, 0),
      0.2,
      new THREE.Vector3(0.913, 0.237, 0.256),
      new THREE.Vector3(0.482, 0.491, 0.422),
      new THREE.Vector3(0.913, 0.237, 0.256),
      new THREE.Vector3(0.482, 0.491, 0.422),
    );

    this.pointsMesh2 = pointsMesh2;
    this.tubeMesh2 = tubeMesh2;

    const { pointsMesh: pointsMesh3, tubeMesh: tubeMesh3 } = this.getCurve(
      new THREE.Vector3(-2, 1, 0),
      new THREE.Vector3(2, 3, 1),
      0.05,
      new THREE.Vector3(0.482, 0.491, 0.422),
      new THREE.Vector3(0.913, 0.237, 0.256),
      new THREE.Vector3(0.913, 0.237, 0.256),
      new THREE.Vector3(0.482, 0.491, 0.422),
    );

    this.pointsMesh3 = pointsMesh3;
    this.tubeMesh3 = tubeMesh3;

    const { pointsMesh: pointsMesh4, tubeMesh: tubeMesh4 } = this.getCurve(
      new THREE.Vector3(1, 1.5, 0),
      new THREE.Vector3(-2, -1, -1),
      0.03,
      new THREE.Vector3(0.913, 0.237, 0.256),
      new THREE.Vector3(0.482, 0.491, 0.422),
      new THREE.Vector3(0.482, 0.491, 0.422),
      new THREE.Vector3(0.913, 0.237, 0.256),
    );

    this.pointsMesh4 = pointsMesh4;
    this.tubeMesh4 = tubeMesh4;

    const { pointsMesh: pointsMesh5, tubeMesh: tubeMesh5 } = this.getCurve(
      new THREE.Vector3(3, -1.5, 0),
      new THREE.Vector3(1, 2, 1),
      0.02,
      new THREE.Vector3(0.482, 0.491, 0.422),
      new THREE.Vector3(0.913, 0.237, 0.256),
      new THREE.Vector3(0.913, 0.237, 0.256),
      new THREE.Vector3(0.482, 0.491, 0.422),
    );

    this.pointsMesh5 = pointsMesh5;
    this.tubeMesh5 = tubeMesh5;

    this.raysMesh = this.getRaysMesh();

    this.scene.add(this.pointsMesh1);
    this.scene.add(this.pointsMesh2);
    this.scene.add(this.pointsMesh3);
    this.scene.add(this.pointsMesh4);
    this.scene.add(this.pointsMesh5);
    this.scene.add(this.tubeMesh1);
    this.scene.add(this.tubeMesh2);
    this.scene.add(this.tubeMesh3);
    this.scene.add(this.tubeMesh4);
    this.scene.add(this.tubeMesh5);
    this.scene.add(this.raysMesh);

    if (!this.camera) {
      throw new Error("camera is not defined");
    }
    this.scene.add(this.camera);

    window.addEventListener("resize", () => {
      this.onResize();
    });
    window.addEventListener("scroll", () => {
      this.onScroll();
    });

    if (this.canvas?.parentElement) {
      this.canvas.parentElement.addEventListener("mousemove", (e) => {
        this.onMouseMove(e);
      });
    }

    this.onResize();
    this.animate();
    this.entryAnimation();
  }

  private entryAnimation() {
    if (!this.camera) {
      throw new Error("camera is not defined");
    }
    gsap.from(this.camera.position, {
      duration: 2,
      x: 0,
      y: 0,
      z: 100,
      ease: "power3.out",
    });
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.canvas) {
      return;
    }

    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
    this.mouse.x = e.offsetX / this.canvas.clientWidth;
    this.mouse.y = 1 - e.offsetY / this.canvas.clientHeight;
    this.mouse.speedX = this.mouse.x - this.mouse.prevX;
    this.mouse.speedY = this.mouse.y - this.mouse.prevY;

    this.cameraTarget.x = this.mouse.x * 4 - 2;
    this.cameraTarget.y = this.mouse.y * 2 - 1;
  }

  private moveCamera() {
    if (!this.camera) {
      throw new Error("camera is not defined");
    }

    this.camera.position.x +=
      (this.cameraTarget.x - this.camera.position.x) * 0.05;
    this.camera.position.y +=
      (this.cameraTarget.y - this.camera.position.y) * 0.05;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  private onScroll() {
    if (!this.camera) {
      throw new Error("camera is not defined");
    }
    const scroll = window.scrollY;
    const height = window.innerHeight;
    const offset = this.canvas?.getBoundingClientRect().top ?? 0;
    const scrollProgress = scroll / (offset + height);
    const scrollDelta = scrollProgress - this.previousScrollProgress;
    this.previousScrollProgress = scrollProgress;

    this.camera.position.x += 10 * scrollDelta;
    this.camera.position.y += 0.7 * scrollDelta * 10;
    this.camera.position.z += 0.5 * scrollDelta * 10;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
  }

  private getRaysMesh() {
    const geometry = new THREE.PlaneGeometry(8, 5, 1, 1);
    const material = this.getRaysMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 5;

    return mesh;
  }

  private getRaysMaterial() {
    const texture = new THREE.TextureLoader().load(noise, (texture) => texture);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        resolution: { value: new THREE.Vector4() },
        progress: { value: 1 },
      },
      vertexShader: vertexRays,
      fragmentShader: fragmentRays,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
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

    const params = {
      clearColor: 0x868a77,
      clearAlpha: 0.05,
    };

    const composer = new EffectComposer(this.renderer);

    const clearPass = new ClearPass(params.clearColor, params.clearAlpha);
    composer.addPass(clearPass);

    const renderPass = new RenderPass(this.scene, this.camera);
    renderPass.clear = false;
    composer.addPass(renderPass);

    this.composer = composer;
  }

  private getMesh(
    position: THREE.Vector3,
    rotation: THREE.Vector3,
    color1: THREE.Vector3,
    color2: THREE.Vector3,
    radius = 0.3,
  ) {
    const geometry = this.getGeometry(position);
    const material = this.getMaterial(color1, color2, radius);

    const pointsMesh = new THREE.Points(geometry, material);
    pointsMesh.position.x = position.x;
    pointsMesh.position.y = position.y;
    pointsMesh.position.z = position.z;

    pointsMesh.rotation.x = rotation.x;
    pointsMesh.rotation.y = rotation.y;
    pointsMesh.rotation.z = rotation.z;

    return pointsMesh;
  }

  private animate() {
    if (
      !this.renderer ||
      !this.pointsMesh1 ||
      !this.pointsMesh2 ||
      !this.pointsMesh3 ||
      !this.pointsMesh4 ||
      !this.pointsMesh5 ||
      !this.composer ||
      !this.tubeMesh1 ||
      !this.tubeMesh2 ||
      !this.tubeMesh3 ||
      !this.tubeMesh4 ||
      !this.tubeMesh5
    )
      return;
    const time = this.clock.getElapsedTime();

    this.pointsMesh1.material.uniforms.uTime.value = time;
    this.pointsMesh1.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.pointsMesh2.material.uniforms.uTime.value = time;
    this.pointsMesh2.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.pointsMesh3.material.uniforms.uTime.value = time;
    this.pointsMesh3.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.pointsMesh4.material.uniforms.uTime.value = time;
    this.pointsMesh4.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.pointsMesh5.material.uniforms.uTime.value = time;
    this.pointsMesh5.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.tubeMesh1.material.uniforms.uTime.value = time;
    this.tubeMesh1.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.tubeMesh2.material.uniforms.uTime.value = time;
    this.tubeMesh2.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.tubeMesh3.material.uniforms.uTime.value = time;
    this.tubeMesh3.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.tubeMesh4.material.uniforms.uTime.value = time;
    this.tubeMesh4.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.tubeMesh5.material.uniforms.uTime.value = time;
    this.tubeMesh5.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.raysMesh.material.uniforms.uTime.value = time;
    this.raysMesh.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.moveCamera();

    this.composer.render();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  private getTubeMaterial(
    color1: THREE.Vector3,
    color2: THREE.Vector3,
    dotsTextureFile: string,
    stripesTextureFile: string,
  ) {
    const dotsTexture = new THREE.TextureLoader().load(dotsTextureFile);
    const stripesTexture = new THREE.TextureLoader().load(stripesTextureFile);
    dotsTexture.wrapS = THREE.RepeatWrapping;
    dotsTexture.wrapT = THREE.RepeatWrapping;
    stripesTexture.wrapS = THREE.RepeatWrapping;
    stripesTexture.wrapT = THREE.RepeatWrapping;

    return new THREE.ShaderMaterial({
      extensions: {
        // @ts-ignore
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 1 },
        uDots: { value: dotsTexture },
        uStripes: { value: stripesTexture },
        uColor1: { value: new THREE.Color(color1.x, color1.y, color1.z) },
        uColor2: { value: new THREE.Color(color2.x, color2.y, color2.z) },
      },
      vertexShader: vertexTube,
      fragmentShader: fragmentTube,
      transparent: true,
      depthTest: false,
    });
  }

  private getTube(
    position: THREE.Vector3,
    rotation: THREE.Vector3,
    color1: THREE.Vector3,
    color2: THREE.Vector3,
    dotsTextureFile: string,
    stripesTextureFile: string,
    radius = 0.3,
  ) {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      const x = Math.sin(angle) + 2 * Math.sin(angle * 2);
      const y = Math.cos(angle) - 2 * Math.cos(angle * 2);
      const z = -Math.sin(angle * 3);
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeometry = new THREE.TubeGeometry(curve, 100, radius, 100, true);
    const tubeMaterial = this.getTubeMaterial(
      color1,
      color2,
      dotsTextureFile,
      stripesTextureFile,
    );

    const mesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;

    mesh.rotation.x = rotation.x;
    mesh.rotation.y = rotation.y;
    mesh.rotation.z = rotation.z;

    return mesh;
  }

  private getCurve(
    position: THREE.Vector3,
    rotation: THREE.Vector3,
    radius = 0.3,
    color1: THREE.Vector3,
    color2: THREE.Vector3,
    colorTube1: THREE.Vector3,
    colorTube2: THREE.Vector3,
  ) {
    const pointsMesh = this.getMesh(position, rotation, color1, color2, radius);
    const tubeMesh = this.getTube(
      position,
      rotation,
      colorTube1,
      colorTube2,
      dots,
      stripes,
      radius,
    );

    return { pointsMesh, tubeMesh };
  }
  private getGeometry(position: THREE.Vector3) {
    const number = 10000;
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(number * 3);
    const randoms = new Float32Array(number * 3);
    const sizes = new Float32Array(number);

    for (let i = 0; i < number * 3; i += 3) {
      positions[i] = Math.random() - 0.5 + position.x;
      positions[i + 1] = Math.random() - 0.5 + position.y;
      positions[i + 2] = Math.random() - 0.5 + position.z;
      randoms[i] = Math.random();
      randoms[i + 1] = Math.random();
      randoms[i + 2] = Math.random();
      sizes[i] = 0.5 + 0.5 * Math.random();
    }

    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    pointsGeometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(randoms, 3),
    );
    pointsGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    return pointsGeometry;
  }

  private getMaterial(
    color1: THREE.Vector3,
    color2: THREE.Vector3,
    radius = 0.3,
  ) {
    return new THREE.ShaderMaterial({
      extensions: {
        // @ts-ignore
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 1 },
        uNormals: { value: new THREE.TextureLoader().load(normals) },
        uRadius: { value: radius },
        uColor1: { value: new THREE.Color(color1.x, color1.y, color1.z) },
        uColor2: { value: new THREE.Color(color2.x, color2.y, color2.z) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: true,
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
