
<script>
import BotonBlanco from './botonBlanco.vue';
export default {
  props: {
    tipo: {
      type: String,
      default: 'principal'
    },
    tipo: {
      type: String,
      default: 'login-register'
    }
  },
  components: {
    BotonBlanco
  }
}
</script>

<template>
  <main>
    <header
      class="bg-linear-to-r from-[#b3daff] to-[#edf3ff] w-full h-20 items-center flex justify-start px-4 rounded-2xl">
      <img class="w-20 h-20" alt="Japanese logo" src="../assets/img/Japanese_icon_for_user_box.png" />
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

        <BotonBlanco v-if="tipo === 'principal'"> Iniciar sesión </BotonBlanco>
        <BotonBlanco v-if="tipo === 'principal'">Registrarse</BotonBlanco>
        <BotonBlanco v-if="tipo === 'login-register'">
          <i class="bi bi-house text-4xl cursor-pointer" @click="() => $router.push('/')"></i>
        </BotonBlanco>

        <BotonBlanco v-if="tipo === 'game'">Registrarse</BotonBlanco>

        <a href="#" class="inline-block" aria-label="Perfil" rel="noopener noreferrer">
          <img src="../assets/img/mandoPNG.png" alt="User icon"
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
</template>