<template>
  <vue-particles id="tsparticles" :options="particlesOptions" />
</template>

<script setup>
import petal1 from '@/assets/img/petal_1.png'
import petal2 from '@/assets/img/petal_2.png'
import petal3 from '@/assets/img/petal_3.png'
import petal4 from '@/assets/img/petal_4.png'

const particlesOptions = {
  particles: {
    number: { value: 30 },
    shape: {
      type: "image",
      options: {
        image: [
          { src: petal1, width: 32, height: 32 },
          { src: petal2, width: 32, height: 32 },
          { src: petal3, width: 32, height: 32 },
          { src: petal4, width: 32, height: 32 }
        ]
      }
    },
    opacity: { value: 0.7 },
    size: { value: { min: 100, max: 100 } },
    move: {
      enable: true,
      speed: 1.5,
      direction: "bottom",
      random: true,
      straight: false, // da movimiento fluido al no ser completamente recto
      outModes: { default: "out" }
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: 10
    }
  },
  
 interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse" // Los pétalos huyen del ratón
      }
    },
    modes: {
      repulse: {
        distance: 100, // A qué distancia empiezan a huir
        duration: 0.4
      }
    }
  }
  
}
</script>