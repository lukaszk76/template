varying vec2 vUv;
uniform float uTime;
varying vec3 vPosition;
attribute vec3 aRandom;
attribute float aSize;
uniform float uProgress;
uniform float uRadius;

float PI = 3.141592653589793238;

vec3 getPosition(float progress) {
    float angle = progress * PI * 2.;

    float x = sin(angle) + 2. * sin(angle * 2.);
    float y = cos(angle) - 2. * cos(angle * 2.);
    float z = -sin(angle * 3.);

    return vec3(x, y, z);
}

vec3 getTangent(float progress) {
    float angle = progress * PI * 2.;

    float x = cos(angle) + 4. * cos(angle * 2.);
    float y = -sin(angle) - 4. * sin(angle * 2.);
    float z = -3. * cos(angle * 3.);

    return normalize(vec3(x, y, z));
}

vec3 getNormal(float progress) {
    float angle = progress * PI * 2.;

    float x = -sin(angle) - 8. * sin(angle * 2.);
    float y = -cos(angle) - 8. * cos(angle * 2.);
    float z = 9. * sin(angle * 3.);

    return normalize(vec3(x, y, z));
}

float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
    float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
}

void main() {
    vUv = uv;
    float progress = fract(aRandom.x + uTime * 0.03);
    vec3 normal = getNormal(progress);
    vec3 tangent = getTangent(progress);
    vec3 binormal = normalize(cross(normal, tangent));

    float radius = uRadius + aRandom.z * 0.2;
    float angle = aRandom.y * PI * 2. * noise(uTime * 0.3)  + aRandom.z * 7.0;
    float cx = radius * cos(angle);
    float cy = radius * sin(angle);

    vec3 pos = getPosition(progress) ;
    pos += normal * cx;
    pos += binormal * cy;
    vPosition = pos;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 40. * aSize * (1. / -(mvPosition.z * 1.0));
    gl_Position = projectionMatrix * mvPosition;
}