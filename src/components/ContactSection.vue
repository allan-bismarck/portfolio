<template>
  <section id="contact" class="contact-section">
    <div class="container">
      <div class="section-header">
        <h2>Entre em Contato</h2>
        <p class="section-subtitle">Vamos transformar suas ideias em realidade</p>
      </div>
      
      <div class="contact-container">
        <div class="contact-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-paper-plane"></i>
            </div>
            <h3>Vamos trabalhar juntos!</h3>
            <p>Estou aberto a novas oportunidades e adoraria ouvir sobre seu projeto. Entre em contato e vamos conversar.</p>
          </div>
          
          <div class="contact-methods">
            <a :href="`mailto:${contactInfo.email}`" class="contact-method">
              <div class="method-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="method-details">
                <span class="method-label">Me envie um e-mail</span>
                <span class="method-value">{{ contactInfo.email }}</span>
              </div>
            </a>
            
            <div class="contact-method">
              <div class="method-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="method-details">
                <span class="method-label">Localização</span>
                <span class="method-value">{{ contactInfo.location }}</span>
              </div>
            </div>
          </div>
          
          <div class="social-connect">
            <h4>Conecte-se comigo</h4>
            <div class="social-links">
              <a 
                v-for="(link, key) in socialLinks" 
                :key="key"
                :href="link.url" 
                target="_blank" 
                :class="`social-btn ${key}`" 
                :aria-label="link.label"
              >
                <i :class="link.icon"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { SOCIAL_LINKS, CONTACT_INFO } from '@/utils/constants';

// Contact information
const contactInfo = CONTACT_INFO;

// Social links
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
.contact-section {
  background-color: #f8f9ff;
  padding: 100px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 2.2rem;
  margin-bottom: 15px;
  color: #2d3748;
}

.section-subtitle {
  color: #6c757d;
  font-size: 1.2rem;
  margin-top: 15px;
}

.contact-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.contact-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 40px;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.card-icon {
  width: 70px;
  height: 70px;
  background: #f0f4ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--primary-color);
  font-size: 28px;
}

.contact-methods {
  margin-bottom: 40px;
}

.contact-method {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #333;
  background: #f8f9ff;
}

.contact-method:hover {
  background: #eef1ff;
  transform: translateX(5px);
}

.method-icon {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: var(--primary-color);
  font-size: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.method-details {
  display: flex;
  flex-direction: column;
}

.method-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 3px;
}

.method-value {
  font-weight: 600;
  color: #2d3748;
}

.social-connect h4 {
  text-align: center;
  margin-bottom: 20px;
  color: #4a5568;
  font-size: 1.1rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.social-btn.github {
  background: #333;
}

.social-btn.linkedin {
  background: #0077b5;
}


/* Responsive */
@media (max-width: 992px) {
  .contact-container {
    padding: 0 15px;
  }
  
  .contact-card {
    padding: 30px;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .contact-section {
    padding: 60px 0;
  }
  
  .contact-card {
    padding: 25px 20px;
  }
  
  .card-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
  
  .contact-method {
    padding: 15px;
  }
  
  .method-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
</style>
