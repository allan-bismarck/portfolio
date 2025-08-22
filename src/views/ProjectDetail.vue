<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchRepoDocumentation } from '@/utils/github';
import { getLanguageColor, formatDate, decodeBase64 } from '@/utils/helpers';
import { DOC_FILES } from '@/utils/constants';
import { 
  processMarkdown, 
  formatDocName, 
  getDocType, 
  getDocIcon, 
  generateTOC, 
  extractProjectInfo 
} from '@/utils/markdown';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

// Add global CSS for markdown content
const style = document.createElement('style');
style.textContent = `
  .markdown-content {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #2d3748;
  }
  .markdown-content h1, 
  .markdown-content h2, 
  .markdown-content h3, 
  .markdown-content h4, 
  .markdown-content h5, 
  .markdown-content h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.25;
  }
  .markdown-content h1 { font-size: 2em; }
  .markdown-content h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
  .markdown-content h3 { font-size: 1.25em; }
  .markdown-content p { margin: 1em 0; }
  .markdown-content ul, 
  .markdown-content ol { 
    padding-left: 2em;
    margin: 1em 0;
  }
  .markdown-content li {
    margin: 0.5em 0;
  }
  .markdown-content pre {
    background: #f6f8fa;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    line-height: 1.45;
  }
  .markdown-content code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    padding: 0.2em 0.4em;
  }
  .markdown-content pre code {
    background: transparent;
    padding: 0;
  }
  .markdown-content blockquote {
    border-left: 4px solid #dfe2e5;
    color: #6a737d;
    padding: 0 1em;
    margin: 0 0 16px 0;
  }
  .markdown-content table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    display: block;
    overflow-x: auto;
  }
  .markdown-content th, 
  .markdown-content td {
    border: 1px solid #dfe2e5;
    padding: 6px 13px;
  }
  .markdown-content th {
    font-weight: 600;
    background: #f6f8fa;
  }
  .markdown-content img {
    max-width: 100%;
    box-sizing: content-box;
    background-color: #fff;
  }
`;
document.head.appendChild(style);

const route = useRoute();
const router = useRouter();
const project = ref(null);
const loading = ref(true);
const error = ref(null);
const activeDoc = ref('readme');
const docs = ref([]);

// Utility functions
const scrollToHeading = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// Fetch documentation files from repository
const fetchDocumentation = async (repoName) => {
  const results = [];
  const docFiles = await fetchRepoDocumentation(repoName, DOC_FILES);

  for (const { path: docPath, data } of docFiles) {
    const content = decodeBase64(data.content);
    const html = processMarkdown(content, repoName);
    
    const docInfo = {
      path: docPath,
      name: formatDocName(docPath),
      content,
      html,
      type: getDocType(docPath)
    };

    // Extract additional info for README
    if (docPath === 'README.md') {
      Object.assign(docInfo, extractProjectInfo(content, repoName));
      docInfo.toc = generateTOC(content);
    }

    results.push(docInfo);
  }

  return results;
};


// Fetch project details and documentation
const fetchProjectDetails = async () => {
  try {
    loading.value = true;
    error.value = null;
    const repoName = route.params.id;

    // Fetch basic repository info
    const response = await fetch(`https://api.github.com/repos/allan-bismarck/${repoName}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      }
    });

    if (!response.ok) {
      throw new Error('Projeto não encontrado');
    }

    project.value = await response.json();

    // Fetch all documentation files
    const documentation = await fetchDocumentation(repoName);
    docs.value = documentation;

    // Set readme as active by default if available
    const readme = documentation.find(doc => doc.path === 'README.md');
    if (readme) {
      project.value.readmeInfo = readme;
    } else {
      project.value.readmeInfo = null;
    }

    // Add deploy URL if available
    if (project.value.homepage) {
      project.value.deployUrl = project.value.homepage.startsWith('http')
        ? project.value.homepage
        : `https://${project.value.homepage}`;
    }
  } catch (err) {
    console.error('Erro ao buscar detalhes do projeto:', err);
    error.value = 'Não foi possível carregar os detalhes do projeto.';
  } finally {
    loading.value = false;
  }
};


