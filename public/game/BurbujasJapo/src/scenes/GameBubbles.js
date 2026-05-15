// "Every great game begins with a single scene. Let's make this one unforgettable!"
export default class Game extends Phaser.Scene {
    constructor() {
        super('GameBubbles');
    }

    init() {
        
    }

    preload() {
        this.load.image('bloque', './assets/bloquesuelo.png');
        this.load.image('fondo', './assets/fondogamebubbles.png');
        this.load.image('burbuja', './assets/burbuja.png');
        this.load.image('jugador', './assets/setaJugadora.png');
    }

    create() {
        this.fondo = this.add.tileSprite(0, 0, 1280, 720, 'fondo').setOrigin(0, 0);
        this.suelo = this.add.tileSprite(0,670, 1280, 50, 'bloque').setOrigin(0, 0);
        this.jugador = this.physics.add.sprite(100, 600, 'jugador').setScale(0.5);
        this.burbujas = this.physics.add.group();
        this.physics.add.collider(this.jugador, this.suelo);
        this.physics.add.overlap(this.jugador, this.burbujas, this.recolectarBurbuja, null, this);
    }

}
