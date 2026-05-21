import Phaser from 'phaser';
import Game from './GameBubbles.js';

export default class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/fondo.png');
        this.load.image('logo', 'assets/logo.png');
        this.load.audio('musicaFondo', 'assets/audio/Bubble_Cascade.mp3');

        // VECTOR CORREGIDO: Cargado como imagen de tipo Data-URI para que Phaser lo entienda nativamente
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
        this.bgm = this.sound.add('musicaFondo', { loop: true, volume: 0.4 });
        this.bgm.play();
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        const logo = this.add.image(640, 220, 'logo');

        // === BOTONES REUTILIZANDO LAS CAJAS CUTE ===
        
        // 1. Botón Jugar (Pasa texto normal)
        const botonJugar = crearBotónCute(this, 640, 550, 240, 85, 'Jugar', '44px');

        // 2. Botón Fullscreen (Pasa la clave del SVG y lo hace una cajita cuadrada arriba a la derecha)
        const fullScreenButton = crearBotónCute(this, 1220, 50, 70, 70, 'icono-fs');


        // === ANIMACIONES (TWEENS) ===

        // Animación flotante del Logo
        this.tweens.add({
            targets: logo,
            y: 240, 
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });

        // Animación del botón Jugar
        this.tweens.add({
            targets: botonJugar.contenedor,
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 800,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });


        // === EVENTOS DE INTERACCIÓN ===

        // Acción al pulsar Jugar
        botonJugar.zona.on('pointerdown', () => {
            this.bgm.stop();
            this.scene.start('GameBubbles');
            console.log("Iniciando aventura...");
        });

        // Acción al pulsar Fullscreen (Ahora sí responde a la zona de la caja de forma segura)
        fullScreenButton.zona.on('pointerup', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
    }

    update() {
        this.background.tilePositionX += 2;
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

    // Controlamos el elemento central: ¿Buscamos un texto o el SVG cargado?
    let elementoCentral;

    if (texto === 'icono-fs') {
        // Añadimos el SVG cargado en las coordenadas de origen relativas al contenedor
        elementoCentral = escena.add.image(0, 0, 'icono-fs');
    } else {
        // Creamos el texto tipográfico común
        elementoCentral = escena.add.text(0, 0, texto, { 
            fontFamily: 'Comic Sans MS, cursive',
            fontSize: tamañoTexto,
            fill: '#ffffff',
            stroke: '#2c1d22',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#2c1d22', blur: 0, fill: true }
        }).setOrigin(0.5);
    }

    // Zona interactiva invisible del tamaño del botón
    const zona = escena.add.zone(0, 0, ancho, alto).setInteractive({ useHandCursor: true });

    contenedor.add([gráficos, elementoCentral, zona]);

    // Efecto Hover selectivo para que no rompa si es una imagen
    zona.on('pointerover', () => {
        if (texto !== 'icono-fs') {
            elementoCentral.setFill('#ffffa0');
        } else {
            elementoCentral.setScale(1.15); // Hace un pequeño pop-up visual en el icono
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