varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;
uniform vec4 resolution;

void main() {
    float textureAspect = resolution.z;
    float screenAspect = resolution.x / resolution.y;
    vec2 multiplier = vec2(screenAspect / textureAspect, 1.0);
    if (textureAspect < screenAspect) {
        multiplier = vec2(1., textureAspect/screenAspect);
    }
    vec2 newUV = (vUv - vec2(0.5)) * multiplier + vec2(0.5);

    vec4 offset = texture2D(uDataTexture, vUv);

    gl_FragColor = texture2D(uTexture, newUV - 0.02 * offset.rg);
}