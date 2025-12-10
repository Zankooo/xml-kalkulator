<script setup>
import { ref } from 'vue'

// privzeto aktivna prva sekcija
const active = ref('#o-meni')

function setActive(hash) {
  active.value = hash
}
</script>

<template>
  <header class="navbar">
    <div class="left">
      <img
        src="../assets/sparkasse-logo.png"
        alt="Logo"
        style="height:60px; width:auto; object-fit:contain; display:block;"
      />
    </div>

    <nav class="right">
      <a
        href="#o-meni"
        :class="active === '#o-meni' ? 'nav-link nav-btn-active' : 'nav-link nav-btn'"
        @click="setActive('#o-meni')"
      >
        Prva stran
      </a>

      <a
        href="#delovanje"
        :class="active === '#delovanje' ? 'nav-link nav-btn-active' : 'nav-link nav-btn'"
        @click="setActive('#delovanje')"
      >
        Delovanje aplikacije
      </a>

      <a
        href="#avtor"
        :class="active === '#avtor' ? 'nav-link nav-btn-active' : 'nav-link nav-btn'"
        @click="setActive('#avtor')"
      >
        O avtorju
      </a>
    </nav>


  </header>
</template>

<style scoped>
.navbar {
  letter-spacing: 0.12em;
  width: 100%;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 70px;
  background: #ffffff;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

/* LEFT – logo */
.left {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* RIGHT – menu */
.right {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
}

/* osnovni stil link-gumba */
.nav-link {
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: 0.2s ease;
}

/* “navaden” gumb */
.nav-btn {
  background: transparent;
  color: #000;
}

/* hover na navadnem gumbu */
.nav-btn:hover {
  border-color: #f3f5f7;
}

/* AKTIVEN gumb */
.nav-btn-active {
  background: #f3f5f7;
  color: black;
  
}
</style>
