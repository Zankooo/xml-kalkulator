<script setup>


</script>

<template>
  <header class="navbar">



    <div class="left">
      <img src="../assets/sparkasse-logo.png"
     alt="Logo"
     style="height:60px; width:auto; object-fit:contain; display:block;" />

    </div>

    <nav class="right">
      <a href="#o-meni">Prva stran</a>
      <a href="#delovanje">Delovanje aplikacije</a>
      <a href="#avtor">O avtorju</a>
      

    </nav>
  </header>
</template>

<style scoped>
.navbar {
  
  letter-spacing: 0.12em; /* približno tracking +3 */
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

/* LEFT – logo + name */
.left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  width: 55px;
  height: 55px;
  border-radius: 15px;
}

.name {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* RIGHT – menu */
.right {
  display: flex;
  align-items: center;
  gap: 40px;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
}

.right a {
  text-decoration: none;
  color: #000;
  transition: 0.25s ease;
}

.right a:hover {
  opacity: 0.55;
}

/* LANG SWITCHER */
.lang {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lang .active {
  color: #1a73e8;
  font-weight: 700;
}
</style>
