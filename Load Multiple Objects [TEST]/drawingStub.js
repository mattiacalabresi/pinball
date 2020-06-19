var vs = `#version 300 es

in vec3 inPosition;
in vec3 inNormal;
out vec3 fsNormal;

uniform mat4 matrix; 
uniform mat4 nMatrix;     //matrix to transform normals

void main() {
  fsNormal = mat3(nMatrix) * inNormal; 
  gl_Position = matrix * vec4(inPosition, 1.0);
}`;

var fs = `#version 300 es

precision mediump float;

in vec3 fsNormal;
out vec4 outColor;

uniform vec3 mDiffColor;
uniform vec3 lightDirection; 
uniform vec3 lightColor;   

void main() {

  vec3 nNormal = normalize(fsNormal);
  vec3 lDir = lightDirection; 
  vec3 lambertColor = mDiffColor * lightColor * dot(-lDir,nNormal);
  outColor = vec4(clamp(lambertColor, 0.0, 1.0), 1.0);
}`;

var program;
var gl;

var baseDir;

var ballMesh;
var bodyMesh;
var bumper1Mesh;
var bumper2Mesh;
var bumper3ath;
var dl1Mesh;
var dl2Mesh;
var dl3Mesh;
var dl4Mesh;
var dl5Mesh;
var dl6Mesh;
var dr1Mesh;
var dr2Mesh;
var dr3Mesh;
var dr4Mesh;
var dr5Mesh;
var dr6Mesh;
var leftButtonMesh;
var leftFlipperMesh;
var rightButtonMesh;
var rightFlipperMesh;

var currentMesh;

function main() {

  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  var cubeWorldMatrix = new Array();    //One world matrix for each cube...

  //define directional light
  var dirLightAlpha = -utils.degToRad(60);
  var dirLightBeta = -utils.degToRad(120);

  var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
  Math.sin(dirLightAlpha),
  Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
  ];
  var directionalLightColor = [0.1, 1.0, 1.0];

  //Define material color
  var cubeMaterialColor = [0.5, 0.5, 0.5];

  cubeWorldMatrix[0] = utils.MakeWorld(-3.0, 0.0, -1.5, 0.0, 0.0, 0.0, 0.5);
  cubeWorldMatrix[1] = utils.MakeWorld(3.0, 0.0, -1.5, 0.0, 0.0, 0.0, 0.5);
  cubeWorldMatrix[2] = utils.MakeWorld(0.0, 0.0, -3.0, 0.0, 0.0, 0.0, 0.5);
  cubeWorldMatrix[3] = utils.MakeWorld(-3.0, 0.0, 1.5, 0.0, 0.0, 0.0, 0.5);

  var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, vs);
  var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fs);
  var program = utils.createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  var matrixLocation = gl.getUniformLocation(program, "matrix");
  var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
  var lightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
  var lightColorHandle = gl.getUniformLocation(program, 'lightColor');
  var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');

  var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

  var vao = gl.createVertexArray();

  gl.bindVertexArray(vao);
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(currentMesh.vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(currentMesh.vertexNormals), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(currentMesh.indices), gl.STATIC_DRAW);

  drawScene();

  function drawScene() {

    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var viewMatrix = utils.MakeView(3.0, 3.0, 2.5, -45.0, -40.0);
    var lightDirMatrix = utils.invertMatrix(utils.transposeMatrix(viewMatrix));//viewMatrix;
    var lightDirectionTransformed = utils.multiplyMatrix3Vector3(utils.sub3x3from4x4(lightDirMatrix), directionalLight);

    for (i = 0; i < 4; i++) {
      var worldViewMatrix = utils.multiplyMatrices(viewMatrix, cubeWorldMatrix[i]);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      var cubeNormalMatrix = utils.invertMatrix(utils.transposeMatrix(worldViewMatrix));

      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(cubeNormalMatrix));

      gl.uniform3fv(materialDiffColorHandle, cubeMaterialColor);
      gl.uniform3fv(lightColorHandle, directionalLightColor);
      gl.uniform3fv(lightDirectionHandle, lightDirectionTransformed);

      gl.bindVertexArray(vao);
      gl.drawElements(gl.TRIANGLES, currentMesh.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    window.requestAnimationFrame(drawScene);
  }
}

