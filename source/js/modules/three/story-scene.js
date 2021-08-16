import * as THREE from 'three';
import customRawShaderMaterial from '../helpers/custom-raw-shader-material.js';
import paramAnimate from '../helpers/param-animate.js';

export default class Story {
  constructor() {
    this.color = new THREE.Color(0x5f458c);
    this.alpha = 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.attTextures = [
      {
        src: `./img/module-5/scenes-textures/scene-1.png`,
        options: { hue: 0.0 },
      },
      {
        src: `./img/module-5/scenes-textures/scene-2.png`,
        options: { hue: -0.2, magnify: true },
      },
      {
        src: `./img/module-5/scenes-textures/scene-3.png`,
        options: { hue: 0.0 },
      },
      {
        src: `./img/module-5/scenes-textures/scene-4.png`,
        options: { hue: 0.0 },
      },
    ];
    this.textureWidth = 2048;
    this.textureHeight = 1024;
    this.cameraAspectRatio = this.width / this.height;

    this.canvasCenter = { x: this.width / 2, y: this.height / 2 };

    this.bubblesDuration = 3000;
    this.bubbles = [
      {
        radius: 80.0,
        initialPosition: [this.canvasCenter.x - this.canvasCenter.x / 10, -100],
        position: [this.canvasCenter.x - this.canvasCenter.x / 10, -100],
        finalPosition: [
          this.canvasCenter.x - this.canvasCenter.x / 10,
          this.height + 80,
        ],
        positionAmplitude: 50,
        timeout: 0,
      },
      {
        radius: 60.0,
        initialPosition: [this.canvasCenter.x - this.width / 4, -100],
        position: [this.canvasCenter.x - this.width / 4, -100],
        finalPosition: [
          this.canvasCenter.x - this.width / 4,
          this.height + 60,
        ],
        positionAmplitude: 40,
        timeout: this.bubblesDuration / 5,
      },
      {
        radius: 40.0,
        initialPosition: [this.canvasCenter.x, -100],
        position: [this.canvasCenter.x, -100],
        finalPosition: [this.canvasCenter.x, this.height + 100],
        positionAmplitude: 30,
        timeout: this.bubblesDuration / 4,
      },
    ];

    this.animationRequest = null;

    this.render = this.render.bind(this);
    this.updateSize = this.updateSize.bind(this);
  }

  resetBubbles() {
    this.bubbles.forEach((_, sceneID) => {
      this.bubbles[sceneID].position = [
        ...this.bubbles[sceneID].initialPosition,
      ];
    });
  }

  bubbleUniform(sceneID) {
    const { width } = this.renderer.getSize();
    const pixelRatio = this.renderer.getPixelRatio();

    if (this.attTextures[sceneID].options.magnify) {
      return {
        magnification: {
          value: {
            bubbles: this.bubbles,
            resolution: [
              width * pixelRatio,
              (width / this.cameraAspectRatio) * pixelRatio,
            ],
          },
        },
      };
    }

    return {};
  }

  bubblePositionAnimationTick(sceneID, from, to) {
    return (progress) => {
      const pixelRatio = this.renderer.getPixelRatio();

      const y = paramAnimate.tick(from[1], to[1], progress) * pixelRatio;
      const offset =
        this.bubbles[sceneID].positionAmplitude *
        Math.pow(1 - progress, 0.5) *
        Math.sin(progress * Math.PI * 10);
      const x =
        (offset + this.bubbles[sceneID].initialPosition[0]) * pixelRatio;

      this.bubbles[sceneID].position = [x, y];
    };
  }

  animateBubbles() {
    this.bubbles.forEach((bubble, sceneID) => {
      setTimeout(() => {
        paramAnimate.animateProgress(
          this.bubblePositionAnimationTick(
            sceneID,
            this.bubbles[sceneID].initialPosition,
            this.bubbles[sceneID].finalPosition
          ),
          this.bubblesDuration
        );
      }, this.bubbles[sceneID].timeout);
    });
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
    const loaderTextures = this.attTextures.map((texture) => ({
      src: loader.load(texture.src),
      options: texture.options,
    }));

    manager.onLoad = () => {
      loaderTextures.forEach((texture, positionX) => {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.RawShaderMaterial(
          customRawShaderMaterial({
            targetMap: {
              value: texture.src,
            },
            options: {
              value: texture.options,
            },
            ...this.bubbleUniform(positionX),
          })
        );

        let image = new THREE.Mesh(geometry, material);
        image.scale.x = this.textureWidth;
        image.scale.y = this.textureHeight;
        image.position.x = this.textureWidth * positionX;

        this.scene.add(image);
        this.render();
      });
    };

    this.animationRequest = requestAnimationFrame(this.render);
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    if (this.animationRequest) {
      requestAnimationFrame(this.render);
    }
  }

  renderScene(sceneID) {
    this.camera.position.x = this.textureWidth * sceneID;

    if (this.attTextures[sceneID].options.magnify) {
      this.resetBubbles();
      this.animateBubbles();
    }

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
