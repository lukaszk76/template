varying vec2 vUv;
uniform float uTime;
varying vec3 vPosition;
attribute vec3 aRandom;
attribute float aSize;
uniform float uProgress;
varying vec3 vWorldPosition;
varying vec3 vNormal;


void main() {
    vUv = uv;
    vNormal = normal;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * mvPosition;
}