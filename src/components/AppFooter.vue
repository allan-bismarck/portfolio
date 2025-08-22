<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-text">Allan Bismarck</span>
            <span class="logo-dot">.</span>
          </div>
          <p class="tagline">Transformando ideias em soluções digitais inovadoras</p>
          <div class="footer-social">
            <a 
              v-for="(link, key) in socialLinks" 
              :key="key"
              :href="link.url" 
              target="_blank" 
              class="social-icon" 
              :aria-label="link.label"
            >
              <i :class="link.icon"></i>
            </a>
            <a :href="`mailto:${contactInfo.email}`" class="social-icon" aria-label="Email">
              <i class="fas fa-envelope"></i>
            </a>
          </div>
        </div>
        
        <div class="footer-links">
          <h4 class="footer-title">Navegação</h4>
          <ul class="footer-nav">
            <li><a href="#home" class="footer-link"><i class="fas fa-chevron-right"></i> Início</a></li>
            <li><a href="#about" class="footer-link"><i class="fas fa-chevron-right"></i> Sobre</a></li>
            <li><a href="#projects" class="footer-link"><i class="fas fa-chevron-right"></i> Projetos</a></li>
            <li><a href="#contact" class="footer-link"><i class="fas fa-chevron-right"></i> Contato</a></li>
          </ul>
        </div>
        
        <div class="footer-contact">
          <h4 class="footer-title">Entre em Contato</h4>
          <ul class="contact-info">
            <li class="contact-item">
              <i class="fas fa-envelope contact-icon"></i>
              <div>
                <span class="contact-label">Email</span>
                <a :href="`mailto:${contactInfo.email}`" class="contact-link">{{ contactInfo.email }}</a>
              </div>
            </li>
            <li class="contact-item">
              <i class="fas fa-map-marker-alt contact-icon"></i>
              <div>
                <span class="contact-label">Localização</span>
                <span class="contact-text">{{ contactInfo.location }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { SOCIAL_LINKS, CONTACT_INFO } from '@/utils/constants';

const contactInfo = CONTACT_INFO;

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
.footer {
  background: #1a1a2e;
  color: #e6e6e6;
  padding: 80px 0 0;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4a6cf7, #25d366);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

/* Brand Section */
.footer-brand {
  padding-right: 20px;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
}

.logo-dot {
  color: #4a6cf7;
  font-size: 2rem;
  line-height: 1;
}

.tagline {
  color: #a0a0a0;
  margin-bottom: 25px;
  line-height: 1.6;
}

/* Social Icons */
.footer-social {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 16px;
}

.social-icon:hover {
  background: #4a6cf7;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(74, 108, 247, 0.3);
}

/* Footer Navigation */
.footer-title {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 10px;
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background: #4a6cf7;
}

.footer-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-nav li {
  margin-bottom: 12px;
}

.footer-link {
  color: #a0a0a0;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.footer-link i {
  margin-right: 8px;
  font-size: 10px;
  color: #4a6cf7;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: #fff;
  transform: translateX(5px);
}

.footer-link:hover i {
  margin-right: 12px;
}

/* Contact Info */
.contact-info {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-item {
  display: flex;
  margin-bottom: 22px;
  align-items: flex-start;
  padding: 15px;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.contact-item:hover {
  background: rgba(74, 108, 247, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-color: rgba(74, 108, 247, 0.2);
}

.contact-icon {
  color: #4a6cf7;
  font-size: 20px;
  margin-right: 15px;
  margin-top: 3px;
  min-width: 24px;
  text-align: center;
  background: rgba(74, 108, 247, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.contact-item:hover .contact-icon {
  background: #4a6cf7;
  color: white;
  transform: scale(1.1);
}

.contact-label {
  display: block;
  color: #c0c0c0;
  font-size: 0.85rem;
  margin-bottom: 3px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.9;
}

.contact-link, .contact-text {
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: block;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.contact-link:hover {
  color: #4a6cf7;
  transform: translateX(3px);
  text-decoration: none;
}

/* Responsive */
@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
  
  .footer-brand {
    grid-column: 1 / -1;
    text-align: center;
    padding-right: 0;
    margin-bottom: 20px;
  }
  
  .footer-social {
    justify-content: center;
  }
  
  .footer-logo {
    justify-content: center;
  }
  
  .footer-title {
    text-align: left;
  }
}

@media (max-width: 576px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
