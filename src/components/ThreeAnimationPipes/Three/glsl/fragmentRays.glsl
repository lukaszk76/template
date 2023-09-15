varying vec2 vUv;
uniform sampler2D uTexture;
varying vec3 vWorldPosition;
uniform float uTime;

void main() {

    vec3 color1 = vec3(0.913, 0.237, 0.256);
    vec3 color2 = vec3(0.482, 0.491, 0.422);
    vec2 godray = vWorldPosition.xy - vec2(-1., 10.);
    float uvDirection = atan(godray.y, godray.x);
    float c1 = texture2D(uTexture, vec2(uvDirection, 0.) + uTime * 0.01).x;
    float c2 = texture2D(uTexture, vec2(0.1, uvDirection) + uTime * 0.01 * 1.5).x;
    float c = min(c1, c2);
    vec3 color = mix(color1, color2, c);
    float fade = smoothstep(0., 0.95, abs(vUv.y ));
    gl_FragColor = vec4(color, fade * c * 0.07);
}
