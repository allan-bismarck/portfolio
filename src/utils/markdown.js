// Markdown processing utilities
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { rewriteRelativeMediaUrls, decodeBase64 } from './helpers';

// Configure marked
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
  headerPrefix: 'md-',
  langPrefix: 'language-',
  xhtml: true
});

/**
 * Process markdown content to HTML
 */
export const processMarkdown = (content, repoName) => {
  // Render Markdown to HTML
  let html = marked(content);
  
  // Fix relative URLs for assets
  if (repoName) {
    html = rewriteRelativeMediaUrls(html, repoName);
  }
  
  // Sanitize HTML
  return DOMPurify.sanitize(html, { ADD_ATTR: ['target', 'rel'] });
};

/**
 * Format document name for display
 */
export const formatDocName = (path) => {
  const name = path
    .replace(/^docs\//, '')
    .replace(/\.md$/, '')
    .replace(/[-_]/g, ' ');

  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get document type for icon/display
 */
export const getDocType = (path) => {
  if (path === 'README.md') return 'readme';
  if (path === 'CHANGELOG.md') return 'changelog';
  if (path === 'CONTRIBUTING.md') return 'contributing';
  if (path.includes('docs/')) return 'docs';
  return 'document';
};

/**
 * Get document icon
 */
export const getDocIcon = (type) => {
  switch (type) {
    case 'readme': return '📘';
    case 'changelog': return '📝';
    case 'contributing': return '🤝';
    case 'docs': return '📚';
    default: return '📄';
  }
};

/**
 * Generate table of contents from markdown content
 */
export const generateTOC = (content) => {
  const headings = [];
  const lines = content.split('\n');

  lines.forEach(line => {
    const match = line.match(/^(#+)\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      headings.push({ level, title, id });
    }
  });

  return headings;
};

/**
 * Extract project information from README content
 */
export const extractProjectInfo = (readmeContent, repoName) => {
  const info = {
    features: [],
    technologies: [],
    installation: '',
    usage: '',
    screenshots: [],
    mediaUrls: []
  };

  // Extract features
  const featuresMatch = readmeContent.match(/##\s*🚀\s*Features\n([\s\S]*?)(?=\n## |$)/i);
  if (featuresMatch) {
    info.features = featuresMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[\s*\-]+/, '').trim());
  }

  // Extract technologies
  const techSection = readmeContent.match(/##\s*(?:🛠️|Tecnologias|Technologies|Tech Stack|Built With)\n([\s\S]*?)(?=\n## |$)/i);
  if (techSection) {
    info.technologies = techSection[1]
      .split('\n')
      .map(l => l.replace(/[-*]/g, '').trim())
      .filter(Boolean);
  }

  // Extract installation instructions
  const installMatch = readmeContent.match(/##\s*(?:🚀\s*)?(?:Instalação|Installation|Getting Started)\n([\s\S]*?)(?=\n## |$)/i);
  if (installMatch) {
    info.installation = installMatch[1].trim();
  }

  // Extract usage instructions
  const usageMatch = readmeContent.match(/##\s*(?:📝\s*)?(?:Uso|Usage|How to Use|Documentação|Documentation)\n([\s\S]*?)(?=\n## |$)/i);
  if (usageMatch) {
    info.usage = usageMatch[1].trim();
  }

  // Extract screenshots and media URLs
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const urlRegex = /(https?:\/\/[^\s)]+(\.(?:png|jpg|jpeg|gif|webp|mp4|webm|mov|youtube\.com|youtu\.be))[^\s)]*)/gi;
  
  let match;
  const processedUrls = new Set();
  
  // Process images from markdown
  while ((match = imgRegex.exec(readmeContent)) !== null) {
    const url = match[2].startsWith('http') ? match[2] : `https://raw.githubusercontent.com/allan-bismarck/${repoName}/main/${match[2]}`;
    if (url.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
      info.screenshots.push({
        alt: match[1] || 'Screenshot',
        url: url
      });
      processedUrls.add(url);
    }
  }
  
  // Extract all media URLs from content
  let urlMatch;
  while ((urlMatch = urlRegex.exec(readmeContent)) !== null) {
    const url = urlMatch[0];
    if (!processedUrls.has(url) && 
        (url.match(/\.(png|jpg|jpeg|gif|webp|mp4|webm|mov)$/i) || 
         url.includes('youtube.com/watch') || 
         url.includes('youtu.be/'))) {
      info.mediaUrls.push(url);
      processedUrls.add(url);
    }
  }

  return info;
};
