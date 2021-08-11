import vertexShader from "./shader.vert";
import fragmentShader from "./shader.frag";

export default (targetTexture, options) => ({
  uniforms: {
    targetMap: {
      value: targetTexture,
    },
    options: {
      value: options,
    },
  },
  vertexShader,
  fragmentShader,
});
