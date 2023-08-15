varying vec2 vUv;
varying vec3 pos;
uniform float time;

void main() {

    vec3 color = vec3(mod(abs(pos.x), 1.),mod(abs(pos.y), 1.),mod(abs(pos.y + pos.x), 1.));

    gl_FragColor = vec4(color, 1.0);


}
