var ball = new Ball();
var gravity = new Vector(0, -GRAVITATIONAL_ACCELERATION);
new Bumper(new Vector(6, 9));
new Bumper(new Vector(7.5, 11.5));
new Bumper(new Vector(4.5, 11.5));
new Bumper(new Vector(6, 14));
new Wall(new Vector(2, 16), new Vector(2, 2));
new Wall(new Vector(10, 16), new Vector(10, 2));
new Wall(new Vector(4, 1), new Vector(4, 6));
new Wall(new Vector(8, 1), new Vector(8, 6));
new Wall(new Vector(3, 17), new Vector(9, 17));
new Wall(new Vector(2, 16), new Vector(3, 17));
new Wall(new Vector(9, 17), new Vector(10, 16));
new Flipper(new Vector(4, 3), true);
new Flipper(new Vector(8, 3), false);
new Flipper(new Vector(2, 7), true);
new Flipper(new Vector(10, 7), false);

var dt = 1 / FRAMERATE / SUBSTEPS;


function frameMain() {
    ctx.fillRect(0, 0, BOARD_WIDTH, -BOARD_HEIGHT);

    for(let i = 0; i < SUBSTEPS; i ++) {
    ball.update(gravity, dt);
        for(let wall of Wall.list) {
            ball.checkCollisionWithWall(wall);
        }
        for(let bumper of Bumper.list) {
            ball.checkCollisionWithBumper(bumper);
        }
        for(let flipper of Flipper.list) {
            flipper.update(dt);
            ball.checkCollisionWithFlipper(flipper);
        }
    }
    for(let wall of Wall.list)
        line(wall.start, wall.end);
    for(let bumper of Bumper.list)
        circle(bumper.position, BUMPER_RADIUS);
    for(let flipper of Flipper.list)
        line(flipper.position, flipper.extremity);

    circle(ball.position, BALL_RADIUS);


    window.requestAnimationFrame(frameMain);
}

window.requestAnimationFrame(frameMain);