import * as THREE from 'three';

import { getLathePointsForCircle, getLatheDegrees } from '../../helpers.js';
import colors from '../../../helpers/colors.js';
import rugShaderMaterial from '../../materials/rugShaderMaterial.js';

class Rug extends THREE.Group {
  constructor({ dark } = {}) {
    super();

    this.dark = dark;

    this.rug = {
      width: 180,
      depth: 3,
      radius: 763,
      degStart: 16,
      degEnd: 74,
      mainColor: this.dark ? colors.ShadowedLightPurple : colors.LightPurple,
      stripeColor: this.dark
        ? colors.ShadowedAdditionalPurple
        : colors.AdditionalPurple,
      segments: 50,
    };

    this.addRug = this.addRug.bind(this);

    this.addRug();
  }

  getMaterial() {
    return new THREE.ShaderMaterial(
      rugShaderMaterial({
        mainColor: { value: new THREE.Color(this.rug.mainColor) },
        stripeColor: { value: new THREE.Color(this.rug.stripeColor) },
      })
    );
  }

  getGeometry() {
    const points = getLathePointsForCircle(
      this.rug.width,
      this.rug.depth,
      this.rug.radius
    );
    const { start, length } = getLatheDegrees(
      this.rug.degStart,
      this.rug.degEnd
    );

    const rug = new THREE.LatheBufferGeometry(
      points,
      this.rug.segments,
      start,
      length
    ).toNonIndexed();

    return rug;
  }

  addRug() {
    const mesh = new THREE.Mesh(this.getGeometry(), this.getMaterial());

    this.add(mesh);
  }
}

export default Rug;
