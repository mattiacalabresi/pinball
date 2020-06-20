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

var viewX = -6;
var viewY = 17;
var viewZ = -8;
var viewPhi = -45;
var viewTheta = -225;

var viewXSpeed = 0;
var viewYSpeed = 0;
var viewZSpeed = 0;
var viewPhiSpeed = 0;
var viewThetaSpeed = 0;

const positionSpeed = 1;
const angleSpeed = 10;
const dt = 1/30;

const viewXIncreaseKey = "d";
const viewXDecreaseKey = "a";
const viewYIncreaseKey = "w";
const viewYDecreaseKey = "s";
const viewZIncreaseKey = "e";
const viewZDecreaseKey = "q";
const viewPhiIncreaseKey = "r";
const viewPhiDecreaseKey = "f";
const viewThetaIncreaseKey = "t";
const viewThetaDecreaseKey = "g";

window.addEventListener("keydown", handlePress);
window.addEventListener("keyup", handleRelease);

function handlePress(event) {
	switch(event.key) {
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
	switch(event.key) {
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

var ballMesh = new OBJ.Mesh(ballStr);
var bodyMesh = new OBJ.Mesh(bodyStr);
var bumper1Mesh = new OBJ.Mesh(bumper1Str);
var bumper2Mesh = new OBJ.Mesh(bumper2Str);
var bumper3Mesh = new OBJ.Mesh(bumper3Str);
var dl1Mesh = new OBJ.Mesh(dl1Str);
var dl2Mesh = new OBJ.Mesh(dl2Str);
var dl3Mesh = new OBJ.Mesh(dl3Str);
var dl4Mesh = new OBJ.Mesh(dl4Str);
var dl5Mesh = new OBJ.Mesh(dl5Str);
var dl6Mesh = new OBJ.Mesh(dl6Str);
var dr1Mesh = new OBJ.Mesh(dr1Str);
var dr2Mesh = new OBJ.Mesh(dr2Str);
var dr3Mesh = new OBJ.Mesh(dr3Str);
var dr4Mesh = new OBJ.Mesh(dr4Str);
var dr5Mesh = new OBJ.Mesh(dr5Str);
var dr6Mesh = new OBJ.Mesh(dr6Str);
var leftButtonMesh = new OBJ.Mesh(leftButtonStr);
var leftFlipperMesh = new OBJ.Mesh(leftFlipperStr);
var pullerMesh = new OBJ.Mesh(pullerStr);
var rightButtonMesh = new OBJ.Mesh(rightButtonStr);
var rightFlipperMesh = new OBJ.Mesh(rightFlipperStr);

var allMeshes = [ballMesh, bodyMesh, bumper1Mesh, bumper2Mesh, bumper3Mesh, dl1Mesh, dl2Mesh, dl3Mesh, dl4Mesh, dl5Mesh, dl6Mesh,
				dr1Mesh, dr2Mesh, dr3Mesh, dr4Mesh, dr5Mesh, dr6Mesh, leftButtonMesh, leftFlipperMesh, pullerMesh, rightButtonMesh, rightFlipperMesh];

function main() {

	var program = null;

	//define directional light
	var dirLightAlpha = utils.degToRad(-60);
	var dirLightBeta = utils.degToRad(90);

	var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
	Math.sin(dirLightAlpha),
	Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
	];
	var directionalLightColor = [0.1, 1.0, 1.0];

	//Define material color
	var materialColor = [0.5, 0.5, 0.5];

	var canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	document.body.style.backgroundColor = "gray";
	canvas.style.backgroundColor = "white";

	var gl = canvas.getContext("webgl2");
	if (!gl) {
		document.write("GL context not opened");
		return;
	}
	utils.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0.85, 0.85, 0.85, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

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
	var vaos = new Array(allMeshes.length);

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

		var normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(normalAttributeLocation);
		gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
	}

	for(let i in allMeshes)
		addMeshToScene(i);
		
	function drawScene() {

		viewX += viewXSpeed * dt;
		viewY += viewYSpeed * dt;
		viewZ += viewZSpeed * dt;
		viewPhi += viewPhiSpeed * dt;
		viewTheta += viewThetaSpeed * dt;

		gl.clearColor(0.85, 0.85, 0.85, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		var viewMatrix = utils.MakeView(viewX, viewY, viewZ, viewPhi, viewTheta);
		var lightDirMatrix = utils.invertMatrix(utils.transposeMatrix(viewMatrix));//viewMatrix;
		var lightDirectionTransformed = utils.multiplyMatrix3Vector3(utils.sub3x3from4x4(lightDirMatrix), directionalLight);

		for (var i = 0; i < allMeshes.length; i ++) {
			var worldViewMatrix = utils.multiplyMatrices(viewMatrix, allLocalMatrices[i]);
			var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);

			gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
			var cubeNormalMatrix = utils.invertMatrix(utils.transposeMatrix(worldViewMatrix));

			gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(cubeNormalMatrix));

			gl.uniform3fv(materialDiffColorHandle, materialColor);
			gl.uniform3fv(lightColorHandle, directionalLightColor);
			gl.uniform3fv(lightDirectionHandle, lightDirectionTransformed);

			gl.bindVertexArray(vaos[i]); 
			gl.drawElements(gl.TRIANGLES, allMeshes[i].indices.length, gl.UNSIGNED_SHORT, 0);
		}

		window.requestAnimationFrame(drawScene);
	}

	drawScene();
}

window.onload = main;