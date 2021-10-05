import * as THREE from 'three';
import customRawShaderMaterial from '../helpers/custom-raw-shader-material.js';
import paramAnimate from '../helpers/param-animate.js';
import easing from '../helpers/easings.js';

import FirstRoomStory from './story-scene/first-room/first-room.js';
import SecondRoomStory from './story-scene/second-room/second-room.js';
import ThirdRoomStory from './story-scene/third-room/third-room.js';
import FourthRoomStory from './story-scene/fourth-room/fourth-room.js';

const easeInOut = easing.bezier(0.4, 0, 1, 1);

export default class Story {
  constructor() {
    this.color = new THREE.Color(0x5f458c);
    this.alpha = 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.arrTextures = [
      {
        src: `./img/module-5/scenes-textures/scene-1.png`,
        options: { hue: 0.0 },
        room: FirstRoomStory,
      },
      {
        src: `./img/module-5/scenes-textures/scene-2.png`,
        options: { hue: -0.2, magnify: true },
        animationSettings: {
          hue: {
            initalHue: 0.1,
            finalHue: -0.2,
            duration: 2000,
            variation: 0.3,
          },
        },
        room: SecondRoomStory,
        roomScale: { x: 3, y: 3, z: 3 },
        roomPosition: { y: 250 },
      },
      {
        src: `./img/module-5/scenes-textures/scene-3.png`,
        options: { hue: 0.0 },
        room: ThirdRoomStory,
      },
      {
        src: `./img/module-5/scenes-textures/scene-4.png`,
        options: { hue: 0.0 },
        room: FourthRoomStory,
      },
    ];
    this.textureWidth = 2048;
    this.textureHeight = 1024;
    this.cameraAspectRatio = this.width / this.height;
    this.position = {
      z: 750,
    };

    this.activeScene = 0;

    this.canvasCenter = { x: this.width / 2, y: this.height / 2 };

    this.bubbleGlareOffset = 0.8;
    this.bubbleGlareStartRadianAngle = 2;
    this.bubbleGlareEndRadianAngle = 2.7;

    this.bubblesDuration = 3000;
    this.bubbles = [
      {
        radius: 80.0,
        glareAngleStart: this.bubbleGlareStartRadianAngle,
        glareAngleEnd: this.bubbleGlareEndRadianAngle,
        glareOffset: this.bubbleGlareOffset,
        initialPosition: [this.canvasCenter.x - this.canvasCenter.x / 8, -100],
        position: [this.canvasCenter.x - this.canvasCenter.x / 8, -100],
        finalPosition: [
          this.canvasCenter.x - this.canvasCenter.x / 8,
          this.height + 80,
        ],
        positionAmplitude: 70,
        timeout: 0,
      },
      {
        radius: 60.0,
        glareAngleStart: this.bubbleGlareStartRadianAngle,
        glareAngleEnd: this.bubbleGlareEndRadianAngle,
        glareOffset: this.bubbleGlareOffset,
        initialPosition: [this.canvasCenter.x - this.width / 6, -100],
        position: [this.canvasCenter.x - this.width / 6, -100],
        finalPosition: [
            this.canvasCenter.x - this.width / 6,
            this.height + 60,
          ],
        positionAmplitude: 60,
        timeout: this.bubblesDuration / 5,
      },
      {
        radius: 40.0,
        glareAngleStart: this.bubbleGlareStartRadianAngle,
        glareAngleEnd: this.bubbleGlareEndRadianAngle,
        glareOffset: this.bubbleGlareOffset,
        initialPosition: [this.canvasCenter.x, -100],
        position: [this.canvasCenter.x, -100],
        finalPosition: [this.canvasCenter.x, this.height + 100],
        positionAmplitude: 50,
        timeout: this.bubblesDuration / 3,
      },
    ];

    this.lights = [
      {
        id: `DirectionalLight`,
        type: `DirectionalLight`,
        color: `rgb(255,255,255)`,
        intensity: 0.84,
        position: {
          x: 0,
          y: this.position.z * Math.tan(-15 * THREE.Math.DEG2RAD),
          z: this.position.z,
        },
      },
      {
        id: `DirectionalLight-1`,
        type: `DirectionalLight`,
        color: `rgb(255,255,255)`,
        intensity: 0.5,
        position: {x: 0, y: 500, z: 0},
      },
      {
        id: `PointLight-0`,
        type: `PointLight`,
        color: `rgb(246,242,255)`,
        intensity: 0.6,
        decay: 2.0,
        distance: 975,
        position: { x: -785, y: -350, z: 710 },
      },
      {
        id: `PointLight-1`,
        type: `PointLight`,
        color: `rgb(245,254,255)`,
        intensity: 0.95,
        decay: 2.0,
        distance: 975,
        position: { x: 730, y: 800, z: 985 },
      },
    ];

    this.hueIsAnimation = false;
    this.defaultHueIntensityEasingFn = (timingFraction) => {
      return easeInOut(Math.sin(timingFraction * Math.PI));
    };
    this.animateHue = this.animateHue.bind(this);
    this.getHueAnimationSettings = this.getHueAnimationSettings.bind(this);

    this.initialized = false;
    this.animationRequest = null;

    this.render = this.render.bind(this);
    this.updateSize = this.updateSize.bind(this);
  }

