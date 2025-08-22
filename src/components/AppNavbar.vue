<template>
  <nav class="navbar">
    <div class="container">
      <div class="logo">Portfólio</div>
      <div class="nav-links">
        <a href="#home">Início</a>
        <a href="#about">Sobre</a>
        <a href="#projects">Projetos</a>
        <a href="#contact">Contato</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
// No additional logic needed for this simple navbar
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 15px 0;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.nav-links a {
  margin-left: 30px;
  font-weight: 600;
  color: var(--dark-color);
  position: relative;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.nav-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background-color: var(--primary-color);
  transition: var(--transition);
}

.nav-links a:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
