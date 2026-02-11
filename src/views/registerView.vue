<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-center text-gray-800 text-2xl font-semibold mb-8">Registro</h1>
      <form class="" @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="username" class="block mb-2 text-gray-600 font-medium">Nombre de usuario</label>
          <input id="username" v-model="username" type="text"
            class="w-full p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div class="mb-4">
          <label for="email" class="block mb-2 text-gray-600 font-medium">Correo electrónico</label>
          <input id="email" v-model="email" type="email"
            class="w-full p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-2 text-gray-600 font-medium">Contraseña</label>
          <input id="password" v-model="password" type="password"
            class="w-full p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-300" />
           <BotonMoradoLoginRegister>Registrarse</BotonMoradoLoginRegister>
          </div>
    
        <p v-if="error" class="text-red-600 text-center mt-4">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BotonMoradoLoginRegister from '@/components/botonMoradoLoginRegister.vue';

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)

const router = useRouter()

const handleRegister = async () => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (data.success) {
      router.push('/login')
    } else {
      error.value = data.message
    }
  } catch (err) {
    console.error('Error al registrarse:', err)
    error.value = 'Error al registrarse. Revisa la consola o la red.'
  }
}

</script>
