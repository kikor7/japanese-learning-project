<template>
  <div class="container mx-auto p-4 mt-8">
    <h1 class="text-4xl font-bold text-center">Registro</h1>
    <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
      <label class="flex flex-col gap-2" for="username">
        <span class="text-lg font-bold">Nombre de usuario</span>
        <input
          class="w-full px-4 py-2 rounded-md border-2 border-gray-300"
          type="text"
          id="username"
          v-model="username"
        />
      </label>
      <label class="flex flex-col gap-2" for="email">
        <span class="text-lg font-bold">Correo electrónico</span>
        <input
          class="w-full px-4 py-2 rounded-md border-2 border-gray-300"
          type="email"
          id="email"
          v-model="email"
        />
      </label>
      <label class="flex flex-col gap-2" for="password">
        <span class="text-lg font-bold">Contraseña</span>
        <input
          class="w-full px-4 py-2 rounded-md border-2 border-gray-300"
          type="password"
          id="password"
          v-model="password"
        />
      </label>
      <button class="w-full px-4 py-2 rounded-md bg-blue-500 text-white font-bold" type="submit">Registrarse</button>
      <p v-if="error" class="text-red-600 text-lg font-bold text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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
