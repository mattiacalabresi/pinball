window.addEventListener("keydown", handleDown);
window.addEventListener("keyup", handleUp);

const LEFT_FLIPPERS_KEY = "x";
const RIGHT_FLIPPERS_KEY = "n";
const BALL_LAUNCH_KEY = " ";

function handleDown(event) {
    if (event.key === LEFT_FLIPPERS_KEY)
        Flipper.list.filter(f => f.isLeft).forEach(f => f.active = true);
    if (event.key === RIGHT_FLIPPERS_KEY)
        Flipper.list.filter(f => !f.isLeft).forEach(f => f.active = true);
    if (event.key === BALL_LAUNCH_KEY)
        pulling = true;
}
function handleUp(event) {
    if (event.key === LEFT_FLIPPERS_KEY)
        Flipper.list.filter(f => f.isLeft).forEach(f => f.active = false);
    if (event.key === RIGHT_FLIPPERS_KEY)
        Flipper.list.filter(f => !f.isLeft).forEach(f => f.active = false);
    if (event.key === BALL_LAUNCH_KEY)
        pulling = !!ball.launch(pullerRun);
}