<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getJapanNews } from '@/services/news.js';
// Asegúrate de que estos componentes existan o comenta las líneas si no los usas aún
import BotonBlanco from '../components/botonBlanco.vue';
import headerPagina from '../components/headerPagina.vue';
import footerPagina from '../components/footerPagina.vue';

const info = ref<any[]>([]);
const loading = ref(true);
const errorMsg = ref<string | null>(null);

const onImgError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = '/placeholder.jpg'; // Asegúrate de tener esta imagen en /public
};

onMounted(async () => {
  console.log('mounted: iniciando carga de noticias');
  try {
    const datos = await getJapanNews();
    console.log('respuesta getJapanNews', datos);
    info.value = Array.isArray(datos) ? datos : [];
    if (!info.value.length) {
      errorMsg.value = 'No se encontraron artículos.';
    }
  } catch (err) {
    console.error('Error al obtener noticias:', err);
    errorMsg.value = 'Error cargando noticias.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center w-full h-screen font-bold text-2xl text-gray-400 animate-pulse">
    Cargando noticias...
  </div>

 <section v-else class="bg-gray-50 py-5 px-4">
    <div class="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 flex flex-col">
      
      <div class="p-8 text-center border-b border-gray-50">
        <h1 class="text-4xl font-extrabold text-gray-800">
          Noticias!! <span class="text-blue-400">(ニュース)</span> 
          Japón <span class="text-blue-400">(日本語)</span>
        </h1>
        <p class="text-gray-400 mt-2 italic">Actualidad desde el país del sol naciente</p>
      </div>

      <div v-if="errorMsg" class="p-10 text-center">
        <div class="bg-red-50 text-red-600 p-4 rounded-xl font-bold inline-block border border-red-100">
          ⚠️ {{ errorMsg }}
        </div>
      </div>

      <div v-else class="overflow-y-auto max-h-[450px] p-8 custom-scrollbar">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
  v-for="(noticia, index) in info" 
  :key="index"
  class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
>
  <a :href="noticia.url" target="_blank" rel="noopener noreferrer" class="flex flex-col h-full">
    
    <div class="relative aspect-video overflow-hidden rounded-t-2xl">
      <img 
        :src="noticia.image" 
        @error="onImgError"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      >
    </div>

    <div class="p-5 flex flex-col flex-grow">
      <h2 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-500">
        {{ noticia.title }}
      </h2>
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ noticia.description }}
      </p>
      
      <div class="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
        <span class="text-xs font-semibold text-blue-400 uppercase">Japón Hoy</span>
        <span class="text-sm font-bold text-gray-800 hover:underline">Leer más →</span>
      </div>
    </div>

  </a>
</article>
        </div>
      </div>
    </div>
  </section>

    <div class="bg-gray-50 pb-10 px-4">
    <div class="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 p-8">
      <h3 class="text-gray-800 text-2xl font-bold mb-6 flex items-center">
        <span class="mr-2">📺</span> Contenido Multimedia
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div v-for="video in ['X4LgFjy-yHY', 'PGyQh5ZXxdo', 'XrEOQqwbKKA', 'D8B2B8yPWpM']" :key="video" 
          class="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
          <iframe 
            class="w-full h-full"
            :src="`https://www.youtube.com/embed/${video}`" 
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen>
          </iframe>
        </div>
      </div>
    </div>
  </div>

  
 
</template>
