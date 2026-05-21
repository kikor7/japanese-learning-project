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

        // --- CARGA DEL VECTOR SVG PARA EL FULLSCREEN ---
        const svgFullscreen = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%232c1d22" stroke-width="3" viewBox="0 0 24 24" width="35" height="35">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8V5a2 2 0 012-2h3" fill="%23ffffff" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 3h3a2 2 0 012 2v3" fill="%23ffffff" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16v3a2 2 0 002 2h3" fill="%23ffffff" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 21h3a2 2 0 002-2v-3" fill="%23ffffff" />
        </svg>
        `;
        this.load.image('icono-fs', 'data:image/svg+xml;utf8,' + svgFullscreen);
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
        this.physics.add.collider(this.burbujas, this.suelo,this.burbujaChocaSuelo, null, this);
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
        

        
        this.score = 0;              
        this.palabraActual = "";     
        this.gameOver = false; 
        
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
//SISTEMA DE PARTÍCULAS (POMPAS)
        this.emitterPompas = this.add.particles(0, 0, 'burbuja', {
            speed: { min: 60, max: 180 },   // Velocidad aleatoria de dispersión
            angle: { min: 0, max: 360 },    // Salen en todas las direcciones
            scale: { start: 0.12, end: 0 }, // Empiezan pequeñas y se reducen a 0
            alpha: { start: 0.8, end: 0 },  // Se vuelven transparentes
            lifespan: 700,                  // Duran 0.7 segundos
            gravityY: -100,                 // Flotabilidad hacia arriba
            emitting: false                 // Evita que emita partículas automáticamente
        });
        // --- BOTÓN FULLSCREEN ---
        const fullScreenButton = crearBotónCute(this, 1220, 50, 70, 70, 'icono-fs');
        fullScreenButton.zona.on('pointerup', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
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

        // Guardamos las dimensiones originales del sprite para los cálculos
        const anchoOriginal = this.jugador.width;
        const altoOriginal = this.jugador.height;

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            // --- MOVERSE IZQUIERDA ---
            this.jugador.setVelocityX(-500);
            this.jugador.setFlipX(true);  
            
            // SOLO aplicamos textura y hitbox si veníamos de otro estado o estábamos agachados
            if (this.jugador.texture.key !== 'jugadorDeLado' || this.jugador.scaleY < 0.15) {
                this.jugador.setTexture('jugadorDeLado');
                this.jugador.setScale(0.17);
                this.jugador.setBodySize(anchoOriginal * 0.8, altoOriginal * 0.8);
                this.jugador.body.setOffset((anchoOriginal * 0.2) / 2, altoOriginal * 0.2);
            }
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            // --- MOVERSE DERECHA ---
            this.jugador.setVelocityX(500);
            this.jugador.setFlipX(false);
            
            // SOLO aplicamos textura y hitbox si veníamos de otro estado o estábamos agachados
            if (this.jugador.texture.key !== 'jugadorDeLado' || this.jugador.scaleY < 0.15) {
                this.jugador.setTexture('jugadorDeLado');
                this.jugador.setScale(0.17);
                this.jugador.setBodySize(anchoOriginal * 0.8, altoOriginal * 0.8);
                this.jugador.body.setOffset((anchoOriginal * 0.2) / 2, altoOriginal * 0.2);
            }
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            // --- ESTADO AGACHADO ---
            this.jugador.setVelocityX(0);  
             
            // SOLO aplicamos el cambio si no estábamos ya agachados
            if (this.jugador.scaleY > 0.1) {
                this.jugador.setTexture('jugadorDeLado');
                this.jugador.setScale(0.17, 0.09);
                this.jugador.setBodySize(anchoOriginal * 0.6, altoOriginal * 0.5);
                this.jugador.body.setOffset((anchoOriginal * 0.4) / 2, altoOriginal * 0.5);
               if (this.teclaPulsadaUnaVez(this.cursors.down, this.wasd.down)) {
            this.reproducirSonidoAgacharse();
        }
            }
        } else {
            // --- ESTADO NORMAL (REPOSO) ---
            this.jugador.setVelocityX(0);
            
            
            // SOLO restauramos si la textura no es la normal o si veníamos de estar agachados
            if (this.jugador.texture.key !== 'jugador' || this.jugador.scaleY < 0.15) {
                this.jugador.setTexture('jugador');
                this.jugador.setScale(0.17);
                this.jugador.setBodySize(anchoOriginal * 0.8, altoOriginal * 0.8);
                this.jugador.body.setOffset((anchoOriginal * 0.2) / 2, altoOriginal * 0.2);
            }
        }

        if (quiereSaltar && estaEnElSuelo) {
            this.jugador.setVelocityY(-450); 
            
            if (this.jugador.texture.key !== 'jugadorDeLado' || this.jugador.scaleY < 0.15) {
                this.jugador.setTexture('jugadorDeLado'); 
                this.jugador.setScale(0.17);
                this.jugador.setBodySize(anchoOriginal * 0.8, altoOriginal * 0.8);
                this.jugador.body.setOffset((anchoOriginal * 0.2) / 2, altoOriginal * 0.2);
            }
            
            this.reproducirSonidoSalto();
        }

        // Actualización de burbujas
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
        this.reproducirSonidoBurbuja();

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

            // === EXPLOSIÓN DE POMPAS AQUÍ ===
            if (this.emitterPompas) {
                // Hacemos explotar entre 6 y 10 mini-burbujas en la X e Y de la burbuja que tocamos
                this.emitterPompas.explode(Phaser.Math.Between(6, 10), burbuja.x, burbuja.y);
            }

            // Borramos la burbuja buena
            burbuja.textoAsociado.destroy();
            burbuja.destroy(); 

        } else {
            // ERROR: ¡GAME OVER!
            this.reproducirSonidoPerder();
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
    burbujaChocaSuelo(suelo, burbuja) {
        if (!burbuja.active) return;

        if (this.emitterPompas) {
            this.emitterPompas.explode(Phaser.Math.Between(6, 10), burbuja.x, burbuja.y);
        }

        if (burbuja.textoAsociado) {
            burbuja.textoAsociado.destroy();
        }
        burbuja.destroy(); 
    }

    // Genera un sonido de "Pop" cristalino y rápido usando código
    reproducirSonidoBurbuja() {
        // Accedemos de forma segura al Web Audio Context que ya inició Phaser
        const ctx = this.sound.context;
        if (!ctx || ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Usamos 'sine' (onda senoidal) para un sonido limpio y burbujeante
        osc.type = 'sine'; 
        
        // El tono empieza medio (400Hz) y sube rapidísimo (1200Hz) en 0.1 segundos
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

        // Controlamos el volumen (sube y baja rápido para simular el "pop")
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        // Conectamos el oscilador al volumen y el volumen a los altavoces
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }

    // Genera un sonido clásico de derrota (Game Over) en 8-bits
    reproducirSonidoPerder() {
        const ctx = this.sound.context;
        if (!ctx || ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Usamos 'sawtooth' (onda de sierra) para darle ese toque rasposo de consola retro (NES/GameBoy)
        osc.type = 'sawtooth'; 
        
        // El tono empieza grave (300Hz) y cae en picado (80Hz) durante medio segundo
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.5);

        // Desvanecimiento del volumen más lento
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }

    reproducirSonidoSalto() {
        const ctx = this.sound.context;
        if (!ctx || ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 'sine' da ese tono limpio, esférico y elástico perfecto para dibujos animados
        osc.type = 'sine'; 
        
        const tiempoInicio = ctx.currentTime;
        const duracion = 0.35; // Un poco más largo para que se note el efecto "cartoon"

        // EFECTO CARTOON: El tono empieza medio (300Hz), sube muchísimo (900Hz) en plan elástico
        // y luego baja un poco al final para simular la vibración del salto
        osc.frequency.setValueAtTime(300, tiempoInicio);
        osc.frequency.exponentialRampToValueAtTime(950, tiempoInicio + 0.15);
        osc.frequency.exponentialRampToValueAtTime(500, tiempoInicio + duracion);

        // Control del volumen (suave al principio, fuerte en el pico y desvanece)
        gain.gain.setValueAtTime(0.01, tiempoInicio);
        gain.gain.linearRampToValueAtTime(0.3, tiempoInicio + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, tiempoInicio + duracion);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(tiempoInicio);
        osc.stop(tiempoInicio + duracion);
    }

    reproducirSonidoAgacharse() {
        const ctx = this.sound.context;
        if (!ctx || ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 'sine' para que suene elástico, redondo y caricaturesco
        osc.type = 'sine'; 
        
        const tiempoInicio = ctx.currentTime;
        const duracion = 0.15; // Un efecto rápido para cuando dobla las rodillas

        // EFECTO INVERSO: Empieza agudo (600Hz) y cae en picado (200Hz)
        // Esto simula que el personaje se "comprime" hacia el suelo
        osc.frequency.setValueAtTime(600, tiempoInicio);
        osc.frequency.exponentialRampToValueAtTime(200, tiempoInicio + duracion);

        // Envolvente de volumen rápida
        gain.gain.setValueAtTime(0.25, tiempoInicio);
        gain.gain.exponentialRampToValueAtTime(0.01, tiempoInicio + duracion);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(tiempoInicio);
        osc.stop(tiempoInicio + duracion);
    }

    teclaPulsadaUnaVez(tecla1, tecla2) {
        return Phaser.Input.Keyboard.JustDown(tecla1) || Phaser.Input.Keyboard.JustDown(tecla2);
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}

// ========================================================
// FUNCIÓN MEJORADA: SOPORTA TANTO TEXTO COMO ICONO SVG
// ========================================================
const crearBotónCute = (escena, x, y, ancho, alto, texto, tamañoTexto) => {
    const radio = 18;
    const contenedor = escena.add.container(x, y);
    const xRel = -ancho / 2;
    const yRel = -alto / 2;

    const gráficos = escena.add.graphics();

    // Capa 1: Borde exterior (Cereza casi negro)
    gráficos.fillStyle(0x2c1d22, 1);
    gráficos.fillRoundedRect(xRel - 4, yRel - 4, ancho + 8, alto + 8, radio + 4);

    // Capa 2: Relieve claro (Blanco)
    gráficos.fillStyle(0xffffff, 1);
    gráficos.fillRoundedRect(xRel, yRel, ancho, alto, radio);

    // Capa 3: Sombra interior (Rosa medio)
    gráficos.fillStyle(0xf3b0c3, 1);
    gráficos.fillRoundedRect(xRel + 2, yRel + 3, ancho - 4, alto - 5, radio - 2);

    // Capa 4: Fondo principal (Rosa pastel)
    gráficos.fillStyle(0xffd1dc, 1);
    gráficos.fillRoundedRect(xRel + 2, yRel + 2, ancho - 6, alto - 6, radio - 2);

    // Controlamos el elemento central
    let elementoCentral;

    if (texto === 'icono-fs') {
        elementoCentral = escena.add.image(0, 0, 'icono-fs');
    } else {
        elementoCentral = escena.add.text(0, 0, texto, { 
            fontFamily: 'Comic Sans MS, cursive',
            fontSize: tamañoTexto,
            fill: '#ffffff',
            stroke: '#2c1d22',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#2c1d22', blur: 0, fill: true }
        }).setOrigin(0.5);
    }

    const zona = escena.add.zone(0, 0, ancho, alto).setInteractive({ useHandCursor: true });
    contenedor.add([gráficos, elementoCentral, zona]);

    zona.on('pointerover', () => {
        if (texto !== 'icono-fs') {
            elementoCentral.setFill('#ffffa0');
        } else {
            elementoCentral.setScale(1.15); 
        }
    });
    
    zona.on('pointerout', () => {
        if (texto !== 'icono-fs') {
            elementoCentral.setFill('#ffffff');
        } else {
            elementoCentral.setScale(1.0);
        }
    });

    return { contenedor, zona };
};