  resetHue() {
    const hueAnimationSettings = this.getHueAnimationSettings(this.activeScene);
    if (!hueAnimationSettings) {
      return;
    }

    this.arrTextures[this.activeScene].options.hue =
      hueAnimationSettings.initalHue;
  }

  getHueAnimationSettings(sceneID) {
    const texture = this.arrTextures[sceneID];

    return texture.animationSettings && texture.animationSettings.hue;
  }

  hueIntensityAnimationTick(sceneID, from, to) {
    return (progress) => {
      const hueAnimationSettings = this.getHueAnimationSettings(sceneID);
      if (!hueAnimationSettings) {
        this.arrTextures[sceneID].options.hue = hueAnimationSettings.initalHue;
        return;
      }

      const hueShift = paramAnimate.tick(from, to, progress);
      this.arrTextures[sceneID].options.hue = hueShift;
    };
  }

  animateHue() {
    const hueAnimationSettings = this.getHueAnimationSettings(this.activeScene);
    if (!hueAnimationSettings) {
      this.hueIsAnimation = false;
      return;
    }

    this.hueIsAnimation = true;

    const { initalHue, finalHue, duration, variation } = hueAnimationSettings;
    const offset = Math.random() * variation * 2 + (1 - variation);

    paramAnimate
      .animateWithFPS(
        this.hueIntensityAnimationTick(
          this.activeScene,
          initalHue,
          finalHue * offset
        ),
        duration * offset,
        this.defaultHueIntensityEasingFn
      )
      .then(this.animateHue);
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

    if (this.arrTextures[sceneID].options.magnify) {
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
        Math.pow(1 - progress, 0.8) *
        Math.sin(progress * Math.PI * 7);
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

  //   setSphere() {
  //     const geometry = new THREE.SphereGeometry(100, 50, 50);

  //     const material = new THREE.MeshStandardMaterial({
  //       color: new THREE.Color(`#F1354C`),
  //       metalness: 0.05,
  //       emissive: 0x0,
  //       roughness: 0.5
  //     });

  //     return new THREE.Mesh(geometry, material);
  //   }

  setLights() {
    const lightGroup = new THREE.Group();

    this.lights.forEach((light) => {
      const color = new THREE.Color(light.color);

      const lightUnit = new THREE[light.type](color, light.intensity, light.distance, light.decay);
      lightUnit.position.set(...Object.values(light.position));
      lightGroup.add(lightUnit);
    });

    return lightGroup;
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
    const loaderTextures = this.arrTextures.map((texture) => ({
      ...texture,
      src: loader.load(texture.src),
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

        if (texture.room) {
          const Room = texture.room;

          const roomElements = new Room();
          roomElements.position.x = this.textureWidth * positionX;

          if (texture.roomScale) {
            roomElements.scale.set(texture.roomScale.x, texture.roomScale.y, texture.roomScale.z);
          }

          if (texture.roomPosition) {
            roomElements.position.y = texture.roomPosition.y;
          }

          this.scene.add(roomElements);
        }

        this.render();
      });
    };

    // const sphere = this.setSphere();
    // this.scene.add(sphere);

    const light = this.setLights();
    light.position.z = this.camera.position.z;
    this.scene.add(light);

    this.renderScene(0);
    // this.animationRequest = requestAnimationFrame(this.render);
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    if (this.animationRequest) {
      requestAnimationFrame(this.render);
    }
  }

  renderScene(sceneID) {
    this.activeScene = sceneID;
    this.camera.position.x = this.textureWidth * sceneID;

    if (this.arrTextures[sceneID].options.magnify) {
      this.resetBubbles();
      this.animateBubbles();
    }

    if (this.getHueAnimationSettings(sceneID)) {
      if (!this.hueIsAnimation) {
        this.resetHue();
        this.animateHue();
      }
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
