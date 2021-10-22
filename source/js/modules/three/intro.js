import * as THREE from 'three';
import customRawShaderMaterial from './materials/custom-raw-shader-material.js';
import SVGObject from './svg-object/SVGObject.js';

export default class Intro {
  constructor() {
    this.color = new THREE.Color(0x5f458c);
    this.alpha = 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.texturePath = `img/module-5/scenes-textures/scene-0.png`;
    this.textureWidth = 2048;
    this.textureHeight = 1024;
    this.cameraAspectRatio = this.textureWidth / this.textureHeight;

    this.aspect = this.width / this.height;
    this.position = {
      z: 750,
    };

    this.initialized = false;
    this.animationRequest = null;

    this.render = this.render.bind(this);
    this.updateSize = this.updateSize.bind(this);
  }

  initScene() {
    if (!this.initialized) {
      this.prepareScene();
      this.initialized = true;
    }

    window.addEventListener(`resize`, this.updateSize);

    this.animationRequest = requestAnimationFrame(this.render);
  }

  prepareScene() {
    this.canvas = document.getElementById(`intro-scene`);
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, this.aspect, 0.1, 1200);
    this.camera.position.z = 1200;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setClearColor(this.color, this.alpha);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    const manager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(manager);
    const loaderTexture = loader.load(this.texturePath);
    const material = new THREE.RawShaderMaterial(
      customRawShaderMaterial({ targetMap: { value: loaderTexture } })
    );
    const geometry = new THREE.PlaneGeometry(1, 1);

    manager.onLoad = () => {
      const image = new THREE.Mesh(geometry, material);
      image.scale.x = this.height * this.cameraAspectRatio;
      image.scale.y = this.height;

      this.scene.add(image);
    };

    this.addSvgObjects();
  }

  addSvgObjects() {
    this.loadKeyhole();
    this.loadFlamingo();
    this.loadSnowflake();
    this.loadQuestion();
    this.loadLeaf();
  }

  async loadKeyhole() {
    const keyhole = await new SVGObject({ name: `keyhole` }).getObject();
    keyhole.position.set(-1000, 1000, 10);
    this.scene.add(keyhole);
  }

  async loadFlamingo() {
    const flamingo = await new SVGObject({ name: `flamingo` }).getObject();
    flamingo.position.set(-350, 300, 100);
    flamingo.scale.set(-2, 2, 2);
    flamingo.rotation.copy(
      new THREE.Euler(20 * THREE.Math.DEG2RAD, 0, 0),
      `XYZ`
    );
    this.scene.add(flamingo);
  }

  async loadSnowflake() {
    const snowflake = await new SVGObject({ name: `snowflake` }).getObject();
    snowflake.position.set(-350, 0, 100);
    snowflake.scale.set(1.2, 1.2, 1.2);
    snowflake.rotation.copy(
      new THREE.Euler(20 * THREE.Math.DEG2RAD, 40 * THREE.Math.DEG2RAD, 0),
      `XYZ`
    );
    this.scene.add(snowflake);
  }

  async loadQuestion() {
    const question = await new SVGObject({ name: `question` }).getObject();
    question.position.set(150, -200, 100);
    this.scene.add(question);
  }

  async loadLeaf() {
    const leaf = await new SVGObject({ name: `leaf-1` }).getObject();
    leaf.position.set(400, 200, 100);
    leaf.scale.set(-1.2, 1.2, 1.2);
    this.scene.add(leaf);
  }

  end() {
    window.removeEventListener(`resize`, this.updateSize);

    this.animationRequest = null;
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    if (this.animationRequest) {
      requestAnimationFrame(this.render);
    }
  }

  updateSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.cameraAspectRatio = this.width / this.height;

    this.camera.aspect = this.cameraAspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.render();
  }
}
