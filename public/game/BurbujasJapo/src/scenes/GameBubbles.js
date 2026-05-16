// "Every great game begins with a single scene. Let's make this one unforgettable!"
export default class Game extends Phaser.Scene {
    constructor() {
        super('GameBubbles');
    }

    init() {
        // Aquí puedes inicializar variables si lo necesitas
    }

    preload() {
        this.load.image('bloque', './assets/bloquesuelo.png');
        this.load.image('fondo', './assets/fondogamebubbles.png');
        this.load.image('burbuja', './assets/burbuja.png');
        this.load.image('jugador', './assets/setaJugadora.png');
        this.load.image('jugadorDeLado', './assets/setaJugadoraDeLado.png');
    }

    create() {
        // 1. Fondos y escenario
        this.fondo = this.add.tileSprite(0, 0, 1280, 720, 'fondo').setOrigin(0, 0);
        this.suelo = this.add.tileSprite(0, 670, 1280, 50, 'bloque').setOrigin(0, 0);

        // ¡Súper importante! Le damos físicas al suelo para que sea estático
        this.physics.add.existing(this.suelo, true);

        // 2. Jugador (guardado en 'this' para usarlo en el update)
        this.jugador = this.physics.add.sprite(100, 600, 'jugador').setScale(0.17);

        // 3. Grupo de burbujas (necesario para el overlap)
        this.burbujas = this.physics.add.group();

        // 4. Teclado (lo creamos una sola vez aquí en create, no en update)
        this.cursors = this.input.keyboard.createCursorKeys();

        // 5. Colisiones y Overlaps
        this.physics.add.collider(this.jugador, this.suelo);
        this.physics.add.overlap(this.jugador, this.burbujas, this.recolectarBurbuja, null, this);

        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        }
        );
        // Efecto de respiración para la seta
        this.tweens.add({
            targets: this.jugador, // si pones mas personajes seria [this.jugador, this.mapache], las img de lado respiran por que es un solo un disfraz
            scaleY: 0.16,          // Se encoge un pelín verticalmente (empezó en 0.17)
            duration: 1000,        // Tarda 1 segundo (1000ms) en encogerse
            yoyo: true,            // Al terminar, vuelve a su tamaño original (estirarse)
            repeat: -1,            // Se repite infinitamente (-1)
            ease: 'Sine.easeInOut' // Hace que el movimiento sea suave y orgánico al principio y al final
        });
    } // <-- Aquí se cierra create() correctamente

    update() {
        const quiereSaltar = this.cursors.up.isDown || this.wasd.up.isDown;
        const estaEnElSuelo = this.jugador.body.touching.down;
        console.log(`¿Está en el suelo? ${estaEnElSuelo}`);

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.jugador.setVelocityX(-500);
            this.jugador.setTexture('jugadorDeLado');
            this.jugador.setFlipX(true);  //se voltea la img

        }

        else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.jugador.setVelocityX(500);
            this.jugador.setTexture('jugadorDeLado');
            this.jugador.setFlipX(false);;

        }

        else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.jugador.setScale(0.17, 0.09);
            this.jugador.setVelocityX(0);  //sin eso patina

            this.jugador.setTexture('jugadorDeLado');


        }

        // Quieto
        else {
            this.jugador.setVelocityX(0);
            this.jugador.setTexture('jugador');

        }
        // 3. SOLO salta si se cumplen las dos cosas a la vez
        if (quiereSaltar && estaEnElSuelo) {
            this.jugador.setVelocityY(-450); // Un impulso fuerte para vencer a la gravedad de golpe
            this.jugador.setTexture('jugadorDeLado'); // Le pones la textura de lado si quieres que mire arriba
        }
    } // <-- Aquí se cierra update()

    // la funciones van fuera de otras
    recolectarBurbuja(jugador, burbuja) {
        burbuja.disableBody(true, true);
        console.log("¡Burbuja recolectada!");
    }

}