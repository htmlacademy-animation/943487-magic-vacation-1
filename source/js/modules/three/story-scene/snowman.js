import * as THREE from 'three';

class Snowman extends THREE.Group {
  constructor() {
    super();

    this.getMaterial = (options = {}) => {
      const { color, ...rest } = options;

      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        ...rest,
      });
    };

    this.sphereBig = {
      radius: 75,
      segments: 20,
      color: `#B1CFF3`,
    };

    this.sphereSmall = {
      radius: 44,
      segments: 20,
      color: `#B1CFF3`,
    };

    this.cone = {
      radius: 18,
      height: 75,
      radialSegments: 20,
      color: `#F84201`,
    };

    this.addSphereBig = this.addSphereBig.bind(this);
    this.addSphereSmall = this.addSphereSmall.bind(this);
    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addSphereBig();
    this.addSphereSmall();
  }

  addSphereBig() {
    const sphere = new THREE.SphereBufferGeometry(
      this.sphereBig.radius,
      this.sphereBig.segments,
      this.sphereBig.segments
    );
    const sphereMesh = new THREE.Mesh(
      sphere,
      this.getMaterial({ color: this.sphereBig.color })
    );

    this.add(sphereMesh);
  }

  addSphereSmall() {
    this.top = new THREE.Group();

    const sphere = new THREE.SphereBufferGeometry(
      this.sphereSmall.radius,
      this.sphereSmall.segments,
      this.sphereSmall.segments
    );
    const sphereMesh = new THREE.Mesh(
      sphere,
      this.getMaterial({ color: this.sphereSmall.color })
    );

    const cone = new THREE.ConeBufferGeometry(
      this.cone.radius,
      this.cone.height,
      this.cone.radialSegments
    );
    const coneMesh = new THREE.Mesh(
      cone,
      this.getMaterial({ color: this.cone.color })
    );

    this.top.add(sphereMesh);
    this.top.add(coneMesh);

    sphereMesh.position.set(0, 108, 0);

    coneMesh.rotation.x = 90 * THREE.Math.DEG2RAD;
    coneMesh.position.set(0, 108, 43);

    this.add(this.top);
  }
}

export default Snowman;