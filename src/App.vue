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

<div class="min-h-screen flex items-center justify-center">
  <h1>Noticias Japonesas</h1>
  <ul>
    <li v-for="(noticia, index) in info" :key="index">
        {{ noticia.title }}
      </li>
  </ul>
    </div>

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
import { getJapanNews } from '@/services/news.js'; // Asegúrate que la ruta sea correcta

// 1. Definimos 'info' como una referencia reactiva
const info = ref([]);

// 2. Usamos el hook onMounted (equivalente al mounted de Vue 2)
onMounted(async () => {
  try {
    const datos = await getJapanNews();
    if (datos) {
      info.value = datos; // En script setup usamos .value para asignar
    }
  } catch (error) {
    console.error("Error al cargar noticias:", error);
  }
});
</script>