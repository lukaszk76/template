varying vec2 vUv;
uniform float time;
uniform sampler2D uTexture;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {

    vUv = uv;
    vec3 pos = position;
    pos.xy = texture2D( uTexture, vUv ).xy;

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

    gl_PointSize = ( 2. * rand(pos.xy) / -mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;

}
