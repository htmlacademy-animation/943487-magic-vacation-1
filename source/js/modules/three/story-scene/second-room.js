import * as THREE from 'three';
import Pyramid from './pyramid.js';
import Lantern from './lantern.js';

class SecondRoomStory extends THREE.Group {
  constructor() {
    super();

    this.getMaterial = (options = {}) => {
      const { color, ...rest } = options;

      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        ...rest,
      });
    };

    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addPyramid();
    this.addLantern();
  }

  addPyramid() {
    const pyramid = new Pyramid();

    pyramid.position.set(-13, 0, -110); 
    pyramid.rotation.copy(
      new THREE.Euler(5 * THREE.Math.DEG2RAD, 3 * THREE.Math.DEG2RAD, 0),
      `XYZ`
    );
    this.add(pyramid);
  }

  addLantern() {
    const lantern = new Lantern(this.getMaterial);

    lantern.scale.set(0.32, 0.32, 0.32);
    lantern.rotation.copy(
      new THREE.Euler(10 * THREE.Math.DEG2RAD, 60 * THREE.Math.DEG2RAD, 0),
      `XYZ`
    );
    lantern.position.set(115, -150, 10);
    this.add(lantern);
  }
}

export default SecondRoomStory;