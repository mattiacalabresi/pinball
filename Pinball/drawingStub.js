// PATHS
var program;
var baseDir;
var shaderDir;
var modelsDir;

// CAMERA STATUS AND CONTROLS:
var viewX = 0;
var viewY = 15;
var viewZ = -7.3;
var viewPhi = -54;
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
const viewYIncreaseKey = "s";           // move down
const viewYDecreaseKey = "w";           // move up
const viewZIncreaseKey = "ArrowUp";     // move forward
const viewZDecreaseKey = "ArrowDown";   // move backward
const viewPhiIncreaseKey = "r";         // tilt up
const viewPhiDecreaseKey = "f";         // tilt down
const viewThetaIncreaseKey = "e";       // pan left
const viewThetaDecreaseKey = "q";       // pan right

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

// SCORE SYSTEM
var actualScore = 0;
var ballCounter;
var gameOverBg;
var gameOverMsg;
var loadingBg;
var loadingMsg;

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
  var dirLightBeta = utils.degToRad(50);

  var directionalLightA = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
  Math.sin(dirLightAlpha),
  Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
  ];
  var directionalLightColorA = [0.85, 0.35, 0.35];

  var directionalLightB = [-Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
  Math.sin(dirLightAlpha),
  Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
  ];
  var directionalLightColorB = [0.35, 0.35, 0.85];

  // define material color 
  var materialColor = [1.0, 1.0, 1.0];

  // define ambient light color and material
  var ambientLight = [0.55, 0.1, 0.8];
  var ambientMat = [0.4, 0.2, 0.6];
    
  //define specular component of color
  var specularColor = [1.0, 1.0, 1.0];
  var specShine = 2.0;
    
  //define emission color for digital score
  var emission = [1.0, 0.0, 0.0];    

  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  var uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
  var textLocation = gl.getUniformLocation(program, "in_texture");
  var matrixLocation = gl.getUniformLocation(program, "matrix");
  var eyePositionHandle = gl.getUniformLocation(program, "eyePos");    
  var ambientLightColorHandle = gl.getUniformLocation(program, "ambientLightCol");
  var ambientMaterialHandle = gl.getUniformLocation(program, "ambientMat");
  var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
  var specularColorHandle = gl.getUniformLocation(program, "specularColor");
  var shineSpecularHandle = gl.getUniformLocation(program, "specShine");
  var emissionColorHandle = gl.getUniformLocation(program, "emit");    
  var lightDirectionHandleA = gl.getUniformLocation(program, 'lightDirectionA');
  var lightColorHandleA = gl.getUniformLocation(program, 'lightColorA');
  var lightDirectionHandleB = gl.getUniformLocation(program, 'lightDirectionB');
  var lightColorHandleB = gl.getUniformLocation(program, 'lightColorB');


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
    
  // loading complete: dismiss loading screen
  loadingBg.style.opacity = 0.0;
  loadingMsg.style.opacity = 0.0;

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
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    // compose view and light
    var viewMatrix = utils.MakeView(viewX, viewY, viewZ, viewPhi, viewTheta);

    // update world matrices for moving objects
    allLocalMatrices[0] = getBallLocalMatrix(ball.position.x, ball.position.y);
    allLocalMatrices[18] = getLeftFlipperLocalMatrix(leftFlipper.angle);
    allLocalMatrices[19] = getPullerLocalMatrix(pullerRun);
    allLocalMatrices[21] = getRightFlipperLocalMatrix(rightFlipper.angle);

    // add each mesh / object with its world matrix
    for (var i = 0; i < allMeshes.length; i++) {
      var worldViewMatrix = utils.multiplyMatrices(viewMatrix, allLocalMatrices[i]);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);

      var lightDirMatrix = utils.sub3x3from4x4(utils.transposeMatrix(allLocalMatrices[i]));
      var lightDirectionTransformedA = utils.normalizeVec3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightA));
      var lightDirectionTransformedB = utils.normalizeVec3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightB));

      var eyePositionMatrix = utils.invertMatrix(allLocalMatrices[i]);
      var eyePositionTransformed = utils.normalizeVec3(utils.multiplyMatrix3Vector3(eyePositionMatrix, [viewX, viewY, viewZ]));    

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      
      gl.uniform3fv(eyePositionHandle, eyePositionTransformed);    
      gl.uniform3fv(materialDiffColorHandle, materialColor);
      gl.uniform3fv(lightColorHandleA, directionalLightColorA);
      gl.uniform3fv(lightDirectionHandleA, lightDirectionTransformedA);
      gl.uniform3fv(lightColorHandleB, directionalLightColorB);
      gl.uniform3fv(lightDirectionHandleB, lightDirectionTransformedB);
      gl.uniform3fv(ambientLightColorHandle, ambientLight);
      gl.uniform3fv(ambientMaterialHandle, ambientMat);
      gl.uniform3fv(specularColorHandle, specularColor);
      gl.uniform1f(shineSpecularHandle, specShine);
        
      if (i >= 5 && i <=16)   
          gl.uniform3fv(emissionColorHandle, emission);
      else
          gl.uniform3fv(emissionColorHandle, [0.0, 0.0, 0.0]);
          
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(textLocation, 0);

      gl.bindVertexArray(vaos[i]);
      gl.drawElements(gl.TRIANGLES, allMeshes[i].indices.length, gl.UNSIGNED_SHORT, 0);
    }

    window.requestAnimationFrame(drawScene);
  }
  
  drawScene();
}


