#version 300 es

in vec3 inPosition;
in vec3 inNormal;
in vec2 in_uv;

out vec2 fsUV;
out vec3 fsNormal;

uniform mat4 matrix; 

void main() {
  fsUV = in_uv;
  fsNormal = inNormal; 
  gl_Position = matrix * vec4(inPosition, 1.0);
}