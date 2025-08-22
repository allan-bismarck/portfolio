<template>
  <section id="home" class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <p class="greeting">Olá, eu sou</p>
          <h1>Allan Bismarck</h1>
          <div class="typewriter">
            <span class="typed-text">Engenheiro de Computação</span>
          </div>
          <p class="hero-description">
            Desenvolvedor Full Stack especializado em Flutter, Kotlin e tecnologias web. 
            Transformando ideias em soluções digitais inovadoras.
          </p>
          
          <div class="cta-buttons">
            <a href="#contact" class="btn btn-primary">
              <i class="fas fa-paper-plane"></i> Contate-me
            </a>
            <a href="/projects" class="btn btn-secondary">
              <i class="fas fa-code"></i> Meus Projetos
            </a>
          </div>
          
          <div class="social-links">
            <a 
              v-for="(link, key) in socialLinks" 
              :key="key"
              :href="link.url" 
              target="_blank" 
              :aria-label="link.label"
            >
              <i :class="link.icon"></i>
            </a>
          </div>
        </div>
        <div class="hero-image">
          <div class="profile-container">
            <div class="profile-image-wrapper">
              <img src="https://github.com/allan-bismarck.png" alt="Allan Bismarck" class="profile-image">
            </div>
          </div>
        </div>
      </div>
      
      <div class="scroll-indicator">
        <span>Role para baixo</span>
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
  </section>
</template>

<script setup>
import { SOCIAL_LINKS } from '@/utils/constants';

const socialLinks = {
  github: {
    url: SOCIAL_LINKS.github,
    icon: 'fab fa-github',
    label: 'GitHub'
  },
  linkedin: {
    url: SOCIAL_LINKS.linkedin,
    icon: 'fab fa-linkedin-in',
    label: 'LinkedIn'
  }
};
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234a6cf7' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.8;
  z-index: 1;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
  z-index: 2;
}

.hero-text {
  flex: 1;
  max-width: 700px;
  text-align: left;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.greeting {
  font-size: 1.25rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 10px;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards 0.2s;
}

.hero h1 {
  font-size: 3.5rem;
  margin: 0 0 15px 0;
  line-height: 1.2;
  color: var(--dark-color);
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards 0.3s;
}

.typewriter {
  height: 40px;
  margin-bottom: 25px;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards 0.4s;
}

.typed-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  border-right: 3px solid var(--primary-color);
  padding-right: 10px;
  animation: blink 0.7s infinite;
  display: inline-block;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--secondary-color);
  margin-bottom: 35px;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards 0.5s;
}

.cta-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards 0.6s;
}

.cta-buttons .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 25px;
  font-size: 1.05rem;
}

.hero .social-links {
  display: flex;
  gap: 20px;
  margin-top: 30px;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards 0.7s;
}

.hero .social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  color: var(--dark-color);
  font-size: 1.1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 0;
}

.hero .social-links a:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-3px);
}

.profile-container {
  width: 350px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards 0.4s;
}

.profile-image-wrapper {
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--primary-color), #6c5ce7);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 50px rgba(74, 108, 247, 0.3);
  animation: float 6s ease-in-out infinite, pulse 8s ease-in-out infinite alternate;
  overflow: hidden;
  padding: 8px;
}

.profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  transition: transform 0.5s ease;
}

.profile-image-wrapper:hover .profile-image {
  transform: scale(1.05);
}

@keyframes pulse {
  0% {
    box-shadow: 0 20px 50px rgba(74, 108, 247, 0.3);
  }
  100% {
    box-shadow: 0 20px 60px rgba(108, 92, 231, 0.5);
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--secondary-color);
  font-size: 0.9rem;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards 1s;
}

.scroll-indicator i {
  margin-top: 10px;
  font-size: 1.2rem;
  animation: bounce 2s infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes blink {
  from, to { border-color: transparent; }
  50% { border-color: var(--primary-color); }
}

/* Responsive Design */
@media (max-width: 992px) {
  .hero-content {
    flex-direction: column-reverse;
    text-align: center;
  }
  
  .hero-text {
    text-align: center;
    margin-top: 40px;
  }
  
  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }
  
  .cta-buttons {
    justify-content: center;
  }
  
  .hero .social-links {
    justify-content: center;
  }
  
  .profile-container {
    width: 280px;
    height: 280px;
  }
  
  .profile-image-wrapper {
    width: 260px;
    height: 260px;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.8rem;
  }
  
  .typed-text {
    font-size: 1.3rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    gap: 15px;
  }
  
  .cta-buttons .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2.2rem;
  }
  
  .typed-text {
    font-size: 1.1rem;
  }
  
  .profile-container {
    width: 220px;
    height: 220px;
  }
  
  .profile-image-wrapper {
    width: 200px;
    height: 200px;
    padding: 6px;
  }
  
  .profile-image {
    border-width: 3px;
  }
}
</style>
