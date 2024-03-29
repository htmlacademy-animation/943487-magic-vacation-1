import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import colors from '../../helpers/colors.js';
import materialReflectivity from '../materials/material-reflectivity.js';

const svgPaths = [
  {
    name: `flamingo`,
    src: `img/module-6/svg-forms/flamingo.svg`,
    height: 85,
    depth: 8,
    cap: 2,
    color: colors.LightDominantRed,
    materialReflectivity: materialReflectivity.soft,
  },
  {
    name: `snowflake`,
    src: `img/module-6/svg-forms/snowflake.svg`,
    height: 74,
    depth: 8,
    cap: 2,
    color: colors.Blue,
    materialReflectivity: materialReflectivity.basic,
  },
  {
    name: `question`,
    src: `img/module-6/svg-forms/question.svg`,
    height: 56,
    depth: 8,
    cap: 2,
    color: colors.Blue,
    materialReflectivity: materialReflectivity.basic,
  },
  {
    name: `leaf-1`,
    src: `img/module-6/svg-forms/leaf.svg`,
    height: 117,
    depth: 8,
    cap: 2,
    color: colors.Green,
    materialReflectivity: materialReflectivity.basic,
  },
  {
    name: `keyhole`,
    src: `img/module-6/svg-forms/keyhole.svg`,
    height: 2000,
    depth: 20,
    cap: 2,
    color: colors.DarkPurple,
    materialReflectivity: materialReflectivity.basic,
    children: new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshStandardMaterial({
        color: new THREE.Color(colors.Purple),
        side: THREE.DoubleSide,
        ...materialReflectivity.basic,
      })),
  },
  {
    name: `flower`,
    src: `img/module-6/svg-forms/flower.svg`,
    height: 413,
    depth: 4,
    cap: 2,
    color: colors.Green,
    materialReflectivity: materialReflectivity.basic,
  },
  {
    name: `leaf-2`,
    src: `img/module-6/svg-forms/leaf.svg`,
    height: 335.108,
    depth: 3,
    cap: 3,
    color: colors.Green,
    materialReflectivity: materialReflectivity.basic,
  },
];

const createSvgGroup = (data, settings) => {
  const { paths } = data;
  const group = new THREE.Group();

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(settings.color),
      side: THREE.DoubleSide,
      ...settings.materialReflectivity,
    });

    const shapes = path.toShapes(true);

    for (let j = 0; j < shapes.length; j++) {
      const shape = shapes[j];
      const geometry = new THREE.ExtrudeBufferGeometry(shape, {
        steps: 2,
        depth: settings.depth,
        bevelEnabled: true,
        bevelThickness: settings.cap,
        bevelSize: settings.cap,
        bevelOffset: 0,
        bevelSegments: 1,
      });
      geometry.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
      const mesh = new THREE.Mesh(geometry, material);

      if (settings.children) {
        const content = settings.children;

        const size = new THREE.Vector3();
        new THREE.Box3().setFromObject(content).getSize(size);
        content.position.set(size.x / 2, -size.y / 2, 1);

        group.add(content);
      }

      group.add(mesh);
    }
  }

  group.name = settings.name;

  return group;
};

const group = new THREE.Group();
const loadManager = new THREE.LoadingManager();
const loader = new SVGLoader(loadManager);

svgPaths.forEach((path) => {
  loader.load(path.src, (data) => {
    const svgGroup = createSvgGroup(data, path);
    group.add(svgGroup);
  });
});

export default group;