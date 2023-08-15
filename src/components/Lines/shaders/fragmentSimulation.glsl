varying vec2 vUv;
uniform float time;
uniform sampler2D uCurrentPositions;
uniform sampler2D uOriginalPositions;
uniform vec3 uMouse;


float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {

    vec2 position = texture2D( uCurrentPositions, vUv ).xy;
    vec2 original = texture2D( uOriginalPositions, vUv ).xy;
    vec2 speed = texture2D( uCurrentPositions, vUv ).zw;
    float offset = rand(vUv);

    float frictionFactor = 0.990;
    float gravity = 0.0010;
    float mouseForce = 0.0004;
    float maxSpeed = 0.1;
    float maxMouseDist = 0.2;
    float minGravityDist = 0.005;
    float lifespan = 10.0;
    float youngness = 0.01;

    float dist = distance(original, position);
    vec2 gravityDir = normalize(original - position);
    if (dist > minGravityDist) {
        speed = speed + gravityDir * gravity * dist;
    }

    float mouseDist = distance(uMouse.xy, position);
    if (mouseDist < maxMouseDist) {
        float force = 1.0 - (mouseDist / maxMouseDist);
        vec2 mouseDir = normalize(position - uMouse.xy);
        speed = speed + mouseDir * force * mouseForce;
    }

    speed = speed * frictionFactor;

    if (length(speed) > maxSpeed) {
        speed = normalize(speed) * maxSpeed;
    }

    position = position + speed;

//    float age = mod(time + offset * lifespan, lifespan);
//    if (age < youngness) {
//        speed = vec2(rand(vUv + vec2(0.1, 0.1)) - 0.5, rand(vUv + vec2(0.2, 0.2)) - 0.5) * 0.001;
//        position = original;
//    }

    gl_FragColor = vec4(position, speed);
}