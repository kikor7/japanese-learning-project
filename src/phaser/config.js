// src/phaser/config.js
import Phaser from 'phaser';
import Start from './scenes/Start.js'; 
import GameBubblesScene from './scenes/GameBubbles.js';

export function iniciarJuego() {
    const config = {
        type: Phaser.AUTO,
        gameTitle: 'BurbujasJapo',
        width: 1280,   
        height: 720,   
        parent: 'game-container', // Este ID tiene que coincidir con el DIV de tu GameBubbles.vue
      scale: {
            mode: Phaser.Scale.NONE,          // <-- LE DICE A PHASER: "No toques el CSS del canvas"
            autoCenter: Phaser.Scale.NO_CENTER // <-- Deja que Tailwind lo centre todo
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 800 },
                fixedStep: true, // Evita tirones en el arranque
                debug: true
            }
        },
        scene: [Start, GameBubblesScene] // Aquí metes tus escenas. Si tienes más (como Preload, Game, etc.), las añades al array
    };


    return new Phaser.Game(config);
}