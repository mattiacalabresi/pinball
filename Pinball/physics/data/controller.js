window.addEventListener("keydown", handleDown);
window.addEventListener("keyup", handleUp);

const LEFT_FLIPPERS_KEY = "x";
const RIGHT_FLIPPERS_KEY = "n";
const BALL_LAUNCH_KEY = " ";

function handleDown(event) {
    if (event.key === LEFT_FLIPPERS_KEY) {
        leftFlipper.active = true;
        if(leftFlipper.angleRatio < .8)
            playSound(soundFlipperUp);
    }
    if (event.key === RIGHT_FLIPPERS_KEY) {
        rightFlipper.active = true;
        if(rightFlipper.angleRatio < .8)
            playSound(soundFlipperUp);
    }
    if (event.key === BALL_LAUNCH_KEY) {
        pulling = true;
    }
}
function handleUp(event) {
    if (event.key === LEFT_FLIPPERS_KEY) {
        leftFlipper.active = false;
        playSound(soundFlipperDown);
    }
    if (event.key === RIGHT_FLIPPERS_KEY) {
        rightFlipper.active = false;
        playSound(soundFlipperDown);
    }
    if (event.key === BALL_LAUNCH_KEY) {
        pulling = !!ball.launch(pullerRun);
        playSound(soundPuller);
    }
}