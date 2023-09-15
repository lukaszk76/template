import * as THREE from "three";
import {
  BufferGeometry,
  Clock,
  Mesh,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  TubeGeometry,
  WebGLRenderer,
} from "three";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CustomShader } from "./CustomShader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import normals from "/sphere_normal.png";
import dots from "/dust.jpeg";
import stripes from "/stripes.jpeg";

// @ts-ignore
import vertex from "./glsl/vertex.glsl";
// @ts-ignore
import fragment from "./glsl/fragment.glsl";
// @ts-ignore
import vertexTube from "./glsl/vertexTube.glsl";
// @ts-ignore
import fragmentTube from "./glsl/fragmentTube.glsl";

export class AnimationEngine {
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
  private clock: Clock;
  private controls: OrbitControls | undefined;
  private previousScrollProgress: number;
  private readonly tubeMesh1: Mesh<TubeGeometry, ShaderMaterial> | undefined;
  private readonly tubeMesh2: Mesh<TubeGeometry, ShaderMaterial> | undefined;
  private readonly tubeMesh3: Mesh<TubeGeometry, ShaderMaterial> | undefined;
  constructor(id: string) {
    this.canvas = document.getElementById(id);
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.previousScrollProgress = 0;
    this.getRenderer();
    this.getCamera();
    this.getComposer();
    this.addOrbitControls();

    const { pointsMesh, tubeMesh } = this.getCurve(
      new THREE.Vector3(0, 0, 2),
      new THREE.Vector3(0, 0, 0),
      0.3,
    );

    this.pointsMesh1 = pointsMesh;
    this.tubeMesh1 = tubeMesh;

    const { pointsMesh: pointsMesh2, tubeMesh: tubeMesh2 } = this.getCurve(
      new THREE.Vector3(2, -1, -1),
      new THREE.Vector3(-1, -2, 0),
      0.2,
    );

    this.pointsMesh2 = pointsMesh2;
    this.tubeMesh2 = tubeMesh2;

    const { pointsMesh: pointsMesh3, tubeMesh: tubeMesh3 } = this.getCurve(
      new THREE.Vector3(-2, 1, -1),
      new THREE.Vector3(2, 3, 1),
      0.05,
    );

    this.pointsMesh3 = pointsMesh3;
    this.tubeMesh3 = tubeMesh3;

    if (!this.pointsMesh1) {
      throw new Error("mesh1 is not defined");
    }
    this.scene.add(this.pointsMesh1);

    if (!this.pointsMesh2) {
      throw new Error("mesh2 is not defined");
    }
    this.scene.add(this.pointsMesh2);

    if (!this.pointsMesh3) {
      throw new Error("mesh3 is not defined");
    }
    this.scene.add(this.pointsMesh3);

    if (!this.tubeMesh1) {
      throw new Error("tube1 is not defined");
    }
    this.scene.add(this.tubeMesh1);

    if (!this.tubeMesh2) {
      throw new Error("tube2 is not defined");
    }
    this.scene.add(this.tubeMesh2);

    if (!this.tubeMesh3) {
      throw new Error("tube3 is not defined");
    }
    this.scene.add(this.tubeMesh3);

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

    this.onResize();
    this.animate();
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
    controls.enableZoom = false;
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

  private getMesh(
    position: THREE.Vector3,
    rotation: THREE.Vector3,
    vertexShader: string,
    fragmentShader: string,
    radius = 0.3,
  ) {
    const geometry = this.getGeometry(position);
    const material = this.getMaterial(vertexShader, fragmentShader, radius);

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
      !this.composer ||
      !this.tubeMesh1 ||
      !this.tubeMesh2 ||
      !this.tubeMesh3
    )
      return;

    this.pointsMesh1.material.uniforms.uTime.value =
      this.clock.getElapsedTime();
    this.pointsMesh1.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.pointsMesh2.material.uniforms.uTime.value =
      this.clock.getElapsedTime();
    this.pointsMesh2.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.pointsMesh3.material.uniforms.uTime.value =
      this.clock.getElapsedTime();
    this.pointsMesh3.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.tubeMesh1.material.uniforms.uTime.value = this.clock.getElapsedTime();
    this.tubeMesh1.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.tubeMesh2.material.uniforms.uTime.value = this.clock.getElapsedTime();
    this.tubeMesh2.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.tubeMesh3.material.uniforms.uTime.value = this.clock.getElapsedTime();
    this.tubeMesh3.material.uniforms.needsUpdate = new THREE.Uniform(true);

    this.controls?.update();

    this.composer.render();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  private getTubeMaterial(
    vertexShader: string,
    fragmentShader: string,
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
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: false,
    });
  }
  private getTube(
    position: THREE.Vector3,
    rotation: THREE.Vector3,
    vertexShader: string,
    fragmentShader: string,
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
      vertexShader,
      fragmentShader,
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
  ) {
    const pointsMesh = this.getMesh(
      position,
      rotation,
      vertex,
      fragment,
      radius,
    );
    const tubeMesh = this.getTube(
      position,
      rotation,
      vertexTube,
      fragmentTube,
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
    vertexShader?: string,
    fragmentShader?: string,
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
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
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
