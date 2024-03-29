import * as THREE from 'three';
import SVGObject from '../../svg-object/SVGObject.js';
import Rug from '../objects/rug.js';
import Saturn from './saturn.js';

class FirstRoomStory extends THREE.Group {
  constructor({ dark } = {}) {
    super();

    this.dark = dark;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addFlower();
    this.addRug();
    this.addSaturn();
  }

  addFlower() {
    const flower = new SVGObject({name: `flower`, dark: this.dark,}).getObject();
    if (!flower) {
      return;
    }

    flower.position.set(-100, 100, 40);
    flower.scale.set(0.5, 0.5, 0.5);
    this.add(flower);
  }

  addRug() {
    const rug = new Rug({dark: this.dark});
    rug.scale.set(0.7, 0.7, 0.7);
    rug.position.set(-20, 0, 40);
    rug.rotation.copy(new THREE.Euler(20 * THREE.Math.DEG2RAD, 45 * THREE.Math.DEG2RAD, 180 * THREE.Math.DEG2RAD), `XYZ`);
    this.add(rug);
  }

  addSaturn() {
    const saturn = new Saturn({dark: this.dark});
    saturn.scale.set(0.9, 0.9, 0.9);
    saturn.position.set(60, 240, 100);
    this.add(saturn);
  }
}

export default FirstRoomStory;
