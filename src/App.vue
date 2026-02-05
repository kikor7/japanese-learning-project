<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getJapanNews } from '@/services/news.js';
import BotonBlanco from './components/botonBlanco.vue';

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

// El '@' apunta a tu carpeta /src

</script>

<template>
  <main>
    <header
      class="bg-linear-to-r from-[#b3daff] to-[#edf3ff] w-full h-20 items-center flex justify-start px-4 rounded-2xl">
      <img class="w-20 h-20" alt="Japanese logo" src="./assets/img/Japanese_icon_for_user_box.png" />
      <p class="text-3xl font-bold text-white ml-4">Aprende Japonés</p>
      <!-- checkbox hamburguesa -->
      <input id="menu-toggle" type="checkbox" class="hidden" />

      <!-- icono hamburguesa visible solo en md:hidden -->
      <label for="menu-toggle" class="md:hidden cursor-pointer p-2 ">
        <svg class="w-6 h-6 " fill="items-center flex-1 justify-end" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>

      <!-- nav escritorio -->
      <nav class="hidden md:flex gap-3 items-center flex-1 justify-end">
        <BotonBlanco> Iniciar sesión </BotonBlanco>

        <BotonBlanco>Registrarse</BotonBlanco>

        <a href="#" class="inline-block" aria-label="Perfil" rel="noopener noreferrer">
          <img src="./assets/img/mandoPNG.png" alt="User icon"
            class="w-20 h-20 block cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95 rounded-md shadow"
            loading="lazy" />
        </a>
      </nav>

      <!-- menú móvil controlado por checkbox -->
      <div class="md:hidden ">
        <div class="absolute left-0 right-0 mt-16 bg-white border-t transform transition-transform duration-150
                -translate-y-2 opacity-0 pointer-events-none" id="mobile-menu">
          <a class="block px-4 py-3" href="#">Iniciar sesión</a>
          <a class="block px-4 py-3" href="#">Registrarse</a>
        </div>
      </div>
    </header>
  </main>

  <div v-if="loading" class="flex items-center justify-center w-full  h-120 font-bold text-2xl ">Cargando noticias...
  </div>
  <section v-else>
    <div
      class=" min-h-200  flex flex-col items-center justify-center border-2  bg-white w-full overflow-auto rounded-2xl ">

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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4  p-4 bg-white rounded-t-2xl shadow-lg">
        <iframe class="w-full h-full rounded-xl shadow-lg"
          src="https://www.youtube.com/embed/X4LgFjy-yHY?si=TQIlKMavZrIhdG4Z" title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <iframe class="w-full h-full rounded-xl shadow-lg"
          src="https://www.youtube.com/embed/PGyQh5ZXxdo?si=6oMDdNuqZudrFPei" title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <iframe class="w-full h-full rounded-xl shadow-lg"
          src="https://www.youtube.com/embed/XrEOQqwbKKA?si=vzFKU8SAeHEl46_s" title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <iframe class="w-full h-full rounded-xl shadow-lg"
          src="https://www.youtube.com/embed/D8B2B8yPWpM?si=UeF7VFnyU-g9RbSZ" title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
    </div>

  </section>


  <div class="bg-linear-to-r from-[#b3daff] to-[#edf3ff] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl">
    <footer>
      <div class="flex items-end justify-end">
        <p class="text-white font-semibold">© 2026 Aprende Japonés. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>