async function init() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  baseDir = window.location.href.replace(page, '') + '/models/';

  var ballStr = await utils.get_objstr(baseDir + 'Ball.obj');
  var bodyStr = await utils.get_objstr(baseDir + 'Body.obj');
  var bumper1Str = await utils.get_objstr(baseDir + 'Bumper1.obj');
  var bumper2Str = await utils.get_objstr(baseDir + 'Bumper2.obj');
  var bumper3Str = await utils.get_objstr(baseDir + 'Bumper3.obj');
  var dl1Str = await utils.get_objstr(baseDir + 'DL1.obj');
  var dl2Str = await utils.get_objstr(baseDir + 'DL2.obj');
  var dl3Str = await utils.get_objstr(baseDir + 'DL3.obj');
  var dl4Str = await utils.get_objstr(baseDir + 'DL4.obj');
  var dl5Str = await utils.get_objstr(baseDir + 'DL5.obj');
  var dl6Str = await utils.get_objstr(baseDir + 'DL6.obj');
  var dr1Str = await utils.get_objstr(baseDir + 'DR1.obj');
  var dr2Str = await utils.get_objstr(baseDir + 'DR2.obj');
  var dr3Str = await utils.get_objstr(baseDir + 'DR3.obj');
  var dr4Str = await utils.get_objstr(baseDir + 'DR4.obj');
  var dr5Str = await utils.get_objstr(baseDir + 'DR5.obj');
  var dr6Str = await utils.get_objstr(baseDir + 'DR6.obj');
  var leftButtonStr = await utils.get_objstr(baseDir + 'LeftButton.obj');
  var leftFlipperStr = await utils.get_objstr(baseDir + 'LeftFlipper.obj');
  var rightButtonStr = await utils.get_objstr( baseDir + 'RightButton.obj');
  var rightFlipperStr = await utils.get_objstr(baseDir + 'RightFlipper.obj');

  /**
   * @type {HTMLCanvasElement}
   */
  var canvas = document.getElementById("c");
  gl = canvas.getContext("webgl2");

  if (!gl) {
    document.write("GL context not opened");
    return;
  }

  gl.useProgram(program);

  ballMesh = new OBJ.Mesh(ballStr);
  bodyMesh = new OBJ.Mesh(bodyStr);
  bumper1Mesh = new OBJ.Mesh(bumper1Str);
  bumper2Mesh = new OBJ.Mesh(bumper2Str);
  bumper3Mesh = new OBJ.Mesh(bumper3Str);
  dl1Mesh = new OBJ.Mesh(dl1Str);
  dl2Mesh = new OBJ.Mesh(dl2Str);
  dl3Mesh = new OBJ.Mesh(dl3Str);
  dl4Mesh = new OBJ.Mesh(dl4Str);
  dl5Mesh = new OBJ.Mesh(dl5Str);
  dl6Mesh = new OBJ.Mesh(dl6Str);
  dr1Mesh = new OBJ.Mesh(dr1Str);
  dr2Mesh = new OBJ.Mesh(dr2Str);
  dr3Mesh = new OBJ.Mesh(dr3Str);
  dr4Mesh = new OBJ.Mesh(dr4Str);
  dr5Mesh = new OBJ.Mesh(dr5Str);
  dr6Mesh = new OBJ.Mesh(dr6Str);
  leftButtonMesh = new OBJ.Mesh(leftButtonStr);
  leftFlipperMesh = new OBJ.Mesh(leftFlipperStr);
  rightButtonMesh = new OBJ.Mesh(rightButtonStr);
  rightFlipperMesh = new OBJ.Mesh(rightFlipperStr);
  
  currentMesh = leftFlipperMesh;

  main();
}

window.onload = init;