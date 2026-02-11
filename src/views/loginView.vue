<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700">
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 class="text-center text-gray-800 text-2xl font-semibold mb-8">Login</h1>
            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label for="email" class="block mb-2 text-gray-600 font-medium">Email:</label>
                    <input id="email" v-model="form.email" type="email" required
                        class="w-full p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div class="mb-4">
                    <label for="password" class="block mb-2 text-gray-600 font-medium">Password:</label>
                    <input id="password" v-model="form.password" type="password" required
                        class="w-full p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <BotonMoradoLoginRegister>iniciar sesion</BotonMoradoLoginRegister>
            </form>
            <p v-if="error" class="text-red-600 text-center mt-4">{{ error }}</p>
        </div>
    </div>
</template>

<script>
import BotonMoradoLoginRegister from '@/components/botonMoradoLoginRegister.vue';

export default {
    name: 'Login',
    components: {
        BotonMoradoLoginRegister
    },
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            error: ''
        }
    },
    methods: {
        handleLogin() {
            // Add your login logic here
            console.log('Login attempt:', this.form)
            this.error = ''
        }
    }
}
</script>
