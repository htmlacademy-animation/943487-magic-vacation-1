export default (targetTexture) => ({
  uniforms: {
    targetMap: {
      value: targetTexture,
    },
  },
  vertexShader: `
      uniform mat4 projectionMatrix;
      uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;
  
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;
  
      varying vec2 vUv;
  
      void main() {
  
        vUv = uv;
  
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
  
      }`,
  fragmentShader: `
      precision mediump float;
  
      uniform sampler2D targetMap;
  
      varying vec2 vUv;
  
      void main() {
  
        vec4 texel = texture2D( targetMap, vUv );
  
        gl_FragColor = texel;
  
      }`,
});
