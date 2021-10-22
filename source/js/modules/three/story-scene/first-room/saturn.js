import * as THREE from 'three';

import {getLathePointsForCircle} from '../../helpers.js';
import colors from '../../../helpers/colors.js';
import materialReflectivity from '../../materials/material-reflectivity.js';

class Saturn extends THREE.Group {
    constructor({dark} = {}) {
    super();

    this.dark = dark;

    this.planet = {
      radius: 60,
      color: this.dark ? colors.ShadowedDominantRed : colors.DominantRed,
      segments: 40,
    };

    this.ring = {
      width: 120 - 80,
      depth: 2,
      radius: 80,
      color: this.dark ? colors.ShadowedBrightPurple : colors.BrightPurple,
      segments: 40,
    };

    this.topSphere = {
      radius: 10,
      color: this.dark ? colors.ShadowedBrightPurple : colors.BrightPurple,
      segments: 40,
    };

    this.line = {
      radius: 1,
      height: 1000,
      color: colors.MetalGrey,
      segments: 40,
    };

    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addPlanet();
    this.addRing();
    this.addTopSphere();
    this.addLine();
  }

  getMaterial(options = {}) {
    const {color, ...rest} = options;

    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      ...rest,
    });
  }

  addPlanet() {
    const planet = new THREE.SphereBufferGeometry(this.planet.radius, this.planet.segments, this.planet.segments);
    const mesh = new THREE.Mesh(planet, this.getMaterial({
        color: this.planet.color,
        ...materialReflectivity.soft,
      }));

    this.add(mesh);
  }

  addRing() {
    const points = getLathePointsForCircle(this.ring.width, this.ring.depth, this.ring.radius);

    const ring = new THREE.LatheBufferGeometry(points, this.ring.segments);
    const mesh = new THREE.Mesh(ring, this.getMaterial({
      color: this.ring.color,
      side: THREE.DoubleSide,
      flatShading: true,
      ...materialReflectivity.soft,
    }));
    mesh.rotation.copy(new THREE.Euler(20 * THREE.Math.DEG2RAD, 0, 18 * THREE.Math.DEG2RAD), `XYZ`);

    this.add(mesh);
  }

  addTopSphere() {
    const sphere = new THREE.SphereBufferGeometry(this.topSphere.radius, this.topSphere.segments, this.topSphere.segments);
    const mesh = new THREE.Mesh(sphere, this.getMaterial({
        color: this.topSphere.color,
        ...materialReflectivity.soft,
      }));

    mesh.position.set(0, this.ring.radius + this.topSphere.radius + 30, 0);
    this.add(mesh);
  }

  addLine() {
    const line = new THREE.CylinderBufferGeometry(this.line.radius, this.line.radius, this.line.height, this.line.radialSegments);
    const mesh = new THREE.Mesh(line, this.getMaterial({
        color: this.line.color,
        ...materialReflectivity.soft,
      }));

    mesh.position.set(0, this.line.height / 2, 0);
    this.add(mesh);
  }
}

export default Saturn;