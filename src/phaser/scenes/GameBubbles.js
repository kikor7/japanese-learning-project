import Phaser from 'phaser'; // "Every great game begins with a single scene. Let's make this one unforgettable!"

export default class GameBubbbles extends Phaser.Scene {
    constructor() {
        super('GameBubbles');
    }

    init() {}

    preload() {
        this.load.image('bloque', './assets/bloquesuelo.png');
        this.load.image('fondo', './assets/fondogamebubbles.png');
        this.load.image('burbuja', './assets/burbuja.png');
        this.load.image('jugador', './assets/setaJugadora.png');
        this.load.image('jugadorDeLado', './assets/setaJugadoraDeLado.png');
        this.load.audio('bgm', './assets/audio/Yuuyake_no_Beach.mp3');
    }

    create() {
        this.bgm = this.sound.add('bgm', { loop: true, volume: 0.4 });
        this.bgm.play();
        
        this.fondo = this.add.tileSprite(0, 0, 1280, 720, 'fondo').setOrigin(0, 0);
        this.suelo = this.add.tileSprite(0, 670, 1280, 50, 'bloque').setOrigin(0, 0);
        this.physics.add.existing(this.suelo, true);

        this.jugador = this.physics.add.sprite(100, 600, 'jugador').setScale(0.17);
        this.jugador.setOrigin(0.5, 1); // El punto de origen se mantiene en la base del sprite
        this.jugador.setCollideWorldBounds(true);

        this.burbujas = this.physics.add.group();
         
        
        this.time.addEvent({
            delay: 2000,                  
            callback: this.lanzarBurbuja, 
            callbackScope: this,
            loop: true                    
        });

        this.physics.add.collider(this.jugador, this.suelo);
        this.physics.add.overlap(this.jugador, this.burbujas, this.recolectarBurbuja, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        this.efectoRespiracion = this.tweens.add({
            targets: this.jugador, 
            scaleY: 0.16,          
            duration: 1000,        
            yoyo: true,            
            repeat: -1,            
            ease: 'Sine.easeInOut' 
        });

        // --- NUEVO SISTEMA DE JUEGO (MUERTE SÚBITA) ---
        this.score = 0;              
        this.palabraActual = "";     
        this.gameOver = false; // Controla si has perdido
        
        this.diccionario = ["SETA", "BURBUJA", "SAKURA", "PETALO", "GAMING", "ARCADE", "ONIGIRI", "ANIME"];
        let indiceAleatorio = Phaser.Math.Between(0, this.diccionario.length - 1);
        this.fraseObjetivo = this.diccionario[indiceAleatorio]; 
        this.indiceLetraActual = 0; 

        // Textos actualizados para el nuevo modo
        this.scoreText = this.add.text(16, 16, 'Puntuación: 0', { 
            fontSize: '28px', fill: '#fff', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 5
        });

        this.palabraText = this.add.text(16, 55, 'Objetivo: ' + this.fraseObjetivo, { 
            fontSize: '32px', fill: '#ffcc00', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6
        });

        this.palabraFormadaText = this.add.text(16, 100, 'Progreso: ', { 
            fontSize: '32px', fill: '#0f0', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6
        });
    } 

    update() {
        // Siempre permitimos salir con ESC, incluso si hemos perdido
        if (this.wasd.esc.isDown) {
            this.scene.start('Start');
            this.bgm.stop();
        }

        // Si hemos perdido, congelamos el movimiento y no hacemos nada más
        if (this.gameOver) return;

        const quiereSaltar = this.cursors.up.isDown || this.wasd.up.isDown;
        const estaEnElSuelo = this.jugador.body.touching.down;
      
        const limiteIzquierdo = 50;
        const limiteDerecho = 1230;
        this.jugador.x = Phaser.Math.Clamp(this.jugador.x, limiteIzquierdo, limiteDerecho);

        //hitbox
         this.jugador.setBodySize(this.jugador.width * 0.8, this.jugador.height * 0.8);
        

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.jugador.setVelocityX(-500);
            this.jugador.setTexture('jugadorDeLado');
            this.jugador.setFlipX(true);  
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.jugador.setVelocityX(500);
            this.jugador.setTexture('jugadorDeLado');
            this.jugador.setFlipX(false);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.jugador.setScale(0.17, 0.09);
            this.jugador.setVelocityX(0);  
            this.jugador.setTexture('jugadorDeLado');
            // como se agachará. hacemos la hitbox aún más bajita
    this.jugador.setBodySize(this.jugador.width * 0.6, this.jugador.height * 0.5);
    this.jugador.setOffset((this.jugador.width * 0.4) / 2, this.jugador.height * 0.5);
    this.jugador.setOrigin(0.5, 1); // El punto de origen se mantiene en la base del sprite
        } else {
            this.jugador.setVelocityX(0);
            this.jugador.setTexture('jugador');
            if (this.jugador.scaleY < 0.15) {
                this.jugador.setScale(0.17);
            }
        }

        if (quiereSaltar && estaEnElSuelo) {
            this.jugador.setVelocityY(-450); 
            this.jugador.setTexture('jugadorDeLado'); 
        }

        this.burbujas.getChildren().forEach((burbuja) => {
            if (burbuja && burbuja.active && burbuja.textoAsociado) {
                burbuja.textoAsociado.x = burbuja.x;
                burbuja.textoAsociado.y = burbuja.y;

                if (burbuja.y > 720) {
                    burbuja.textoAsociado.destroy();
                    burbuja.destroy(true);
                }
            }
        });
        
    } 
    

