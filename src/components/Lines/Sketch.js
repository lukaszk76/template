import * as THREE from "three";
import fragmentShader from "./shaders/fragmentShader.glsl";
import fragmentSimulationShader from "./shaders/fragmentSimulation.glsl";
import vertexShader from "./shaders/vertexShader.glsl";
import vertexSimulationShader from "./shaders/vertexSimulation.glsl";

export default class Sketch {
  constructor(options) {
    this.time = 0;
    this.size = 1024;
    this.maxDistance = 0.00002;
    this.count = this.size * this.size;
    this.container = options.dom;
    this.scene = new THREE.Scene();
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.camera = new THREE.OrthographicCamera(-1, 1, -1, 1);
    this.camera.position.z = 0.8;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
    this.raycster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.startAnimation(options.variant);
  }

  setupFBO() {
    this.sceneFBO = new THREE.Scene();
    this.cameraFBO = new THREE.OrthographicCamera(-1, 1, 1, -1, -2, 2);
    this.cameraFBO.position.z = 1;
    this.cameraFBO.lookAt(0, 0, 0);
    const geometryFBO = new THREE.PlaneGeometry(2, 2, 2, 2);
    this.simulationMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uCurrentPositions: { value: this.data },
        uOriginalPositions: { value: this.data },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        progress: { value: 0 },
        time: { value: 0 },
      },
      vertexShader: vertexSimulationShader,
      fragmentShader: fragmentSimulationShader,
    });
    this.simulationMesh = new THREE.Mesh(geometryFBO, this.simulationMaterial);
    this.sceneFBO.add(this.simulationMesh);

    this.rendererTargetFBO = new THREE.WebGLRenderTarget(this.size, this.size, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    });

    this.rendererTargetFBO1 = new THREE.WebGLRenderTarget(
      this.size,
      this.size,
      {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      },
    );
  }

  getRand(min, max) {
    return Math.random() * (max - min) + min;
  }

  createDataTexture() {
    const data = new Float32Array(this.count * 4);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = i * this.size + j;

        let deltaX = this.getRand(-1, 1) * this.maxDistance;
        let deltaY = this.getRand(-1, 1) * this.maxDistance;

        if (index > 1) {
          deltaX = data[(index - 1) * 4] - data[(index - 2) * 4];
          deltaY = data[(index - 1) * 4 + 1] - data[(index - 2) * 4 + 1];
        }

        let x = this.getRand(-1, 1);
        let y = this.getRand(-1, 1);

        if (index > 0) {
          x =
            data[(index - 1) * 4] +
            deltaX +
            this.getRand(-1, 1) * this.maxDistance;
          y =
            data[(index - 1) * 4 + 1] +
            deltaY +
            this.getRand(-1, 1) * this.maxDistance;
        }

        if (x > 1) x = 1;
        if (x < -1) x = -1;
        if (y > 1) y = 1;
        if (y < -1) y = -1;

        data[index * 4] = x;
        data[index * 4 + 1] = y;
        data[index * 4 + 2] = 0;
        data[index * 4 + 3] = 0;
      }
    }

    const texture = new THREE.DataTexture(
      data,
      this.size,
      this.size,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    texture.needsUpdate = true;
    return texture;
  }
  addObjects(variant) {
    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(this.count * 3);
    const uvs = new Float32Array(this.count * 2);
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = i * this.size + j;

        positions[3 * index] = j / this.size - 0.5;
        positions[3 * index + 1] = i / this.size - 0.5;
        positions[3 * index + 2] = 0;
        uvs[2 * index] = j / (this.size - 1);
        uvs[2 * index + 1] = i / (this.size - 1);
      }
    }
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    this.geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uTexture: { value: null },
        variant: { value: variant },
      },
      depthTest: false,
      depthWrite: false,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });

    this.lines = new THREE.Line(this.geometry, this.material);
    this.scene.add(this.lines);
  }

  startAnimation(variant) {
    this.data = this.createDataTexture();
    this.addObjects(variant);
    this.mouseEvents();
    this.setupResize();
    this.setupFBO();
    this.render();
  }

  mouseEvents() {
    this.testMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial(),
    );

    window.addEventListener("mousemove", (e) => {
      this.pointer.x = (e.offsetX / this.width) * 2 - 1;
      this.pointer.y = -(e.offsetY / this.height) * 2 + 1;
      this.raycster.setFromCamera(this.pointer, this.camera);

      const intersects = this.raycster.intersectObjects([this.testMesh]);
      if (intersects.length > 0) {
        const { point } = intersects[0];
        this.simulationMaterial.uniforms.uMouse.value = point;
      }
    });
  }

  render() {
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.needsUpdate = true;

    this.simulationMaterial.uniforms.time.value = this.time;
    this.simulationMaterial.uniforms.needsUpdate = true;

    this.renderer.setRenderTarget(this.rendererTargetFBO);
    this.renderer.render(this.sceneFBO, this.cameraFBO);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);

    const temp = this.rendererTargetFBO;
    this.rendererTargetFBO = this.rendererTargetFBO1;
    this.rendererTargetFBO1 = temp;

    this.material.uniforms.uTexture.value = this.rendererTargetFBO.texture;
    this.simulationMaterial.uniforms.uCurrentPositions.value =
      this.rendererTargetFBO1.texture;

    window.requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    this.width = this.container.width;
    this.height = this.container.height;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
}
