<template>
  <!-- Contenedor principal de la vista (Mantiene el flujo limpio para Header y Footer) -->
  <div class="relative flex flex-col items-center justify-center min-h-[calc(80vh-80px)] p-6">

    <!-- CONTENEDOR DEL JUEGO: Aquí aplicamos el zoom out en horizontal y confinamos el bloqueo -->
    <div
      class="w-full max-w-[960px] shadow-2xl rounded-2xl overflow-hidden border-4 border-white/20 bg-black relative z-0
                landscape:pointer-coarse:scale-75 landscape:pointer-coarse:origin-top transition-transform duration-300">

      <!-- El lienzo del juego -->
      <div class="aspect-video w-full h-full">
        <GameBubbles />
      </div>

      <!-- CAPA DE BLOQUEO: Solo tapa el juego. Al ser absolute, el header y el footer quedan libres e interactuables -->
      <div
        class="pointer-coarse:portrait:flex hidden absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-20 flex-col items-center justify-center p-6 text-center select-none">
        <div class="bg-white p-6 rounded-2xl shadow-2xl max-w-xs flex flex-col items-center  animate-fade-in">
          <svg class="w-16 h-16 text-indigo-600 animate-[spin_3s_linear_infinite]" fill="none" stroke="currentColor"
            stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <!-- Flecha superior/derecha -->
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <h3 class="text-xl font-bold text-slate-800">Gira tu dispositivo</h3>
          <p class="text-sm text-slate-600">Para una mejor experiencia de juego, por favor pon el móvil en posición
            horizontal.</p>
        </div>
      </div>

    </div>


    <!-- El texto inferior se mantiene fuera del cuadro del juego -->
    <p class="hidden md:flexmt-4 text-gray-500 italic font-medium text-center">
      ¡Revienta las burbujas,forma palabras y lanza bolas de fuego con click o SPACE!
    </p>
<p class="block md:hidden mt-4 text-gray-500 italic font-medium text-center">
      ¡Revienta las burbujas, forma palabras y lanza bolas de fuego con los controles táctiles!
    </p>
  </div>
</template>

<script setup>
import GameBubbles from '../components/GameBubbles.vue'
import { ref, onMounted, onUnmounted } from 'vue';

const isMobile = ref(false);
const isLandscape = ref(false);

const checkOrientation = () => {
  isLandscape.value = window.innerWidth > window.innerHeight;
};

onMounted(() => {
  checkOrientation();

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android|iPad|iPhone|iPod/i.test(userAgent) || ('ontouchstart' in window)) {
    isMobile.value = true;
  }

  window.addEventListener('resize', checkOrientation);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkOrientation);
});
</script>

<style scoped>
.aspect-video :deep(>) * {
  width: 100% !important;
  height: 100% !important;
}

.aspect-video :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  object-fit: fill !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>