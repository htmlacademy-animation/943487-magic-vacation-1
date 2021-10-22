import * as THREE from 'three';
import Rug from '../objects/rug.js';

class FourthRoomStory extends THREE.Group {
  constructor({ dark } = {}) {
    super();

    this.dark = dark;

    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addRug();
  }

  addRug() {
    const rug = new Rug({dark: this.dark});
    rug.scale.set(0.7, 0.7, 0.7);
    rug.position.set(-20, 0, 40);
    rug.rotation.copy(new THREE.Euler(20 * THREE.Math.DEG2RAD, 45 * THREE.Math.DEG2RAD, 180 * THREE.Math.DEG2RAD), `XYZ`);
    this.add(rug);
  }
}

export default FourthRoomStory;