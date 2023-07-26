uniform sampler2D uTexture;
uniform float uThemeLight;
void main() {

    vec3 colorLight = vec3(222./255.,232./255.,237./255.);
    vec3 colorDark = vec3(80./255.,73./255.,73./255.);
    vec3 color = colorLight;

   if (uThemeLight == 1.0) {
        color = colorDark;
    }
    gl_FragColor = vec4(color, 1.0);


}
