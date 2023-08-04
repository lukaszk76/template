uniform sampler2D uTexture;
uniform float uThemeLight;
void main() {

    vec3 colorLight = vec3(222./255.,232./255.,237./255.);
    vec3 colorDark = vec3(12./255.,25./255.,64./255.);

    vec3 color = colorDark;

    vec2 uv = gl_FragCoord.xy / vec2(1024., 1024.);

    color = mix(colorLight, colorDark, sqrt(1. / uv.x * uv.y) * 0.5 + 0.5);


   if (uThemeLight == 1.0) {
        color = mix( colorDark, colorLight, sqrt(1. / uv.x * uv.y) * 0.5 + 0.5);
    }
    gl_FragColor = vec4(color, 1.0);
}
