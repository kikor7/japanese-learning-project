<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      
      <h1 class="text-center text-gray-800 text-2xl font-semibold mb-8">Login</h1>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block mb-2 text-gray-600 font-medium">Email:</label>
          <input id="email" v-model="form.email" type="email" required
            class="w-full p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 text-black" placeholder="tu@email.com"/>
        </div>
        
        <div class="mb-4">
          <label for="password" class="block mb-2 text-gray-600 font-medium">Password:</label>
          <input id="password" v-model="form.password" type="password" required
            class="w-full p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 text-black" placeholder="******"/>
        </div>

        <div class="mb-6 flex items-center">
          <input id="remember" v-model="rememberMe" type="checkbox" 
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" />
          <label for="remember" class="ml-2 text-sm text-gray-600 select-none cursor-pointer">Recordar mi correo</label>
        </div>
        
        <BotonMoradoLoginRegister type="submit">Iniciar Sesión</BotonMoradoLoginRegister>
      </form>
      
      <p v-if="error" class="text-red-600 text-center mt-4 font-medium">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BotonMoradoLoginRegister from '@/components/botonMoradoLoginRegister.vue'
import { supabase } from '@/lib/supabaseClient'

const form = ref({
  email: '',
  password: ''
})

const rememberMe = ref(false) // Estado del checkbox
const error = ref<string | null>(null)
const router = useRouter()

// AL CARGAR LA PÁGINA: Comprobamos si hay un correo guardado
onMounted(() => {
  const savedEmail = localStorage.getItem('user_remember_email')
  if (savedEmail) {
    form.value.email = savedEmail
    rememberMe.value = true // Dejamos el check marcado si ya existía
  }
})

const handleLogin = async () => {
  error.value = null // Reseteamos errores anteriores
  
  try {
    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password
    })

    // 1. UN SOLO IF PARA CONTROLAR EL ERROR: Aquí dentro va toda la traducción
    if (supabaseError) {
      const msg = supabaseError.message
      console.log('Error real en login:', msg) 

      if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        error.value = 'El correo electrónico o la contraseña son incorrectos.'
      } else if (msg.includes('Email not confirmed')) {
        error.value = 'Por favor, confirma tu cuenta en tu correo electrónico antes de entrar.'
      } else if (msg.includes('Too many requests')) {
        error.value = 'Demasiados intentos. Por seguridad, inténtalo más tarde.'
      } else {
        error.value = `Error al iniciar sesión: ${msg}` // Por si sale otro error
      }
      return 
    }

    // 2. SI TODO HA IDO BIEN (No hay errores y existe el usuario)
    if (data.user) {
      console.log('Sesión iniciada con éxito:', data.user)

      
      if (rememberMe.value) {
        localStorage.setItem('user_remember_email', form.value.email)
      } else {
        localStorage.removeItem('user_remember_email')
      }

      // Para empujaral usuario a la página de inicio
      router.push('/') 
    }

  } catch (err) {
    console.error('Error inesperado en el login:', err)
    error.value = 'Ocurrió un error inesperado al intentar iniciar sesión.'
  }
}

</script>