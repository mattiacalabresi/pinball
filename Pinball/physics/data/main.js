var ball = new Ball();
var gravity = new Vector(0, -GRAVITATIONAL_ACCELERATION);
new Bumper(new Vector(1, 6.7));
new Bumper(new Vector(2.3, 6.7));
new Bumper(new Vector(3.7, 6.7));
const LEFT = -.15;
new Wall(new Vector(LEFT, 0), new Vector(LEFT, BOARD_HEIGHT));
new Wall(new Vector(LEFT, BOARD_HEIGHT), new Vector(BOARD_WIDTH, BOARD_HEIGHT));
new Wall(new Vector(BOARD_WIDTH, BOARD_HEIGHT), new Vector(BOARD_WIDTH, 0));
const SHELVES_HEIGHT = 1.22
new Wall(new Vector(1.52, SHELVES_HEIGHT), new Vector(0, SHELVES_HEIGHT));
new Wall(new Vector(1.52, SHELVES_HEIGHT), new Vector(1.52, 0));
new Wall(new Vector(3.5, SHELVES_HEIGHT), new Vector(BOARD_WIDTH, SHELVES_HEIGHT));
new Wall(new Vector(3.5, SHELVES_HEIGHT), new Vector(3.5, 0));
var leftFlipper = new Flipper(new Vector(1.52, 1.2), true);
var rightFlipper = new Flipper(new Vector(3.5, 1.2), false);

const PULLER_RUN_MAX = .71;
const PULLER_SPEED_CHARGE = 1.03;
const PULLER_SPEED_DISCHARGE = -4.3;
var pullerRun = 0;
var pulling = false;

var dt = 1 / FRAMERATE / SUBSTEPS;

function physicsMain() {
    for (let i = 0; i < SUBSTEPS; i ++) {
        ball.update(gravity, dt);
        for (let wall of Wall.list)
            ball.checkCollisionWithWall(wall);

        for (let bumper of Bumper.list)
            ball.checkCollisionWithBumper(bumper);

        for (let flipper of Flipper.list) {
            flipper.update(dt);
            ball.checkCollisionWithFlipper(flipper);
        }
    }
    if(pulling)
        pullerRun = Math.min(PULLER_RUN_MAX, pullerRun + PULLER_SPEED_CHARGE / FRAMERATE);
    else
        pullerRun = Math.max(0, pullerRun + PULLER_SPEED_DISCHARGE / FRAMERATE);
}