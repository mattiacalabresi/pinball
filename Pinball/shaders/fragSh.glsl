#version 300 es

precision mediump float;

in vec2 fsUV;
in vec3 fsNormal;
in vec3 fs_pos;
out vec4 outColor;

uniform vec3 eyePos;
uniform vec3 specularColor;
uniform float specShine;
uniform vec3 mDiffColor;
uniform vec3 emit;
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
  
  //computing Lambert diffuse color
  vec3 diffA = clamp(dot(-lDirA,nNormal), 0.0, 1.0) * lightColorA;
  vec3 diffB = clamp(dot(-lDirB,nNormal), 0.0, 1.0) * lightColorB;
  vec3 lambertColor = mDiffColor * (diffA + diffB);
  
  //computing ambient color
  vec3 ambient = ambientLightCol * ambientMat;
  
  //computing Blinn specular color
  /*vec3 eyeDir = normalize(eyePos - fs_pos);
  vec3 halfVecA = normalize(eyeDir + lDirA);
  vec3 halfVecB = normalize(eyeDir + lDirB);
  vec3 specularA = pow(max(dot(halfVecA, nNormal), 0.0), specShine) * lightColorA;
  vec3 specularB = pow(max(dot(halfVecB, nNormal), 0.0), specShine) * lightColorB;
  vec3 blinnSpecular = specularColor * (specularA + specularB); */
  
  //computing BRDF color
  //vec3 color = clamp(blinnSpecular + lambertColor + ambient + emit, 0.0, 1.0);
  vec3 color = clamp(lambertColor + ambient + emit, 0.0, 1.0);
  
  //compose final color with texture
  outColor = vec4(texelCol.rgb * color, texelCol.a);
}