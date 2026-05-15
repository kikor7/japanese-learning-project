import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
    default: 'arcade',
    arcade: {
        debug: true //Al activar el debug, verás cajas de colores alrededor de tus burbujas y del mapache. Sabrás exactamente dónde están sus límites, por qué chocan o por qué se salen de la pantalla. Ya no hay "adivinanza".
    }
}
}

new Phaser.Game(config);
            