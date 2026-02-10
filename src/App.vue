<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import petalosBackground from '@/components/petalosBackground.vue';
import headerPagina from '@/components/headerPagina.vue';
import footerPagina from '@/components/footerPagina.vue';

const route = useRoute()

const tipoHeader = computed(() =>
  route.name === 'login' ? 'login' : 'principal'
)


</script>



<template>
  <petalosBackground />
 <headerPagina tipo="principal" />

  <router-view />

  <footerPagina />
</template>
