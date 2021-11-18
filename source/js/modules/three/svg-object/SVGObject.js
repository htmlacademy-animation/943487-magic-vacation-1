import loadedSvgs from './loader.js';

class SVGObject {
  constructor({ name }) {
    this.name = name;
  }

  getObject() {
    const svg = loadedSvgs.getObjectByName(this.name);
    
    return svg;
  }
}

export default SVGObject;
