<script setup>
/* Ni ti treba nič uvažat – RouterLink in $route sta v templatu že na voljo,
   če imaš v main.js: app.use(router) */
</script>

<template>
  <header class="navbar">
    <div class="left">
      <!-- Logo vodi na "/" -->
      <RouterLink to="/">
        <img
          src="../assets/sparkasse-logo.png"
          alt="Logo"
          class="logo-click"
          style="height:60px; width:auto; object-fit:contain; display:block; cursor: pointer;"
        />
      </RouterLink>
    </div>

    <!-- NAVBAR -->
    <nav class="right">
      <!-- PRVA STRAN – route "/" -->
      <RouterLink
        to="/"
        :class="['nav-link', $route.path === '/' && !$route.hash ? 'nav-btn-active' : 'nav-btn']"
      >
        Prva stran
      </RouterLink>

      <!-- DELOVANJE APLIKACIJE – sekcija na Home strani (hash na isti strani) -->
      <RouterLink
        :to="{ path: '/delovanje'}"
        :class="['nav-link', $route.path === '/delovanje' ? 'nav-btn-active' : 'nav-btn'
        ]"
      >
        Namen in Delovanje 
      </RouterLink>

      <!-- O AVTORJU – route "/about" -->
      <RouterLink
        to="/about"
        :class="['nav-link', $route.path === '/about' ? 'nav-btn-active' : 'nav-btn']"
      >
        O avtorju
      </RouterLink>
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

.left {
  display: flex;
  align-items: center;
  gap: 15px;
}

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
