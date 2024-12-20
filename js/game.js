var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // backgroundColor: '#4488aa',

    
    scene: {
        preload,
        create,
        update
    },

    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {x:100, y: 300}
        }
    }
}

var game = new Phaser.Game(config)
function preload() {
    this.load.image('background', 'assets/background.png')
    this.load.image('ground', 'assets/ground.png')
    this.load.image('bar', 'assets/bar.png')
    
    this.load.image('blue-ball', 'assets/blue-ball.png')
    this.load.image('red-ball', 'assets/red-ball.png')

    this.load.image('gameover', 'assets/gameover.png')
}

function create() {
    background = this.physics.add.staticGroup()
    background.create(400, 300, 'background')

    ground = this.physics.add.staticGroup()
    ground.create(400, 585, 'ground')

    bar = this.physics.add.sprite(400, 562, 'bar')
    bar.setCollideWorldBounds(true)
    this.physics.add.collider(bar, ground)

    cursors = this.input.keyboard.createCursorKeys()

    blue_balls = this.physics.add.group({
        key: 'blue-ball',
        repeat: 10,
        setXY: {x: 13, y: 0, stepX: 77}
    })

    blue_balls.children.iterate(function(child) {
        child.setBounce(1)
        child.setCollideWorldBounds(true)
    })

    red_balls = this.physics.add.group({
        key: 'red-ball',
        repeat: 1,
        setXY: {x: Phaser.Math.Between(1, 100), y: 0, stepX: Phaser.Math.Between(1, 690)}
    })

    red_balls.children.iterate(function(child) {
        child.setBounce(1)
        child.setCollideWorldBounds(true)
    })

    this.physics.add.collider(bar, blue_balls)
    this.physics.add.overlap(ground, blue_balls, disable_ball, null, this)

    this.physics.add.collider(ground, red_balls)
    this.physics.add.overlap(bar, red_balls, disable_ball, null, this)
}

var game_over = false
function disable_ball(ground, ball) {
    ball.disableBody(true, true)

    if (red_balls.countActive(true) === 1) {
        bar.setTint(0xff6347)
        background.setTint(0x032606)
    }

    if (red_balls.countActive(true) === 0  || blue_balls.countActive(true) === 0) {
        bar.setTint(0xff0000)
        background.setTint(0x0B0909)
        this.add.image(400, 300, 'gameover').setScale(1/3)
        game_over = true
        this.physics.pause()
        
    }
}

function update() {
    if (game_over) return

    if (cursors.left.isDown) { bar.setVelocityX(-200) } 
    else if (cursors.right.isDown) { bar.setVelocityX(200) } 
    else { bar.setVelocityX(0) }
}

