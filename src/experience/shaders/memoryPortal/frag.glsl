uniform float uTime;
uniform float uActivation; // 0..1 saat user mendekat
uniform sampler2D uPhoto;
varying vec2 vUv;

// simplex noise ringkas
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865,0.366025403,-0.577350269,0.024390243);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291-0.85373472*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

void main(){
  // riak portal: UV terdistorsi oleh noise, mengendap saat teraktivasi
  float n = snoise(vUv * 4.0 + uTime * 0.25);
  vec2 distort = vUv + (1.0 - uActivation) * 0.06 * vec2(n);
  vec3 photo = texture2D(uPhoto, distort).rgb;
  // cincin cahaya tepi
  float edge = smoothstep(0.5, 0.48, distance(vUv, vec2(0.5)));
  vec3 glow = vec3(0.6, 0.8, 1.0) * (1.0 - edge) * (0.4 + uActivation);
  vec3 col = mix(glow, photo, uActivation);
  gl_FragColor = vec4(col, 1.0);
}
