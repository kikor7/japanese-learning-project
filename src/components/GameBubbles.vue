<template>
  <div class="contenedor-pantalla">
    <div id="game-container"></div>
    
    <div id="joystick-zone"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { iniciarJuego } from '../phaser/config.js'; // Ahora crearemos este archivo

let gameInstance = null;

onMounted(() => {
  // Cuando el componente de Vue se pinta en la pantalla, arrancamos Phaser
  gameInstance = iniciarJuego();
});

onBeforeUnmount(() => {
  // Si el usuario cambia de pestaña en tu web, destruimos el juego para que no consuma RAM
  if (gameInstance) {
    gameInstance.destroy(true);
  }
});
</script>

<style scoped>
.contenedor-pantalla {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #040218;
  overflow: hidden;
}

#game-container {
  width: 100%;
  height: 100%;
}

/* Posicionamos la zona del joystick abajo a la izquierda */
#joystick-zone {
  position: absolute;
  bottom: 40px;
  left: 40px;
  width: 130px;
  height: 130px;
  z-index: 10; /* Lo pone por encima del juego de Phaser para poder tocarlo */
}
</style>