precision highp float;

uniform float uTime;
uniform vec3 uTopColor;
uniform vec3 uMidColor;
uniform vec3 uBottomColor;
uniform vec3 uSunColor;
uniform vec3 uSunDir;

varying vec3 vWorldDir;

// hash kecil untuk taburan bintang + grain halus
float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
  vec3 dir = normalize(vWorldDir);
  float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

  // gradient tiga-stop: bawah hangat -> tengah indigo -> atas biru malam
  vec3 lower = mix(uBottomColor, uMidColor, smoothstep(0.0, 0.5, h));
  vec3 col = mix(lower, uTopColor, smoothstep(0.45, 1.0, h));

  // glow matahari (rasa god-rays) di arah uSunDir
  float sun = max(dot(dir, normalize(uSunDir)), 0.0);
  col += uSunColor * pow(sun, 8.0) * 0.6;
  col += uSunColor * pow(sun, 64.0) * 1.4;

  // bintang halus di langit atas, berkedip pelan
  float starField = step(0.9975, hash(floor(dir * 240.0)));
  float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + hash(floor(dir * 60.0)) * 30.0);
  col += vec3(starField) * twinkle * smoothstep(0.35, 0.85, h);

  gl_FragColor = vec4(col, 1.0);
}
