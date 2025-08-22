<template>
  <section id="about" class="about">
    <div class="container">
      <h2>Sobre Mim</h2>
      <div class="about-content">
        <div class="about-text">
          <div class="about-intro">
            <p>Olá! Sou Allan Bismarck, Engenheiro de Computação formado pela UNIVASF e Desenvolvedor Full Stack com experiência em desenvolvimento de aplicações móveis e web.</p>
            <p>Atualmente atuo na Varlik Tecnologia, onde trabalho com desenvolvimento de soluções inovadoras. Tenho experiência em criar aplicações móveis com Flutter e Android nativo (Kotlin), além de desenvolvimento web com Laravel, JavaScript e APIs RESTful.</p>
            <p>Estou sempre em busca de novos desafios e oportunidades para expandir meus conhecimentos, especialmente em desenvolvimento mobile e tecnologias modernas de front-end.</p>
          </div>
          
          <div class="skills">
            <h3>Habilidades Técnicas</h3>
            <div v-for="(skillList, category) in skills" :key="category" class="skills-category">
              <h4>{{ getCategoryTitle(category) }}</h4>
              <div class="skills-grid">
                <span v-for="skill in skillList" :key="skill" class="skill-tag">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="education">
            <h3>Formação</h3>
            <div class="education-item">
              <h4>{{ education.degree }}</h4>
              <p class="institution">{{ education.institution }}</p>
              <p class="period">Concluído em {{ education.year }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { SKILLS, EDUCATION } from '@/utils/constants';

const skills = SKILLS;
const education = EDUCATION;

const getCategoryTitle = (category) => {
  const titles = {
    mobile: 'Mobile',
    frontend: 'Front-end',
    backend: 'Back-end & Banco de Dados',
    tools: 'Ferramentas & Outros'
  };
  return titles[category] || category;
};
</script>

<style scoped>
.about {
  background-color: var(--white);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.about-text {
  line-height: 1.8;
}

.about-intro {
  margin-bottom: 40px;
}

.about-intro p {
  margin-bottom: 15px;
  color: var(--dark-color);
}

.skills {
  margin: 50px 0;
}

.skills h3 {
  text-align: left;
  margin-bottom: 25px;
  font-size: 1.8rem;
  color: var(--primary-color);
  position: relative;
  display: inline-block;
}

.skills h3::after {
  content: '';
  display: block;
  width: 50%;
  height: 3px;
  background-color: var(--primary-color);
  margin-top: 8px;
}

.skills-category {
  margin-bottom: 30px;
}

.skills-category h4 {
  font-size: 1.2rem;
  margin: 20px 0 15px;
  color: var(--dark-color);
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.skill-tag {
  background-color: rgba(74, 108, 247, 0.1);
  color: var(--primary-color);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid rgba(74, 108, 247, 0.2);
  transition: var(--transition);
}

.skill-tag:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.education {
  margin-top: 50px;
}

.education h3 {
  text-align: left;
  margin-bottom: 25px;
  font-size: 1.8rem;
  color: var(--primary-color);
  position: relative;
  display: inline-block;
}

.education h3::after {
  content: '';
  display: block;
  width: 50%;
  height: 3px;
  background-color: var(--primary-color);
  margin-top: 8px;
}

.education-item {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.education-item h4 {
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 5px;
}

.institution {
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: 5px;
}

.period {
  color: var(--secondary-color);
  font-size: 0.95rem;
  opacity: 0.9;
}
</style>
