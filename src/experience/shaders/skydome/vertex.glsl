varying vec3 vWorldDir;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldDir = normalize(worldPos.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