    recolectarBurbuja(jugador, burbuja) {
        if (this.gameOver) return; // Si ya perdimos, ignoramos colisiones
        if (burbuja.yaRecogida) return;
        burbuja.yaRecogida = true;

        if (!burbuja.textoAsociado) return;

        let letraTocada = burbuja.textoAsociado.text.trim().toUpperCase();
        let letraCorrecta = this.fraseObjetivo[this.indiceLetraActual].trim().toUpperCase();

        if (letraTocada === letraCorrecta) {
            // ACIERTO: Seguimos jugando
            this.score += 100; 
            this.palabraActual += letraCorrecta; 
            this.indiceLetraActual++;

            if (this.indiceLetraActual >= this.fraseObjetivo.length) {
                // Palabra completada
                this.score += 500;
                let nuevoIndice = Phaser.Math.Between(0, this.diccionario.length - 1);
                this.fraseObjetivo = this.diccionario[nuevoIndice];
                this.indiceLetraActual = 0;
                this.palabraActual = ""; 
            }

            // Actualizamos textos de progreso
            this.scoreText.setText('Puntuación: ' + this.score);
            this.palabraFormadaText.setText('Progreso: ' + this.palabraActual);
            this.palabraText.setText('Objetivo: ' + this.fraseObjetivo);

            // Borramos la burbuja buena
            burbuja.textoAsociado.destroy();
            burbuja.destroy(); 

        } else {
            // ERROR: ¡GAME OVER!
            this.gameOver = true;
            this.physics.pause(); // Congela todas las físicas
            this.time.removeAllEvents(); // Deja de lanzar burbujas
            this.bgm.stop(); // Para la música

            this.jugador.setTint(0xff0000); // Pinta la seta de rojo
            if (this.efectoRespiracion) this.efectoRespiracion.stop(); // Para la animación de la seta

            // Texto gigante de derrota
            this.add.text(640, 360, '¡PERDISTE!\nPresiona ESC para volver', {
                fontSize: '64px', 
                fill: '#ff0000', 
                fontFamily: 'Arial',
                align: 'center',
                stroke: '#ffffff', 
                strokeThickness: 8,
                fontWeight: 'bold'
            }).setOrigin(0.5);
        }
    }

    lanzarBurbuja() {
        if (this.gameOver) return; // Por si acaso, no lanzar si hemos perdido

        let xAleatoria = Phaser.Math.Between(50, 1230);
        let nuevaBurbuja = this.burbujas.create(xAleatoria, 0, 'burbuja');
        
    // hitbox circular 
    nuevaBurbuja.setScale(0.2);

    let radio = (nuevaBurbuja.width * 0.3);

    // Al usar setCircle, Phaser automáticamente ajusta el cuerpo a un círculo.
    // No necesitamos setBodySize porque eso forzaría un rectángulo.
    nuevaBurbuja.setCircle(radio);

    // Esto asegura que el círculo esté perfectamente en el medio del sprite
    nuevaBurbuja.setOffset(
        (nuevaBurbuja.width - (radio * 1.9)) / 2, 
        (nuevaBurbuja.height - (radio * 1.9)) / 2
    );

    nuevaBurbuja.body.setAllowGravity(false);
    nuevaBurbuja.setVelocityY(Phaser.Math.Between(80, 150));
       
        let letraBurbuja = '';
        if (Phaser.Math.Between(1, 100) <= 40) {
            letraBurbuja = this.fraseObjetivo[this.indiceLetraActual];
        } else {
            const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            letraBurbuja = letras[Phaser.Math.Between(0, letras.length - 1)];
        }

        let textoLetra = this.add.text(xAleatoria, 0, letraBurbuja, { 
            fontSize: '26px', 
            fill: '#fff', 
            fontFamily: 'Arial',
            fontWeight: 'bold',
            stroke: '#000000',      
            strokeThickness: 6 
        }).setOrigin(0.5);

        nuevaBurbuja.textoAsociado = textoLetra;

        this.tweens.add({
            targets: nuevaBurbuja,
            scaleX: 0.23,  
            scaleY: 0.17,  
            duration: Phaser.Math.Between(600, 900), 
            yoyo: true,           
            repeat: -1,           
            ease: 'Sine.easeInOut' ,
            
        });
    }
}