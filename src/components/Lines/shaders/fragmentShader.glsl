varying vec2 vUv;
varying vec3 pos;
uniform float time;
uniform float variant;

void main() {

    vec3 color0 = vec3(85.0/255.0, 88.0/255.0, 82.0/255.0);
    vec3 color1 = vec3(83.0/255.0, 84.0/255.0, 70.0/255.0);
    vec3 color2 = vec3(105.0/255., 6.0/255., 5.0/255.0);

    vec3 color = mix(color0, color1, abs(sin(vUv.y + time * vUv.x)));
    color = mix(color, color2,  vUv.x);

    gl_FragColor = vec4(color, abs(sin( vUv.x + sin(time * 0.3 + vUv.y) )) * 0.1 + 0.1);
}
