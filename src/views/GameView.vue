<template>
  <div class="relative z-10 flex flex-col items-center justify-center min-h-[calc(80vh-80px)] p-6">
    
    <div class="w-full max-w-[960px] shadow-2xl rounded-2xl overflow-hidden border-4 border-white/20 bg-black relative z-10">
  
      <div class="aspect-video w-full h-full">
        <GameBubbles />
      </div>

    </div>
    
    <p class="mt-4 text-gray-500 italic font-medium">
      ¡Revienta las burbujas antes de que toquen el suelo!
    </p>
    
  </div>
</template>

<script setup>
import GameBubbles from '../components/GameBubbles.vue'
</script>

<style scoped>
/* Forzamos que el componente hijo ocupe todo el aspect-video */
.aspect-video :deep(>) * {
  width: 100% !important;
  height: 100% !important;
}

/* Atacamos directamente a cualquier canvas que exista dentro del aspect-video */
.aspect-video :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  object-fit: fill !important; /* Fuerza el reajuste de esquina a esquina */
}
</style>
