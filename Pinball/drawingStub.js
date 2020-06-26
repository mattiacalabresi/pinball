// PATHS
var program;
var baseDir;
var shaderDir;
var modelsDir;

// CAMERA STATUS AND CONTROLS:
var viewX = 0;
var viewY = 17;
var viewZ = 0;
var viewPhi = -90 + 6.51;
var viewTheta = 180;

var viewXSpeed = 0;
var viewYSpeed = 0;
var viewZSpeed = 0;
var viewPhiSpeed = 0;
var viewThetaSpeed = 0;

const positionSpeed = 1;
const angleSpeed = 10;
const camera_dt = 1 / 30;

const viewXIncreaseKey = "ArrowLeft";   // move left
const viewXDecreaseKey = "ArrowRight";  // move right
const viewYIncreaseKey = "s";           // zoom in
const viewYDecreaseKey = "w";           // zoom out
const viewZIncreaseKey = "ArrowUp";     // move forward
const viewZDecreaseKey = "ArrowDown";   // move backward
const viewPhiIncreaseKey = "r";         // tilt up
const viewPhiDecreaseKey = "f";         // tilt down
const viewThetaIncreaseKey = "q";       // tilt left
const viewThetaDecreaseKey = "e";       // tilt right

window.addEventListener("keydown", handlePress);
window.addEventListener("keyup", handleRelease);

function handlePress(event) {
  switch (event.key) {
    case viewXIncreaseKey:
      return viewXSpeed = positionSpeed;
    case viewXDecreaseKey:
      return viewXSpeed = -positionSpeed;
    case viewYIncreaseKey:
      return viewYSpeed = positionSpeed;
    case viewYDecreaseKey:
      return viewYSpeed = -positionSpeed;
    case viewZIncreaseKey:
      return viewZSpeed = positionSpeed;
    case viewZDecreaseKey:
      return viewZSpeed = -positionSpeed;
    case viewPhiIncreaseKey:
      return viewPhiSpeed = angleSpeed;
    case viewPhiDecreaseKey:
      return viewPhiSpeed = -angleSpeed;
    case viewThetaIncreaseKey:
      return viewThetaSpeed = angleSpeed;
    case viewThetaDecreaseKey:
      return viewThetaSpeed = -angleSpeed;
    default:
      return 0;
  }
}

function handleRelease(event) {
  switch (event.key) {
    case viewXIncreaseKey:
    case viewXDecreaseKey:
      return viewXSpeed = 0;
    case viewYIncreaseKey:
    case viewYDecreaseKey:
      return viewYSpeed = 0;
    case viewZIncreaseKey:
    case viewZDecreaseKey:
      return viewZSpeed = 0;
    case viewPhiIncreaseKey:
    case viewPhiDecreaseKey:
      return viewPhiSpeed = 0;
    case viewThetaIncreaseKey:
    case viewThetaDecreaseKey:
      return viewThetaSpeed = 0;
    default:
      return 0;
  }
}

// MESHES
var ballMesh;
var bodyMesh;
var bumper1Mesh;
var bumper2Mesh;
var bumper3Mesh;
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
var pullerMesh;
var rightButtonMesh;
var rightFlipperMesh;

var allMeshes;

var texture;
var actualScore = 0;
const numUVs = [[0.735309, 0.956854, 0.760579, 0.918019, 0.760579, 0.956854, 0.735309, 0.918019],
                [0.636297, 0.996017, 0.661567, 0.957183, 0.661567, 0.996017, 0.636297, 0.957183],
                [0.660956, 0.996505, 0.686226, 0.957671, 0.686226, 0.996505, 0.660956, 0.957671],
                [0.685614, 0.996261, 0.710884, 0.957427, 0.710884, 0.996261, 0.685614, 0.957427],
                [0.710760, 0.996749, 0.736030, 0.957915, 0.736030, 0.996749, 0.710760, 0.957915],
                [0.735907, 0.996749, 0.761177, 0.957915, 0.761177, 0.996749, 0.735907, 0.957915],
                [0.635321, 0.956466, 0.660591, 0.917632, 0.660591, 0.956466, 0.635321, 0.917632],
                [0.660705, 0.956272, 0.685975, 0.917438, 0.685975, 0.956272, 0.660705, 0.917438],
                [0.684927, 0.956466, 0.710197, 0.917632, 0.710197, 0.956466, 0.684927, 0.917632],
                [0.710118, 0.956466, 0.735388, 0.917632, 0.735388, 0.956466, 0.710118, 0.917632]];

