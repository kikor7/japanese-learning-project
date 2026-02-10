<script setup>
import BotonBlanco from './botonBlanco.vue';

const props = defineProps({
  tipo: {
    type: String,
    default: 'principal'
  }
});
</script>

<template>
  <header
    class="bg-linear-to-r from-[#b3daff] to-[#edf3ff] w-full h-20 items-center flex justify-start px-4 rounded-2xl">
    <router-link to="/" class="flex items-center gap-4">
      <img class="w-20 h-20" alt="Japanese logo" src="../assets/img/Japanese_icon_for_user_box.png" />
      <p class="text-3xl font-bold text-white ml-0">Aprende Japonés</p>
    </router-link>
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

      <BotonBlanco v-if="tipo === 'principal'" @click="$router.push({ name: 'login' })">
        Iniciar sesión
      </BotonBlanco>

      <BotonBlanco v-if="tipo === 'principal'" @click="$router.push({ name: 'register' })">Registrarse</BotonBlanco>

      <BotonBlanco v-if="tipo === 'login'">  
        <i class="bi bi-house text-4xl cursor-pointer" @click="$router.push({ name: 'principal' })"></i>  <!-- Icono de casa vuelves a principal, mirar  router/index.ts, esta vinculado a homeView.vue  -->
      </BotonBlanco>

      <BotonBlanco v-if="tipo === 'game'" @click="$router.push({ name: 'principal' })">Volver</BotonBlanco>

      <a  @click="$router.push({ name: 'game' })" href="#" class="inline-block" aria-label="Perfil" rel="noopener noreferrer">
        <img src="../assets/img/mandoPNG.png" alt="User icon"
          class="w-20 h-20 block cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95 rounded-md shadow"
          loading="lazy" />
      </a>
    </nav>

    <!-- menú móvil controlado por checkbox -->
    <div class="md:hidden ">
      <div class="absolute left-0 right-0 mt-16 bg-white border-t transform transition-transform duration-150
                -translate-y-2 opacity-0 pointer-events-none" id="mobile-menu">
        <router-link class="block px-4 py-3" to="/login">Iniciar sesión</router-link>
        <router-link class="block px-4 py-3" to="/register">Registrarse</router-link>
        <router-link class="block px-4 py-3" to="/juego">Jugar</router-link>
      </div>
    </div>
  </header>
</template>