<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      
      <div v-if="registrationSuccess" class="text-center py-4">
        <div class="text-indigo-500 text-5xl mb-4">✉️</div>
        <h1 class="text-gray-800 text-2xl font-semibold mb-2">¡Casi listo!</h1>
        <p class="text-gray-600 mb-6 text-sm">
          Hemos enviado un correo electrónico de confirmación a <strong class="text-gray-800">{{ email }}</strong>. Por favor, revisa tu bandeja de entrada para activar tu cuenta.
        </p>
        <BotonMoradoLoginRegister @click="router.push('/login')">Ir al Login</BotonMoradoLoginRegister>
      </div>

      <div v-else>
        <h1 class="text-center text-gray-800 text-2xl font-semibold mb-8">Registro</h1>
        
        <form @submit.prevent="handleRegister">
          <div class="mb-4">
            <label for="username" class="block mb-2 text-gray-600 font-medium">Nombre de usuario</label>
            <input id="username" v-model="username" @input="guardarProgreso" type="text"
              class="w-full p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 text-black" placeholder="tu nombre de usuario"/>
          </div>
          
          <div class="mb-4">
            <label for="email" class="block mb-2 text-gray-600 font-medium">Correo electrónico</label>
            <input id="email" v-model="email" @input="guardarProgreso" type="email"
              class="w-full p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 text-black" placeholder="tu@email.com"/>
          </div>
          
          <div class="mb-6">
            <label for="password" class="block mb-2 text-gray-600 font-medium">Contraseña</label>
            <input id="password" v-model="password" type="password"
              class="w-full p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 text-black" placeholder="******"/>
          </div>
          
          <BotonMoradoLoginRegister type="submit">Registrarse</BotonMoradoLoginRegister>
      
          <p v-if="error" class="text-red-600 text-center mt-4 font-medium">{{ error }}</p>
        </form>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BotonMoradoLoginRegister from '@/components/botonMoradoLoginRegister.vue';
import { supabase } from '@/lib/supabaseClient'

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const registrationSuccess = ref(false)

const router = useRouter()

// 1. AL CARGAR LA PÁGINA: Recuperamos el borrador si el usuario dejó el registro a medias
onMounted(() => {
  const savedUsername = localStorage.getItem('draft_username')
  const savedEmail = localStorage.getItem('draft_email')
  
  if (savedUsername) username.value = savedUsername
  if (savedEmail) email.value = savedEmail
})

// 2. FUNCIÓN DE GUARDADO AUTOMÁTICO: Guarda el texto cada vez que el usuario pulsa una tecla
const guardarProgreso = () => {
  localStorage.setItem('draft_username', username.value)
  localStorage.setItem('draft_email', email.value)
}

// 3. LIMPIEZA: Borra el rastro del almacenamiento cuando el registro termina bien
const limpiarStorage = () => {
  localStorage.removeItem('draft_username')
  localStorage.removeItem('draft_email')
}

const handleRegister = async () => {
  error.value = null // Reseteamos errores anteriores
  
  try {
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          username: username.value
        }
      }
    })


    if (supabaseError) {
  
      
      const msg = supabaseError.message

      if (msg.includes('already registered') || msg.includes('User already exists')) {
        error.value = 'Este correo electrónico ya está registrado. Intenta iniciar sesión.'
      } else if (msg.includes('Password should be')) {
        error.value = 'La contraseña debe tener al menos 6 caracteres.'
      } else if (msg.includes('Anonymous sign-ins are disabled') || msg.includes('signup disabled')) {
        error.value = 'Debes introducir un correo electrónico y una contraseña.'
      } else {
        error.value = `Error del servidor: ${msg}` // Si no entra en ninguna, te pintará el texto tal cual
      }
      return 
    }

    if (data) {
      console.log('Registro procesado con éxito:', data)
      limpiarStorage() 
      registrationSuccess.value = true 
    }

  } catch (err) {
    console.error('Error inesperado del catch general:', err)
    error.value = 'Ocurrió un error inesperado. Inténtalo de nuevo.'
  }
}

</script>