// Global references to sounds
var soundBumper1;
var soundBumper2;
var soundBumper3;
var soundFlipperDown;
var soundFlipperUp;
var soundLaunch;
var soundPuller;
var soundReload;
var soundWall1;
var soundWall2;
var soundWall3;

/**
 * 
 * @param {HTMLAudioElement} sound 
 */
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

async function init() {
  soundBumper1 = document.getElementById("sound_bumper1");
  soundBumper2 = document.getElementById("sound_bumper2");
  soundBumper3 = document.getElementById("sound_bumper3");
  soundFlipperDown = document.getElementById("sound_flipper_down");
  soundFlipperUp = document.getElementById("sound_flipper_up");
  soundLaunch = document.getElementById("sound_launch");
  soundPuller = document.getElementById("sound_puller");
  soundReload = document.getElementById("sound_reload");
  soundWall1 = document.getElementById("sound_wall1");
  soundWall2 = document.getElementById("sound_wall2");
  soundWall3 = document.getElementById("sound_wall3");

  setupCanvas();
  loadShaders();
  await loadMeshes();
  displayControls();
  main();

  // prepare canvas and body styles
  function setupCanvas() {
    var canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl2");

    if (!gl) {
      document.write("GL context not opened");
      return;
    }
    utils.resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  //load shaders
  async function loadShaders() {
    // initialize resource paths
    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    shaderDir = baseDir + "shaders/";
    modelsDir = baseDir + "models/"

    // load vertex and fragment shaders from file
    await utils.loadFiles([shaderDir + 'vertSh.glsl', shaderDir + 'fragSh.glsl'], function (shaderText) {
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      //console.log(vertexShader);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
      program = utils.createProgram(gl, vertexShader, fragmentShader);

    });
    gl.useProgram(program);
  }

  // load meshes from obj files
  async function loadMeshes() {
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
  }

  // displays the pinball controls
  function displayControls() {
    // displaying game controls
    let gameControls = document.getElementById("gameControls");
    let gc1 = document.createElement("li");
    let gc2 = document.createElement("li");
    let gc3 = document.createElement("li");

    gc1.innerHTML = "Left Flipper: " + LEFT_FLIPPERS_KEY;
    gc2.innerHTML = "Right Flipper: " + RIGHT_FLIPPERS_KEY;
    gc3.innerHTML = "Launch Ball: " + (BALL_LAUNCH_KEY === " " ? "space" : BALL_LAUNCH_KEY);

    gameControls.appendChild(gc1);
    gameControls.appendChild(gc2);
    gameControls.appendChild(gc3);

    // displaying camera controls
    let cameraControls = document.getElementById("cameraControls");
    let cc1 = document.createElement("li");
    let cc2 = document.createElement("li");
    let cc3 = document.createElement("li");
    let cc4 = document.createElement("li");
    let cc5 = document.createElement("li");
    let cc6 = document.createElement("li");
    let cc7 = document.createElement("li");
    let cc8 = document.createElement("li");
    let cc9 = document.createElement("li");
    let cc10 = document.createElement("li");

    cc1.innerHTML = "Move Forward: " + (viewZIncreaseKey === "ArrowUp" ? "🡱" : viewZIncreaseKey);
    cc2.innerHTML = "Move Backward: " + (viewZDecreaseKey === "ArrowDown" ? "🡳" : viewZDecreaseKey);
    cc3.innerHTML = "Move Left: " + (viewXIncreaseKey === "ArrowLeft" ? "🡰" : viewXIncreaseKey);
    cc4.innerHTML = "Move Right: " + (viewXDecreaseKey === "ArrowRight" ? "🡲" : viewXDecreaseKey);
    cc5.innerHTML = "Move Up: " + viewYIncreaseKey;
    cc6.innerHTML = "Move Down: " + viewYDecreaseKey;
    cc7.innerHTML = "Tilt Up: " + viewPhiIncreaseKey;
    cc8.innerHTML = "Tilt Down: " + viewPhiDecreaseKey;
    cc9.innerHTML = "Pan Left: " + viewThetaIncreaseKey;
    cc10.innerHTML = "Pan right: " + viewThetaDecreaseKey;

    cameraControls.appendChild(cc1);
    cameraControls.appendChild(cc2);
    cameraControls.appendChild(cc3);
    cameraControls.appendChild(cc4);
    cameraControls.appendChild(cc5);
    cameraControls.appendChild(cc6);
    cameraControls.appendChild(cc7);
    cameraControls.appendChild(cc8);
    cameraControls.appendChild(cc9);
    cameraControls.appendChild(cc10);

    // preload ballsCounter, gameOver and loading elements
    ballCounter = document.getElementById("ballCounter");
    gameOverBg = document.getElementById("gameOverBg");
    gameOverMsg = document.getElementById("gameOverMsg");
    loadingBg = document.getElementById("loadingBg");
    loadingMsg = document.getElementById("loadingMsg");
    
    updateBallCounter(lives, false);
  }
}

function updateBallCounter(balls, gameOver) {
  ballCounter.innerHTML = "Balls " + balls;

  if (gameOver) {
    gameOverBg.style.opacity = 0.5;
    gameOverMsg.style.opacity = 1.0;
  }
}

window.onload = init;