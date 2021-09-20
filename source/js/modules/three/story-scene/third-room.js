import * as THREE from 'three';
import Snowman from './snowman.js';

class ThirdRoomStory extends THREE.Group {
  constructor() {
    super();

    this.getMaterial = (options = {}) => {
      const { color, ...rest } = options;

      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        ...rest,
      });
    };

    this.addSnowman();
  }

  addSnowman() {
    const snowman = new Snowman(this.getMaterial);

    snowman.scale.set(1, 1, 1);
    snowman.rotation.copy(
      new THREE.Euler(10 * THREE.Math.DEG2RAD, 40 * THREE.Math.DEG2RAD, 0),
      `XYZ`
    );
    snowman.position.set(-130, -120, 0);
    this.add(snowman);
  }
}

export default ThirdRoomStory;