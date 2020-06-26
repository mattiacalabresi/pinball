#version 300 es

precision mediump float;

in vec2 fsUV;
in vec3 fsNormal;
out vec4 outColor;

uniform vec3 mDiffColor;
uniform vec3 lightDirectionA; 
uniform vec3 lightColorA;
uniform vec3 lightDirectionB; 
uniform vec3 lightColorB;
uniform vec3 ambientLightCol;
uniform vec3 ambientMat;
uniform sampler2D in_texture;

void main() {
    
  vec4 texelCol = texture(in_texture, fsUV);
  
  vec3 nNormal = normalize(fsNormal);
  
  vec3 lDirA = normalize(lightDirectionA); 
  vec3 lDirB = normalize(lightDirectionB);
  
  //computing diffuse color
  vec3 diffA = clamp(dot(-lDirA,nNormal), 0.0, 1.0) * lightColorA;
  vec3 diffB = clamp(dot(-lDirB,nNormal), 0.0, 1.0) * lightColorB;
  vec3 lambertColor = mDiffColor * (diffA + diffB);
  
  //computing ambient color
  vec3 ambient = ambientLightCol * ambientMat;
  
  //computing BRDF color
  vec3 color = clamp(lambertColor + ambient, 0.0, 1.0);
  
  //compose final color with texture
  outColor = vec4(texelCol.rgb * color, texelCol.a);
}