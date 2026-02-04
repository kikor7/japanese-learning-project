<script setup lang="ts"></script>

<template>
  <main>
    <header class="bg-gradient-to-r from-[#b3daff] to-[#edf3ff] w-full h-20 items-center flex justify-start px-4">
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
  
    </div>

  <div class="bg-gradient-to-r from-[#b3daff] to-[#edf3ff] w-full h-10 px-4 fixed bottom-0 left-50 max-w-6xl mx-auto">
    <footer>
      <div class="flex items-end justify-end">
      <p class="text-white font-semibold">© 2026 Aprende Japonés. Todos los derechos reservados.</p>
    </div>
    </footer>
  </div>
</template>

<script lang="ts">
// fetch desde mi web
const res = await fetch(`/api/news?q=España`);
const json = await res.json();</script>