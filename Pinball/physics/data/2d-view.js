const SCALE = 48;
const BACKGROUND_COLOR = "rgb(0, 12, 24)";
const FOREGROUND_COLOR = "rgb(224, 240, 255)";
const OUTLINE_COLOR = "rgb(0, 128, 255)";

let canvas = document.createElement("canvas");
canvas.width = BOARD_WIDTH * SCALE;
canvas.height = BOARD_HEIGHT * SCALE;
canvas.style.width = BOARD_WIDTH * SCALE + "px";
canvas.style.height = BOARD_HEIGHT * SCALE + "px";
canvas.style.border = "3px solid " + OUTLINE_COLOR;
document.body.style.backgroundColor = BACKGROUND_COLOR;
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(0, 12, 24, .3)";
ctx.strokeStyle = FOREGROUND_COLOR;
ctx.lineWidth = 1 / SCALE;
ctx.lineCap = "round";
ctx.font = "10px bahnschrift";
ctx.scale(SCALE, SCALE);
ctx.translate(0, BOARD_HEIGHT);

function circle(position, radius) {
    ctx.beginPath();
    ctx.arc(position.x, -position.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function line(start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, -start.y);
    ctx.lineTo(end.x, -end.y);
    ctx.stroke();
}