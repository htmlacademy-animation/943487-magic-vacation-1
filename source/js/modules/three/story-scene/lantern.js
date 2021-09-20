import * as THREE from 'three';
import paramAnimate from '../../helpers/param-animate.js';

class Lantern extends THREE.Group {
  constructor() {
    super();

    this.getMaterial = (options = {}) => {
      const { color, ...rest } = options;

      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        ...rest,
      });
    };

    this.cylinder = {
      height: 120,
      radius: 16,
      radialSegments: 20,
      color: `#1271F3`,
    };

    this.sphere = {
      height: 16,
      radius: 16,
      segments: 20,
      color: `#1271F3`,
    };

    this.centreCylinder = {
      height: 230,
      radius: 7,
      radialSegments: 20,
      color: `#1271F3`,
    };

    this.box = {
      width: 37,
      height: 4,
      color: `#1271F3`,
    };

    this.topTrapezoid = {
      widthTop: 42,
      widthBottom: 34,
      height: 60,
      color: `#90B0F9`,
      radialSegments: 4,
    };

    this.topCap = {
      widthTop: 45,
      widthBottom: 57,
      height: 6,
      color: `#1271F3`,
      radialSegments: 4,
    };

    this.addBase = this.addBase.bind(this);
    this.addMiddle = this.addMiddle.bind(this);
    this.addTop = this.addTop.bind(this);
    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addBase();
    this.addMiddle();
    this.addTop();
  }

  addBase() {
    this.base = new THREE.Group();

    const cylinder = new THREE.CylinderBufferGeometry(
      this.cylinder.radius,
      this.cylinder.radius,
      this.cylinder.height,
      this.cylinder.radialSegments
    );
    const cylinderMesh = new THREE.Mesh(
      cylinder,
      this.getMaterial({ color: this.cylinder.color })
    );

    const halfSphere = new THREE.SphereBufferGeometry(
      this.sphere.radius,
      this.sphere.segments,
      this.sphere.segments,
      Math.PI * 2.0,
      Math.PI * 2.0,
      0,
      Math.PI * 0.5
    );
    const halfSphereMesh = new THREE.Mesh(
      halfSphere,
      this.getMaterial({ color: this.sphere.color })
    );

    this.base.add(cylinderMesh);
    this.base.add(halfSphereMesh);
    halfSphereMesh.position.set(0, this.cylinder.height / 2, 0);

    this.add(this.base);
  }

  addMiddle() {
    const cylinder = new THREE.CylinderBufferGeometry(
      this.centreCylinder.radius,
      this.centreCylinder.radius,
      this.centreCylinder.height,
      this.centreCylinder.radialSegments
    );
    const cylinderMesh = new THREE.Mesh(
      cylinder,
      this.getMaterial({ color: this.centreCylinder.color })
    );

    const currentGroupSize = new THREE.Box3().setFromObject(this).getSize();

    this.add(cylinderMesh);
    cylinderMesh.position.set(
      0,
      currentGroupSize.y / 2 +
        this.sphere.radius / 2 +
        this.centreCylinder.height / 2,
      0
    );
  }

  addTop() {
    this.top = new THREE.Group();

    const box = new THREE.BoxBufferGeometry(
      this.box.width,
      this.box.height,
      this.box.width
    );
    const boxMesh = new THREE.Mesh(
      box,
      this.getMaterial({ color: this.box.color, flatShading: true })
    );

    const trapezoid = new THREE.CylinderBufferGeometry(
      paramAnimate.coneRadius(this.topTrapezoid.widthTop),
      paramAnimate.coneRadius(this.topTrapezoid.widthBottom),
      this.topTrapezoid.height,
      this.topTrapezoid.radialSegments
    );
    const trapezoidMesh = new THREE.Mesh(
      trapezoid,
      this.getMaterial({ color: this.topTrapezoid.color, flatShading: true })
    );

    const cap = new THREE.CylinderBufferGeometry(
      paramAnimate.coneRadius(this.topCap.widthTop),
      paramAnimate.coneRadius(this.topCap.widthBottom),
      this.topCap.height,
      this.topCap.radialSegments
    );
    const capMesh = new THREE.Mesh(
      cap,
      this.getMaterial({ color: this.topCap.color, flatShading: true })
    );

    this.top.add(boxMesh);
    boxMesh.rotation.y = -45 * THREE.Math.DEG2RAD;
    this.top.add(trapezoidMesh);
    this.top.add(capMesh);

    trapezoidMesh.position.set(
      0,
      this.box.height / 2 + this.topTrapezoid.height / 2,
      0
    );
    capMesh.position.set(
      0,
      this.box.height / 2 +
        this.topTrapezoid.height +
        this.topCap.height / 2,
      0
    );

    const currentGroupSize = new THREE.Box3().setFromObject(this).getSize();
    this.add(this.top);
    const currentElementSize = new THREE.Box3()
      .setFromObject(this.top)
      .getSize();

    this.top.position.set(
      0,
      currentGroupSize.y / 2 + 50 + currentElementSize.y,
      0
    );
  }
}

export default Lantern;