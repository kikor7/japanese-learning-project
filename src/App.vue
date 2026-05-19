<script setup lang="ts">
import { computed, ref, onMounted } from 'vue' // Añadimos ref y onMounted
import { useRoute } from 'vue-router'
import petalosBackground from '@/components/petalosBackground.vue';
import headerPagina from '@/components/headerPagina.vue';
import footerPagina from '@/components/footerPagina.vue';
import GameBubbles from './components/GameBubbles.vue';
import { supabase } from './lib/supabaseClient' // Importamos tu cliente de Supabase

const route = useRoute()

const selectorTipo = computed(() =>
  route.name === 'login' ? 'login' : 'principal'
)

// 1. Declaramos la variable reactiva bien tipada para TypeScript
const instruments = ref<any[]>([])

// 2. Creamos la función asíncrona para traer los datos protegiendo el flujo
async function getInstruments() {
  const { data, error } = await supabase.from('instruments').select()
  
  if (error) {
    console.error('Error al conectar con Supabase:', error.message)
    return
  }
  
  if (data) {
    instruments.value = data
  }
}

// 3. Ejecutamos la función cuando el componente se monte en el DOM
onMounted(() => {
  getInstruments()
})
</script>

<template>
  <petalosBackground />
  <headerPagina :tipo="selectorTipo"/>
  
  <main class="bg-white">
    <div class="p-4">
      <h2 class="text-xl font-bold mb-2">Lista de Instrumentos:</h2>
      <ul>
        <li v-for="instrument in instruments" :key="instrument.id" class="text-black">
          {{ instrument.name }} </li>
      </ul>
    </div>

    <router-view />
  </main>

  <footerPagina />
</template>
