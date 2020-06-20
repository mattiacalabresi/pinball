var ballLocalMatrix         = utils.MakeWorld(-0.30053,   8.5335,  -5.9728,      0,        0,       0,     1);
var bodyLocalMatrix         = utils.MakeWorld( 0,         0,        0,           0,        0,       0,     1);
var bumper1LocalMatrix      = utils.MakeWorld( 1.1819,    9.1362,   0.020626,   -6.51,     0,       0,     1);
var bumper2LocalMatrix      = utils.MakeWorld(-1.5055,    9.1362,   0.020626,   -6.51,     0,       0,     1);
var bumper3LocalMatrix      = utils.MakeWorld(-0.11626,   9.1362,   0.020626,   -6.51,     0,       0,     1);
var dl1LocalMatrix          = utils.MakeWorld( 0.4366,   12.789,    4.1852,      0,     -101,       0,     1);
var dl2LocalMatrix          = utils.MakeWorld( 0.713,    12.789,    4.1852,      0,     -101,       0,     1);
var dl3LocalMatrix          = utils.MakeWorld( 0.9923,   12.789,    4.1852,      0,     -101,       0,     1);
var dl4LocalMatrix          = utils.MakeWorld( 1.3917,   12.789,    4.1852,      0,     -101,       0,     1);
var dl5LocalMatrix          = utils.MakeWorld( 1.6681,   12.789,    4.1852,      0,     -101,       0,     1);
var dl6LocalMatrix          = utils.MakeWorld( 1.9474,   12.789,    4.1852,      0,     -101,       0,     1);
var dr1LocalMatrix          = utils.MakeWorld(-2.8273,   12.789,    4.1852,      0,     -101,       0,     1);
var dr2LocalMatrix          = utils.MakeWorld(-2.5509,   12.789,    4.1852,      0,     -101,       0,     1);
var dr3LocalMatrix          = utils.MakeWorld(-2.2716,   12.789,    4.1852,      0,     -101,       0,     1);
var dr4LocalMatrix          = utils.MakeWorld(-1.8722,   12.789,    4.1852,      0,     -101,       0,     1);
var dr5LocalMatrix          = utils.MakeWorld(-1.5958,   12.789,    4.1852,      0,     -101,       0,     1);
var dr6LocalMatrix          = utils.MakeWorld(-1.316,    12.789,    4.1852,      0,     -101,       0,     1);
var leftButtonLocalMatrix   = utils.MakeWorld( 2.6175,    8.7853,  -6.6902,      0,        0,     -90,     1);
var leftFlipperLocalMatrix  = utils.MakeWorld( 0.6906,    8.4032,  -5.6357,     29.8,     -3.24,   -5.64,  1);
var pullerLocalMatrix       = utils.MakeWorld(-2.5264,    8.3925,  -7.5892,      0,      -90,       0,     1);
var rightButtonLocalMatrix  = utils.MakeWorld(-2.97,      8.7853,  -6.6902,      0,        0,      90,     1);
var rightFlipperLocalMatrix = utils.MakeWorld(-1.307,     8.4032,  -5.6357,    150,       -3.24,   -5.64,  1);

var allLocalMatrices = [ballLocalMatrix, bodyLocalMatrix, bumper1LocalMatrix, bumper2LocalMatrix, bumper3LocalMatrix, dl1LocalMatrix, dl2LocalMatrix, dl3LocalMatrix,
                        dl4LocalMatrix, dl5LocalMatrix, dl6LocalMatrix, dr1LocalMatrix, dr2LocalMatrix, dr3LocalMatrix, dr4LocalMatrix, dr5LocalMatrix, dr6LocalMatrix,
                        leftButtonLocalMatrix, leftFlipperLocalMatrix, pullerLocalMatrix, rightButtonLocalMatrix, rightFlipperLocalMatrix];