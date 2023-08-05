varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;
uniform vec4 resolution;

void main() {

    vec2 newUV = (vUv - vec2(0.5)) * vec2(resolution.z, resolution.w) + vec2(0.5) ;

    vec4 offset = texture2D(uDataTexture, vUv);

    gl_FragColor = texture2D(uTexture, newUV - 0.02 * offset.rg);
}