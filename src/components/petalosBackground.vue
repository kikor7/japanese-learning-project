<template>
  <vue-particles
    id="tsparticles"
    :options="particlesOptions"
  />
</template>

<script setup>
const particlesOptions = {
  particles: {
    number: { value: 30 }, // No satures la pantalla
    color: { value: "#ffb7c5" }, // Rosa sakura
    shape: { type: "circle" }, // Puedes usar una imagen de pétalo luego
    opacity: { value: 0.7 },
    size: { value: { min: 2, max: 5 } },
    move: {
      enable: true,
      speed: 1.5,
      direction: "bottom", // Caen hacia abajo
      random: true,
      straight: false, // ¡Importante! Esto activa el movimiento fluido
      outModes: { default: "out" },
    },
    wobble: { // Esto imita el balanceo del pétalo al caer
      enable: true,
      distance: 10,
      speed: 10
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "bubble" } // Reaccionan un poco al ratón
    }
  }
};
</script>

<style scoped>
#tsparticles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Para que esté detrás de tu contenido */
}
</style>