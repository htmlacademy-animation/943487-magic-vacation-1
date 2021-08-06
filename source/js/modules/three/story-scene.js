import * as THREE from "three";

export default class Story {
  constructor() {
    this.color = new THREE.Color(0x5f458c);
    this.alpha = 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.attTextures = [
      `./img/module-5/scenes-textures/scene-1.png`,
      `./img/module-5/scenes-textures/scene-2.png`,
      `./img/module-5/scenes-textures/scene-3.png`,
      `./img/module-5/scenes-textures/scene-4.png`,
    ];
    this.textureWidth = 2048;
    this.textureHeight = 1024;
    this.cameraAspectRatio = this.width / this.height;

    this.render = this.render.bind(this);
    this.updateSize = this.updateSize.bind(this);
  }

  initScene() {
    window.addEventListener(`resize`, this.updateSize);

    this.canvas = document.getElementById(`story-scene`);
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.cameraAspectRatio,
      0.1,
      1200
    );
    this.camera.position.z = 1200;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });
    this.renderer.setClearColor(this.color, this.alpha);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    const manager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(manager);
    const loaderTextures = this.attTextures.map((texture) => loader.load(texture));

    manager.onLoad = () => {
      loaderTextures.forEach((texture, positionX) => {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        let image = new THREE.Mesh(geometry, material);

        image.scale.x = this.textureWidth;
        image.scale.y = this.textureHeight;
        image.position.x = this.textureWidth * positionX;

        this.scene.add(image);
        this.render();
      });
    };
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  renderScene(sceneID) {
    this.camera.position.x = this.textureWidth * sceneID;
    this.render();
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