function main() {
  
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  // define directional light
  var dirLightAlpha = utils.degToRad(-60);
  var dirLightBeta = utils.degToRad(90);

  var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
  Math.sin(dirLightAlpha),
  Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
  ];
  var directionalLightColor = [1.0, 1.0, 1.0];

  // define material color 
  var materialColor = [1.0, 1.0, 1.0];

  // define ambient light color and material
  var ambientLight = [0.55, 0.1, 0.8];
  var ambientMat = [0.4, 0.2, 0.6];

  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  var uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
  var textLocation = gl.getUniformLocation(program, "in_texture");
  var matrixLocation = gl.getUniformLocation(program, "matrix");
  var ambientLightColorHandle = gl.getUniformLocation(program, "ambientLightCol");
  var ambientMaterialHandle = gl.getUniformLocation(program, "ambientMat");
  var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
  var lightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
  var lightColorHandle = gl.getUniformLocation(program, 'lightColor');
  var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');

  var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
  var vaos = new Array(allMeshes.length);

  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  var image = new Image();
  image.src = baseDir + "textures/StarWarsPinball.png";
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  };

  function addMeshToScene(i) {
    let mesh = allMeshes[i];
    let vao = gl.createVertexArray();
    vaos[i] = vao;
    gl.bindVertexArray(vao);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(uvAttributeLocation);
    gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
  }

  for (let i in allMeshes)
    addMeshToScene(i);

  function updateScoreTex() {
    if (actualScore != score) {
      actualScore = score;
      let scoreArr = Array.from(String(actualScore), Number).reverse();
      let scoreMeshes = [dr1Mesh, dr2Mesh, dr3Mesh, dr4Mesh, dr5Mesh, dr6Mesh];
      for (let i = 0; i < scoreArr.length; i++) {
        let digit = scoreArr[i];
        scoreMeshes[i].textures = numUVs[digit];
        addMeshToScene(i + 11);
      }
    }
  }

  function drawScene() {

    // update uv coordinates of dynamic score system  
    updateScoreTex();

    // adjust camera
    viewX += viewXSpeed * camera_dt;
    viewY += viewYSpeed * camera_dt;
    viewZ += viewZSpeed * camera_dt;
    viewPhi += viewPhiSpeed * camera_dt;
    viewTheta += viewThetaSpeed * camera_dt;

    // simulate one step of physics
    physicsMain();

    // clear scene
    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // compose view and light
    var viewMatrix = utils.MakeView(viewX, viewY, viewZ, viewPhi, viewTheta);

    // update world matrices for moving objects
    allLocalMatrices[0] = getBallLocalMatrix(ball.position.x, ball.position.y);
    allLocalMatrices[18] = getLeftFlipperLocalMatrix(leftFlipper.angle);
    allLocalMatrices[21] = getRightFlipperLocalMatrix(rightFlipper.angle);

    // add each mesh / object with its world matrix
    for (var i = 0; i < allMeshes.length; i++) {
      var worldViewMatrix = utils.multiplyMatrices(viewMatrix, allLocalMatrices[i]);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);

      var lightDirMatrix = utils.sub3x3from4x4(utils.transposeMatrix(allLocalMatrices[i]));
      var lightDirectionTransformed = utils.normalizeVec3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLight));

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));

      gl.uniform3fv(materialDiffColorHandle, materialColor);
      gl.uniform3fv(lightColorHandle, directionalLightColor);
      gl.uniform3fv(lightDirectionHandle, lightDirectionTransformed);
      gl.uniform3fv(ambientLightColorHandle, ambientLight);
      gl.uniform3fv(ambientMaterialHandle, ambientMat);

      gl.bindVertexArray(vaos[i]);
      gl.drawElements(gl.TRIANGLES, allMeshes[i].indices.length, gl.UNSIGNED_SHORT, 0);
    }

    window.requestAnimationFrame(drawScene);
  }

  drawScene();
}

