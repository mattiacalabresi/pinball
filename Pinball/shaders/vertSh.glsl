#version 300 es

in vec3 inPosition;
in vec3 inNormal;
in vec2 in_uv;

out vec2 fsUV;
out vec3 fsNormal;
out vec3 fs_pos;

uniform mat4 matrix; 

void main() {
  fsUV = in_uv;
  fsNormal = inNormal; 
  fs_pos = inPosition;
  gl_Position = matrix * vec4(inPosition, 1.0);
}