import * as THREE from 'three';

import { getLathePointsForCircle, getLatheDegrees } from '../../helpers.js';
import colors from '../../../helpers/colors.js';
import roadShaderMaterial from '../../materials/roadShaderMaterial.js';

class Road extends THREE.Group {
  constructor() {
    super();

    this.road = {
      width: 160,
      depth: 3,
      radius: 732,
      degStart: 0,
      degEnd: 90,
      mainColor: colors.Grey,
      segments: 50,
      stripeColor: colors.White,
    };

    this.addRoad = this.addRoad.bind(this);

    this.addRoad();
  }

  getMaterial() {
    return new THREE.ShaderMaterial(
      roadShaderMaterial({
        mainColor: { value: new THREE.Color(this.road.mainColor) },
        stripeColor: { value: new THREE.Color(this.road.stripeColor) },
      })
    );
  }

  getGeometry() {
    const points = getLathePointsForCircle(
      this.road.width,
      this.road.depth,
      this.road.radius
    );
    const { start, length } = getLatheDegrees(
      this.road.degStart,
      this.road.degEnd
    );

    const road = new THREE.LatheBufferGeometry(
      points,
      this.road.segments,
      start,
      length
    ).toNonIndexed();

    return road;
  }

  addRoad() {
    const roadMesh = new THREE.Mesh(this.getGeometry(), this.getMaterial());

    this.add(roadMesh);
  }
}

export default Road;