async function init() {
  // initialize resource paths
  var path = window.location.pathname;
  var page = path.split("/").pop();
  baseDir = window.location.href.replace(page, '');
  shaderDir = baseDir + "shaders/";
  modelsDir = baseDir + "models/"

  // prepare canvas and body styles
  var canvas = document.createElement("canvas");
  canvas.style.backgroundColor = "white";
  gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("GL context not opened");
    return;
  }
  document.body.style.backgroundColor = "gray";
  document.body.style.overflow = 'hidden';
  document.body.style.margin = '0';
  document.body.appendChild(canvas);
  
  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  await utils.loadFiles([shaderDir + 'vertSh.glsl', shaderDir + 'fragSh.glsl'], function (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    //console.log(vertexShader);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
    program = utils.createProgram(gl, vertexShader, fragmentShader);

  });
  gl.useProgram(program);
  
  // load meshes from obj files
  ballMesh = await utils.loadMesh(modelsDir + "Ball.obj");
  bodyMesh = await utils.loadMesh(modelsDir + "Body.obj");
  bumper1Mesh = await utils.loadMesh(modelsDir + "Bumper1.obj");
  bumper2Mesh = await utils.loadMesh(modelsDir + "Bumper2.obj");
  bumper3Mesh = await utils.loadMesh(modelsDir + "Bumper3.obj");
  dl1Mesh = await utils.loadMesh(modelsDir + "DL1.obj");
  dl2Mesh = await utils.loadMesh(modelsDir + "DL2.obj");
  dl3Mesh = await utils.loadMesh(modelsDir + "DL3.obj");
  dl4Mesh = await utils.loadMesh(modelsDir + "DL4.obj");
  dl5Mesh = await utils.loadMesh(modelsDir + "DL5.obj");
  dl6Mesh = await utils.loadMesh(modelsDir + "DL6.obj");
  dr1Mesh = await utils.loadMesh(modelsDir + "DR1.obj");
  dr2Mesh = await utils.loadMesh(modelsDir + "DR2.obj");
  dr3Mesh = await utils.loadMesh(modelsDir + "DR3.obj");
  dr4Mesh = await utils.loadMesh(modelsDir + "DR4.obj");
  dr5Mesh = await utils.loadMesh(modelsDir + "DR5.obj");
  dr6Mesh = await utils.loadMesh(modelsDir + "DR6.obj");
  leftButtonMesh = await utils.loadMesh(modelsDir + "LeftButton.obj");
  leftFlipperMesh = await utils.loadMesh(modelsDir + "LeftFlipper.obj");
  pullerMesh = await utils.loadMesh(modelsDir + "Puller.obj");
  rightButtonMesh = await utils.loadMesh(modelsDir + "RightButton.obj");
  rightFlipperMesh = await utils.loadMesh(modelsDir + "RightFlipper.obj");

  allMeshes = [ballMesh, bodyMesh, bumper1Mesh, bumper2Mesh, bumper3Mesh, dl1Mesh, dl2Mesh, dl3Mesh, dl4Mesh, dl5Mesh, dl6Mesh,
    dr1Mesh, dr2Mesh, dr3Mesh, dr4Mesh, dr5Mesh, dr6Mesh, leftButtonMesh, leftFlipperMesh, pullerMesh, rightButtonMesh, rightFlipperMesh];

  displayControls();
  main();
  
  function displayControls() {
    console.log('GAME:');
    console.log('left flipper: ' + LEFT_FLIPPERS_KEY);
    console.log('right flipper: ' + RIGHT_FLIPPERS_KEY);
    console.log('launch ball: ' + (BALL_LAUNCH_KEY===' ' ? 'space' : BALL_LAUNCH_KEY));
    console.log('');
    console.log('CAMERA:');
    console.log('move forward: ' + viewZIncreaseKey);
    console.log('move backward: ' + viewZDecreaseKey);
    console.log('move left: ' + viewXIncreaseKey);
    console.log('move right: ' + viewXDecreaseKey);
    console.log('zoom in: ' + viewYDecreaseKey);
    console.log('zoom out: ' + viewYIncreaseKey);
    console.log('tilt up: ' + viewPhiIncreaseKey);
    console.log('tilt down: ' + viewPhiDecreaseKey);
    console.log('tilt left: ' + viewThetaIncreaseKey);
    console.log('tilt right: ' + viewThetaDecreaseKey);
  }
}

window.onload = init;