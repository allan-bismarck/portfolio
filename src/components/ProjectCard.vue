<template>
  <router-link 
    :to="{ name: 'ProjectDetail', params: { id: repo.name } }"
    class="project-card"
  >
    <div 
      class="project-image" 
      :style="{
        'background-color': getRandomColor(),
        'color': 'white',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'height': '180px',
        'font-size': '2rem',
        'font-weight': 'bold'
      }"
    >
      {{ getInitials(repo.name) }}
    </div>
    <h3>{{ formatRepoName(repo.name) }}</h3>
    <p>{{ repo.description || 'Sem descrição disponível' }}</p>
    <div v-if="repo.language || (repo.topics && repo.topics.length > 0)" class="project-tech">
      <span v-if="repo.language">{{ repo.language }}</span>
      <span v-if="repo.topics && repo.topics.length > 0">
        {{ repo.language ? ' • ' : '' }}{{ repo.topics.slice(0, 3).join(' • ') }}
      </span>
    </div>
    <div class="project-links">
      <!-- Live Project Button -->
      <a 
        v-if="repo.homepage" 
        :href="repo.homepage.startsWith('http') ? repo.homepage : 'https://' + repo.homepage" 
        target="_blank" 
        class="btn btn-sm btn-outline"
        @click.stop
      >
        <i class="fas fa-external-link-alt"></i> Ver Projeto
      </a>
      
      <!-- Download APK Button or Loading Indicator -->
      <template v-if="isMobileApp">
        <a 
          v-if="hasApk" 
          :href="apkUrl" 
          target="_blank" 
          class="btn btn-sm btn-outline btn-download"
          @click.stop
          :title="`Baixar ${apkName || 'APK'}`"
        >
          <i class="fas fa-download"></i> Baixar Aplicativo
        </a>
        <span 
          v-else-if="isCheckingApk" 
          class="btn btn-sm btn-outline btn-loading"
        >
          <i class="fas fa-spinner fa-spin"></i> Verificando...
        </span>
      </template>
      
      <!-- GitHub Repository Button (always shown) -->
      <a 
        :href="repo.html_url" 
        target="_blank" 
        class="btn btn-sm btn-primary"
        @click.stop
      >
        <i class="fab fa-github"></i> Ver no GitHub
      </a>
    </div>
  </router-link>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { formatRepoName, getInitials, getRandomColor } from '@/utils/helpers';
import { GITHUB_USERNAME } from '@/utils/github';

const props = defineProps({
  repo: {
    type: Object,
    required: true
  }
});

const hasApk = ref(false);
const apkUrl = ref(null);
const apkName = ref(null);
const isCheckingApk = ref(false);

// Check if repository is a mobile app (Android/Flutter)
const isMobileApp = computed(() => {
  const { repo } = props;
  return (
    // Check topics
    (repo.topics && 
      (repo.topics.includes('android') || 
       repo.topics.includes('flutter') || 
       repo.topics.includes('dart') ||
       repo.topics.includes('mobile-app'))) ||
    // Check language
    repo.language === 'Kotlin' || 
    repo.language === 'Java' || 
    repo.language === 'Dart' ||
    // Check name patterns
    repo.name.toLowerCase().includes('android') ||
    repo.name.toLowerCase().includes('app') ||
    repo.name.toLowerCase().includes('mobile')
  );
});

// Check for APK in releases
const checkForApk = async () => {
  if (!isMobileApp.value) return;
  
  isCheckingApk.value = true;
  
  try {
    // First try to check for releases
    const releasesResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${props.repo.name}/releases`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        }
      }
    );
    
    if (releasesResponse.ok) {
      const releases = await releasesResponse.json();
      
      // If there are releases, check the latest one for APK files
      if (releases && releases.length > 0) {
        const latestRelease = releases[0];
        const apkAsset = latestRelease.assets?.find(asset => 
          asset.name.toLowerCase().endsWith('.apk')
        );
        
        if (apkAsset) {
          hasApk.value = true;
          apkUrl.value = apkAsset.browser_download_url;
          apkName.value = apkAsset.name;
          return;
        }
      }
    }
    
    // If no APK found in releases, check if there's a direct APK in the repo
    // This is a fallback for repositories that don't use GitHub Releases
    const contentsResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${props.repo.name}/contents`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        }
      }
    );
    
    if (contentsResponse.ok) {
      const contents = await contentsResponse.json();
      const apkFile = contents.find(file => 
        file.type === 'file' && file.name.toLowerCase().endsWith('.apk')
      );
      
      if (apkFile) {
        hasApk.value = true;
        apkUrl.value = apkFile.download_url;
        apkName.value = apkFile.name;
      }
    }
  } catch (error) {
    console.error(`Error checking APK for ${props.repo.name}:`, error);
  } finally {
    isCheckingApk.value = false;
  }
};

onMounted(() => {
  checkForApk();
});
</script>

<style scoped>
.project-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.project-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.project-card h3 {
  margin: 1.25rem 1.25rem 0.5rem;
  font-size: 1.25rem;
  color: #2d3748;
}

.project-card p {
  padding: 0 1.25rem;
  color: #4a5568;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.project-tech {
  padding: 0 1.25rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  color: #718096;
}

.project-links {
  display: flex;
  gap: 0.75rem;
  padding: 0 1.25rem 1.25rem;
  margin-top: auto;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #3a5bd9;
  transform: translateY(-2px);
}

.btn-outline {
  background-color: transparent;
  color: #4a6cf7;
  border: 1px solid #4a6cf7;
}

.btn-outline:hover {
  background-color: rgba(74, 108, 247, 0.1);
  transform: translateY(-2px);
}

.btn i {
  margin-right: 0.5rem;
}

.btn-download {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}

.btn-download:hover {
  background-color: #45a049;
  color: white;
  transform: translateY(-2px);
}

.btn-loading {
  background-color: #f0f0f0;
  color: #666;
  cursor: default;
  border-color: #ddd;
}

.btn-loading:hover {
  transform: none;
  background-color: #f0f0f0;
}
</style>
