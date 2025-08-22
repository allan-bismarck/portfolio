<template>
  <section id="projects" class="projects">
    <div class="container">
      <h2>Meus Projetos</h2>
      
      <!-- Loading State -->
      <LoadingSpinner 
        v-if="githubData.loading" 
        message="Carregando projetos do GitHub..." 
      />
      
      <!-- Error State -->
      <ErrorMessage 
        v-else-if="githubData.error" 
        :message="githubData.error"
        @retry="fetchGitHubData"
      />
      
      <!-- Projects Grid -->
      <div v-else>
        <div class="projects-grid">
          <ProjectCard 
            v-for="repo in githubData.repos.slice(0, 3)" 
            :key="repo.id" 
            :repo="repo"
          />
        </div>
        
        <!-- View More Button -->
        <div class="view-more" v-if="githubData.repos.length > 3">
          <router-link to="/projects" class="btn btn-outline">
            <i class="fas fa-arrow-right"></i> Ver Todos os Projetos ({{ githubData.repos.length }})
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { fetchGitHubRepos } from '@/utils/github';
import ProjectCard from '@/components/ProjectCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

// GitHub data state
const githubData = reactive({
  repos: [],
  loading: false,
  error: null
});

// Fetch GitHub data
const fetchGitHubData = async () => {
  githubData.loading = true;
  githubData.error = null;
  
  try {
    githubData.repos = await fetchGitHubRepos();
  } catch (error) {
    console.error('Erro ao buscar dados do GitHub:', error);
    githubData.error = `Não foi possível carregar os dados do GitHub: ${error.message}. Atualize a página para tentar novamente.`;
  } finally {
    githubData.loading = false;
  }
};

// Execute fetch when component is mounted
onMounted(() => {
  fetchGitHubData();
});
</script>

<style scoped>
.projects {
  background-color: #f8f9fa;
}

.view-more {
  text-align: center;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #eaeaea;
}

.view-more .btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.view-more .btn i {
  transition: transform 0.2s ease;
}

.view-more .btn:hover i {
  transform: translateX(3px);
}
</style>
