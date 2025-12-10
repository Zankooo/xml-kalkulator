<script setup>
import Navbar from './components/Navbar.vue'
// ce bi hotel bi lahko pa kar direkt dal tukaj komponento, recimo navbar ki se pač pojavi 
// pač na vsaki strani
// drugače pa tukaj daš router in pol na v mapi pages imas strani in na vsako stran kličeš
// komponento ki jo hočeš tam prikazat
</script>

<template>
  <router-view />
</template>