// Toggle documentation view
const setActiveDoc = (doc) => {
  activeDoc.value = doc.path;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Abrir imagem em modal
const openImageModal = (imageUrl) => {
  window.open(imageUrl, '_blank');
};


// Run
onMounted(() => {
  fetchProjectDetails();
});
</script>

<template>
  <div class="project-detail">
    <!-- Loading State -->
    <LoadingSpinner 
      v-if="loading" 
      message="Carregando detalhes do projeto..." 
    />

    <!-- Error State -->
    <ErrorMessage 
      v-else-if="error" 
      :message="error"
      @retry="fetchProjectDetails"
    />

    <!-- Project Content -->
    <div v-else-if="project" class="project-content">
      <div class="project-header">
        <div class="project-title-section">
          <h1>{{ project.name }}</h1>
          <div class="project-actions">
            <a :href="project.html_url" target="_blank" rel="noopener" class="btn btn-primary">
              <i class="fab fa-github"></i> Ver no GitHub
            </a>
            <a v-if="project.deployUrl" :href="project.deployUrl" target="_blank" rel="noopener" class="btn btn-secondary">
              🌐 Ver Projeto
            </a>
          </div>
        </div>
        
        <p class="project-description">{{ project.description }}</p>

        <div class="project-meta">
          <div class="meta-item" v-if="project.language">
            <span class="meta-icon language-dot" :style="{ backgroundColor: getLanguageColor(project.language) }"></span>
            <span class="meta-text">{{ project.language }}</span>
          </div>

          <div class="meta-item" v-if="project.updated_at">
            <span class="meta-icon">📅</span>
            <span class="meta-text">Atualizado em {{ formatDate(project.updated_at) }}</span>
          </div>

          <div class="meta-item" v-if="project.stargazers_count !== undefined">
            <span class="meta-icon">⭐</span>
            <span class="meta-text">{{ project.stargazers_count }} estrelas</span>
          </div>

          <div class="meta-item" v-if="project.forks_count !== undefined">
            <span class="meta-icon">🍴</span>
            <span class="meta-text">{{ project.forks_count }} forks</span>
          </div>
        </div>
      </div>

      <div class="project-body">
        <div class="project-sidebar">
          <!-- Documentação -->
          <div class="sidebar-section">
            <div class="section-header">
              <h3><i class="fas fa-book"></i> Documentação</h3>
            </div>
            <ul class="doc-nav">
              <li
                v-for="doc in docs"
                :key="doc.path"
                :class="{ active: activeDoc === doc.path }"
                @click="setActiveDoc(doc)"
              >
                <span class="doc-icon" :class="doc.type">
                  {{ getDocIcon(doc.type) }}
                </span>
                <span class="doc-name">{{ doc.name }}</span>
              </li>
            </ul>
          </div>

          <!-- Tecnologias -->
          <div v-if="project.readmeInfo?.technologies?.length" class="sidebar-section">
            <div class="section-header">
              <h3><i class="fas fa-code"></i> Tecnologias</h3>
            </div>
            <div class="tech-tags">
              <span v-for="(tech, index) in project.readmeInfo.technologies" 
                :key="index" 
                class="tech-tag">
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Sumário -->
          <div v-if="activeDoc === 'readme' && project.readmeInfo?.toc?.length" class="sidebar-section">
            <div class="section-header">
              <h3><i class="fas fa-list"></i> Sumário</h3>
            </div>
            <ul class="toc">
              <li
                v-for="(item, index) in project.readmeInfo.toc"
                :key="index"
                :class="`toc-level-${item.level}`"
              >
                <a :href="`#${item.id}`" @click.prevent="scrollToHeading(item.id)">
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Mídia do Projeto -->
          <div v-if="project.readmeInfo?.screenshots?.length || project.readmeInfo?.mediaUrls?.length" class="sidebar-section">
            <div class="section-header">
              <h3><i class="fas fa-images"></i> Mídia do Projeto</h3>
            </div>
            
            <!-- Screenshots -->
            <div v-if="project.readmeInfo.screenshots?.length" class="media-section">
              <h4>Imagens</h4>
              <div class="screenshots-grid">
                <div
                  v-for="(screenshot, index) in project.readmeInfo.screenshots"
                  :key="'screenshot-'+index"
                  class="screenshot-thumb"
                  @click="openImageModal(screenshot.url)"
                >
                  <img :src="screenshot.url" :alt="screenshot.alt || 'Screenshot do projeto'" loading="lazy" />
                  <div class="screenshot-overlay">
                    <span class="view-icon">🔍</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Media URLs -->
            <div v-if="project.readmeInfo.mediaUrls?.length" class="media-section">
              <h4>Links de Mídia</h4>
              <ul class="media-links">
                <li v-for="(url, index) in project.readmeInfo.mediaUrls" :key="'media-'+index">
                  <a :href="url" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i>
                    <span class="media-url">{{ url }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="project-main">
          <div class="content-header">
            <h2 class="content-title">
              <span v-if="activeDoc === 'readme'">README</span>
              <span v-else>{{ docs.find(doc => doc.path === activeDoc)?.name || 'Documentação' }}</span>
            </h2>
            
            <div class="content-actions">
              <button 
                v-if="activeDoc !== 'readme' && docs.some(doc => doc.path === 'README.md')"
                @click="setActiveDoc({path: 'readme'})"
                class="btn btn-sm btn-outline"
              >
                <i class="fas fa-book"></i> Ver README
              </button>
            </div>
          </div>

          <!-- README Content -->
          <div 
            v-if="activeDoc === 'readme'" 
            class="markdown-content readme-content"
            v-html="project.readmeInfo?.html || 'Nenhuma documentação disponível.'"
          ></div>

          <!-- Other Documentation Content -->
          <div
            v-else
            v-for="doc in docs"
            :key="doc.path"
            v-show="activeDoc === doc.path"
            class="markdown-content"
            v-html="doc.html || 'Nenhum conteúdo disponível.'"
          ></div>

          <!-- No Documentation -->
          <div v-if="!docs.length" class="no-docs">
            <div class="empty-state">
              <i class="fas fa-file-alt empty-icon"></i>
              <p>Nenhum documento de documentação encontrado para este projeto.</p>
            </div>
          </div>

          <div class="project-actions-footer">
            <button @click="router.push('/projects')" class="btn btn-outline">
              <i class="fas fa-arrow-left"></i> Voltar para Projetos
            </button>
          </div>
        </div> <!-- /.project-main -->
      </div> <!-- /.project-body -->
    </div> <!-- /.project-content -->

    <!-- Not Found State -->
    <div v-else class="not-found">
      <h2>Projeto não encontrado</h2>
      <router-link to="/projects" class="btn">Voltar para Projetos</router-link>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary: #4a6cf7;
  --primary-light: #ebf4ff;
  --text-dark: #2d3748;
  --text-muted: #4a5568;
  --bg-light: #f7fafc;
  --border-color: #e2e8f0;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --radius-sm: 6px;
  --radius-md: 8px;
  --transition: all 0.3s ease;
}

/* Layout */
.project-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
  color: var(--text-dark);
  line-height: 1.6;
}

