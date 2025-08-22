<script setup>
import AppNavbar from '@/components/AppNavbar.vue';
import HeroSection from '@/components/HeroSection.vue';
import AboutSection from '@/components/AboutSection.vue';
import ProjectsSection from '@/components/ProjectsSection.vue';
import ContactSection from '@/components/ContactSection.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<template>
  <div class="app">
    <router-view v-if="$route.name !== 'Home'"></router-view>
    
    <template v-else>
      <AppNavbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
      <AppFooter />
    </template>
  </div>
</template>

<style>
@import '@/assets/css/common.css';

/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: var(--white);
}

h1, h2, h3, h4, h5, h6 {
  margin-bottom: 1rem;
  font-weight: 700;
  line-height: 1.2;
}

a {
  text-decoration: none;
  color: inherit;
  transition: var(--transition);
}
</style>
