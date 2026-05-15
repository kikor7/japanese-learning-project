<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
    <div class="w-full max-w-[960px] shadow-2xl rounded-2xl overflow-hidden border-4 border-white/20 bg-black relative z-10">
      
      <div class="aspect-video">
        <iframe 
          src="/game/BurbujasJapo/index.html" 
          class="w-full h-full border-none"
          allowfullscreen>
        </iframe>
      </div>

    </div>
    
    <p class="mt-4 text-gray-500 italic font-medium">
      ¡Revienta las burbujas antes de que toquen el suelo!
    </p>
  </div>
</template>



<style scoped>
.game-view {
    padding: 20px;
    position: relative; 
    z-index: 10;
}
iframe {
    border-radius: 15px; /* Un toque estético ya que estamos */
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
    /* Asegúrate de que el iframe reciba los clics */
    pointer-events: auto; 
}
</style>