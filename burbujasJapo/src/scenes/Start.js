export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/fondo.png');
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        const logo = this.add.image(640, 220, 'logo');

      const botonJugar = this.add.text(640, 550, 'Jugar', {
        fontFamily: 'Comic Sans MS, cursive',
        fontSize: '60px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // 2. Animación de "flotar" para el logo (la que ya tenías)
    this.tweens.add({
        targets: logo,
        y: 240, // Movimiento sutil
        duration: 1500,
        ease: 'Sine.inOut',
        yoyo: true,
        loop: -1
    });

    // 3. ¡Nueva animación para el botón Jugar! 
    // Así no pierdes ese efecto dinámico que buscabas
    this.tweens.add({
        targets: botonJugar,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 800,
        ease: 'Sine.inOut',
        yoyo: true,
        loop: -1
    });

    // Evento para empezar el juego
    botonJugar.on('pointerdown', () => {
        // this.scene.start('GameBubbles');
        console.log("Iniciando aventura...");
    });
    }

    update() {
        this.background.tilePositionX += 2;
    }
    
}
