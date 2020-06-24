#version 300 es

precision mediump float;

in vec2 fsUV;
in vec3 fsNormal;
out vec4 outColor;

uniform vec3 mDiffColor;
uniform vec3 lightDirection; 
uniform vec3 lightColor;
uniform vec3 ambientLightCol;
uniform vec3 ambientMat;
uniform sampler2D in_texture;

void main() {
    
  vec4 texelCol = texture(in_texture, fsUV);
  vec3 nNormal = normalize(fsNormal);
  vec3 lDir = normalize(lightDirection); 
  vec3 lambertColor = mDiffColor * dot(-lDir,nNormal);
  vec3 ambient = ambientLightCol * ambientMat;
  vec3 color = clamp(lambertColor * lightColor + ambient, 0.0, 1.0);
  outColor = vec4(texelCol.rgb * color, texelCol.a);
}