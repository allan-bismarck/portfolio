<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchGitHubRepos } from '@/utils/github';
import ProjectCard from '@/components/ProjectCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const router = useRouter();
const githubData = ref({
  repos: [],
  loading: true,
  error: null
});

// Buscar dados do GitHub
const fetchGitHubData = async () => {
  githubData.value.loading = true;
  githubData.value.error = null;
  
  try {
    githubData.value.repos = await fetchGitHubRepos();
  } catch (error) {
    console.error('Erro ao buscar dados do GitHub:', error);
    githubData.value.error = error.message || 'Ocorreu um erro ao carregar os projetos.';
  } finally {
    githubData.value.loading = false;
  }
};

// Executar a busca quando o componente for montado
onMounted(() => {
  fetchGitHubData();
});
</script>

<template>
  <div class="all-projects">
    <div class="container">
      <h1>Meus Projetos</h1>
      
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
      <div v-else class="projects-grid">
        <ProjectCard 
          v-for="repo in githubData.repos" 
          :key="repo.id" 
          :repo="repo"
        />
      </div>
      
      <div class="back-button">
        <button @click="router.go(-1)" class="btn btn-outline">
          <i class="fas fa-arrow-left"></i> Voltar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/common.css';

.all-projects {
  padding: 4rem 0;
  min-height: 100vh;
  background-color: #f8f9fa;
}

h1 {
  text-align: center;
  margin-bottom: 2.5rem;
  color: #2d3748;
  font-size: 2.5rem;
}

.back-button {
  text-align: center;
  margin-top: 2.5rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}
</style>
