<template>
  <header
    class="relative bg-linear-to-r from-[#b3daff] to-[#edf3ff] w-full h-20 flex items-center justify-between px-4 rounded-2xl z-50">
    
    <router-link to="/" class="flex items-center gap-2 sm:gap-4 shrink-0">
      <img class="w-12 h-12 sm:w-16 sm:h-16" alt="Japanese logo" src="../assets/img/Japanese_icon_for_user_box.png" />
      <p class="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-none">Aprende Japonés</p>
    </router-link>

    <button @click="menuAbierto = !menuAbierto" class="md:hidden cursor-pointer p-2 z-50 bg-transparent border-none">
      <svg class="w-8 h-8 text-white transition-transform duration-300" :class="{ 'rotate-90': menuAbierto }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="!menuAbierto" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <nav class="hidden md:flex gap-3 items-center">
      <BotonBlanco v-if="$route.name !== 'login'" @click="$router.push({ name: 'login' })">Iniciar sesión</BotonBlanco>
      <BotonBlanco v-if="$route.name !== 'register'" @click="$router.push({ name: 'register' })">Registrarse</BotonBlanco>
      <router-link to="/game" class="hover:scale-105 transition-transform">
        <img src="../assets/img/mandoPNG.png" alt="Jugar" class="w-16 h-16 rounded-md shadow" />
      </router-link>
    </nav>

    <div id="mobile-menu" 
         class="absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm shadow-xl rounded-b-2xl py-4 flex flex-col items-center gap-4 md:hidden transition-all duration-300 origin-top"
         :class="menuAbierto ? 'scale-y-100 opacity-100 pointer-events-auto' : 'scale-y-0 opacity-0 pointer-events-none'">
      
      <router-link v-if="$route.name !== 'login'" class="text-lg font-semibold text-blue-500 py-2 w-full text-center hover:bg-blue-50" to="/login" @click="closeMenu">Iniciar sesión</router-link>
      <router-link v-if="$route.name !== 'register'" class="text-lg font-semibold text-blue-500 py-2 w-full text-center hover:bg-blue-50" to="/register" @click="closeMenu">Registrarse</router-link>
      <router-link class="text-lg font-semibold text-blue-500 py-2 w-full text-center hover:bg-blue-50" to="/game" @click="closeMenu">Jugar</router-link>
    </div>

  </header>
</template>

<script setup>
import { ref } from 'vue';
import BotonBlanco from './botonBlanco.vue';

// Eliminamos defineProps si vas a usar la lógica inteligente de $route en vez de 'tipo'
defineProps({
  tipo: { type: String, default: 'principal' }
});

// Variable reactiva para controlar el estado del menú
const menuAbierto = ref(false);

const closeMenu = () => {
  menuAbierto.value = false; // Manera limpia de cerrar en Vue
};
</script>