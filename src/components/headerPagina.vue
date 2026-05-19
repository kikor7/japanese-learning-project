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
    
    <nav class="hidden md:flex gap-4 items-center">
      <template v-if="!user">
        <BotonBlanco v-if="$route.name !== 'login'" @click="$router.push({ name: 'login' })">Iniciar sesión</BotonBlanco>
        <BotonBlanco v-if="$route.name !== 'register'" @click="$router.push({ name: 'register' })">Registrarse</BotonBlanco>
      </template>

      <div v-else class="relative">
        <button @click="userMenuAbierto = !userMenuAbierto" class="flex items-center gap-2 focus:outline-none cursor-pointer">
          <div class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow border-2 border-white">
            {{ obtenerInicial() }}
          </div>
          <span class="text-blue-900 font-medium text-sm hidden lg:inline">{{ user.user_metadata?.username || 'Usuario' }}</span>
        </button>

        <div v-if="userMenuAbierto" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
          <button @click="handleSignOut" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors cursor-pointer">
            🚪 Cerrar sesión
          </button>
        </div>
      </div>

      <router-link v-if="$route.name !== 'game'" to="/game" class="hover:scale-105 transition-transform">
        <img src="../assets/img/mandoPNG.png" alt="Jugar" class="w-16 h-16 rounded-md shadow" />
      </router-link>
    </nav>

    <div id="mobile-menu" 
         class="absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm shadow-xl rounded-b-2xl py-4 flex flex-col items-center gap-4 md:hidden transition-all duration-300 origin-top"
         :class="menuAbierto ? 'scale-y-100 opacity-100 pointer-events-auto' : 'scale-y-0 opacity-0 pointer-events-none'">
      
      <template v-if="!user">
        <router-link v-if="$route.name !== 'login'" class="text-lg font-semibold text-blue-500 py-2 w-full text-center hover:bg-blue-50" to="/login" @click="closeMenu">Iniciar sesión</router-link>
        <router-link v-if="$route.name !== 'register'" class="text-lg font-semibold text-blue-500 py-2 w-full text-center hover:bg-blue-50" to="/register" @click="closeMenu">Registrarse</router-link>
      </template>

      <template v-else>
        <div class="text-center border-b border-gray-100 w-full pb-2">
          <p class="text-sm text-gray-500">Conectado como:</p>
          <p class="font-bold text-indigo-600">{{ user.user_metadata?.username || user.email }}</p>
        </div>
        <button @click="handleSignOut(); closeMenu()" class="text-lg font-semibold text-red-500 py-2 w-full text-center hover:bg-red-50">Cerrar sesión</button>
      </template>

      <router-link v-if="$route.name !== 'game'" class="text-lg font-semibold text-blue-500 py-2 w-full text-center hover:bg-blue-50" to="/game" @click="closeMenu">Jugar</router-link>
    </div>

  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient'; // Asegúrate de que esta ruta sea la correcta
import BotonBlanco from './botonBlanco.vue';

// Estado del menú hamburguesa y menú de usuario
const menuAbierto = ref(false);
const userMenuAbierto = ref(false);

// Aquí guardaremos la información del usuario logeado (si existe)
const user = ref(null);
const router = useRouter();

const closeMenu = () => {
  menuAbierto.value = false;
};

// Función para extraer la primera letra del nombre de usuario para el avatar alternativo
const obtenerInicial = () => {
  if (user.value?.user_metadata?.username) {
    return user.value.user_metadata.username.charAt(0).toUpperCase();
  }
  return user.value?.email?.charAt(0).toUpperCase() || 'U';
};

// Función para cerrar sesión de Supabase
const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error.message);
  } else {
    userMenuAbierto.value = false;
    router.push('/'); // Redirigimos a la raíz al salir
  }
};

onMounted(() => {
  // 1. Comprobamos si ya había una sesión activa al cargar la página
  supabase.auth.getUser().then(({ data }) => {
    if (data) user.value = data.user;
  });

  // 2. Nos suscribimos a los cambios de estado (Login, Logout, Token renovado)
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session ? session.user : null;
  });
});
</script>