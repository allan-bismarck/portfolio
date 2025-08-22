// Utility helper functions

/**
 * Format repository name for display
 */
export const formatRepoName = (name) => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get initials from repository name
 */
export const getInitials = (name) => {
  if (!name) return '??';
  const words = name.split('-');
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Generate random color for project cards
 */
export const getRandomColor = () => {
  const colors = [
    '#4a6cf7', '#6c5ce7', '#00b894', '#00cec9', 
    '#0984e3', '#6c5ce7', '#e17055', '#fd79a8'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Get programming language color
 */
export const getLanguageColor = (lang) => {
  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Vue: '#41b883',
    Python: '#3572A5',
    Java: '#b07219',
    Kotlin: '#A97BFF',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Dart: '#00B4AB',
    Flutter: '#02569B'
  };
  return languageColors[lang] || '#94a3b8';
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

/**
 * Decode base64 content with proper UTF-8 handling
 */
export const decodeBase64 = (str) => {
  try {
    const clean = (str || '').replace(/\r?\n|\r/g, '');
    return decodeURIComponent(
      atob(clean)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    console.error('Error decoding content:', e);
    try {
      return atob((str || '').replace(/\r?\n|\r/g, ''));
    } catch {
      return '';
    }
  }
};

/**
 * Rewrite relative URLs for GitHub raw content
 */
export const rewriteRelativeMediaUrls = (html, repoName) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const toRaw = (path) => 
      `https://raw.githubusercontent.com/allan-bismarck/${repoName}/main/${path.replace(/^\.\//, '')}`;

    // Process images
    doc.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && !/^https?:\/\//i.test(src) && !src.startsWith('#') && !src.startsWith('data:')) {
        img.setAttribute('src', toRaw(src));
      }
    });

    // Process videos
    doc.querySelectorAll('video, source').forEach(el => {
      const src = el.getAttribute('src');
      if (src && !/^https?:\/\//i.test(src) && !src.startsWith('#') && !src.startsWith('data:')) {
        el.setAttribute('src', toRaw(src));
      }
    });

    // Open external links in new tab
    doc.querySelectorAll('a[href^="http"]').forEach(a => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });

    return doc.body.innerHTML;
  } catch (e) {
    console.warn('Failed to rewrite relative URLs:', e);
    return html;
  }
};