.project-content {
  animation: fadeIn 0.5s ease;
}

.project-header {
  background: white;
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.project-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.project-title-section h1 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--text-dark);
}

.project-description {
  margin: 0.5rem 0 1.5rem;
  font-size: 1.1rem;
  color: var(--text-muted);
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.meta-icon {
  font-size: 1.1rem;
}

.language-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* Project Body Layout */
.project-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .project-body {
    grid-template-columns: 1fr;
  }
  
  .project-title-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-actions {
    width: 100%;
    display: flex;
    gap: 1rem;
  }
  
  .project-actions a {
    flex: 1;
    text-align: center;
    justify-content: center;
  }
}

/* Sidebar */
.project-sidebar {
  position: sticky;
  top: 2rem;
  align-self: start;
}

.sidebar-section {
  background: white;
  border-radius: var(--radius-md);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.section-header {
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Documentation Navigation */
.doc-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.doc-nav li {
  padding: 0.5rem 0.75rem;
  margin: 0.25rem 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
}

.doc-nav li:hover {
  background: var(--bg-light);
}

.doc-nav li.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 500;
}

.doc-icon {
  font-size: 1.1rem;
}

/* Technologies */
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tech-tag {
  background: var(--bg-light);
  color: var(--text-muted);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: var(--transition);
}

.tech-tag:hover {
  background: var(--primary-light);
  color: var(--primary);
}

/* Table of Contents */
.toc {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc li {
  margin: 0.25rem 0;
}

.toc a {
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  transition: var(--transition);
  display: block;
  padding: 0.25rem 0;
}

.toc a:hover {
  color: var(--primary);
}

.toc-level-1 { padding-left: 0; }
.toc-level-2 { padding-left: 12px; }
.toc-level-3 { padding-left: 24px; }
.toc-level-4 { padding-left: 36px; }

/* Media Section */
.media-section {
  margin-top: 1rem;
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.screenshot-thumb {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.screenshot-thumb:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.screenshot-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.screenshot-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.screenshot-thumb:hover .screenshot-overlay {
  opacity: 1;
}

.view-icon {
  color: white;
  font-size: 1.5rem;
}

.media-links {
  padding-left: 1rem;
  margin: 0.5rem 0;
}

.media-links li {
  margin: 0.5rem 0;
  word-break: break-all;
}

.media-links a {
  color: var(--primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.media-links a:hover {
  text-decoration: underline;
}

.media-url {
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Main Content Area */
.project-main {
  background: white;
  border-radius: var(--radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.content-title {
  margin: 0;
  font-size: 1.4rem;
  color: var(--text-dark);
}

.btn-sm {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
}

.markdown-content {
  word-wrap: break-word;
}

.readme-content {
  animation: fadeIn 0.3s ease;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Footer Actions */
.project-actions-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-sm);
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
  transition: var(--transition);
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: #3a5bd9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.2);
}

.btn-secondary {
  background: #edf2f7;
  color: var(--text-dark);
}

.btn-secondary:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 1px solid #cbd5e0;
  color: var(--text-muted);
}

.btn-outline:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

/* Loading & Error States */
.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Adjustments */
@media (max-width: 576px) {
  .project-header {
    padding: 1.25rem;
  }
  
  .project-main {
    padding: 1.25rem;
  }
  
  .project-title-section h1 {
    font-size: 1.5rem;
  }
  
  .meta-item {
    font-size: 0.8rem;
  }
}
</style>