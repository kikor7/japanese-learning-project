<script setup lang="ts">

</script>

<template>
  <main>
    <header class="bg-linear-to-r from-[#b3daff] to-[#edf3ff] w-full h-20 items-center flex justify-start px-4">
      <img class="w-20 h-20" alt="Japanese logo" src="./assets/img/Japanese_icon_for_user_box.png" />
      <p class="text-3xl font-bold text-white ml-4">Aprende Japonés</p>
      <div class="flex justify-end w-full ">
        <button class="mr-10 mt-5 bg-white px-4 py-2 -translate-y-2 rounded-lg shadow-lg">
          Iniciar sesión
        </button>
        <button class="mr-10 mt-5 bg-white px-4 py-2 -translate-y-2 rounded-lg shadow-lg ">
          Registrarse
        </button>
      </div>
    </header>
  </main>

  <div v-if="loading" class="flex items-center justify-center w-full  h-120 font-bold text-2xl ">Cargando noticias...
  </div>
  <section v-else>
    <div class="min-h-193  flex flex-col items-center justify-center border-2 bg-white w-full overflow-auto ">

      <h1 class="text-3xl font-bold mb-4 ">Noticias <span class="text-[#b3daff]">(ニュース)</span> Japón <span
          class="text-[#b3daff]">(日本語)</span></h1>

      <div v-if="errorMsg" class="text-red-500 font-bold mb-4">{{ 'limite de noticias alcanzado' }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article v-for="(noticia, index) in info" :key="index">
          <h2>{{ noticia.title }}</h2>
          <p>{{ noticia.description }}</p>
          <img :src="noticia.image" alt="imagen de la noticia" @error="onImgError">
        </article>
      </div>
    </div>
  </section>

  <div class="bg-linear-to-r from-[#b3daff] to-[#edf3ff] w-full h-10 px-4 fixed bottom-0  max-w-6xl mx-auto">
    <footer>
      <div class="flex items-end justify-end">
        <p class="text-white font-semibold">© 2026 Aprende Japonés. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getJapanNews } from '@/services/news.js';

const info = ref<any[]>([]);
const loading = ref(true);
const errorMsg = ref<string | null>(null);

const onImgError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = '/placeholder.jpg';
};

onMounted(async () => {
  console.log('mounted: iniciando carga de noticias');
  try {
    const datos = await getJapanNews();
    console.log('respuesta getJapanNews', datos);
    // Asegúrate de asignar al .value del ref
    info.value = Array.isArray(datos) ? datos : [];
    if (!info.value.length) {
      errorMsg.value = 'No se encontraron artículos.';
    }
  } catch (err) {
    console.error('Error al obtener noticias:', err);
    errorMsg.value = 'Error cargando noticias. Revisa la consola o la red.';
  } finally {
    loading.value = false; // siempre se ejecuta
  }
});

</script>