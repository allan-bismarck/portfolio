// GitHub API utilities
export const GITHUB_USERNAME = 'allan-bismarck';
export const GITHUB_API_BASE = 'https://api.github.com';

const API_OPTIONS = {
  method: 'GET',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-App'
  }
};

/**
 * Check if a repository has APK files in its releases
 */
export const checkForApkFiles = async (repoName) => {
  try {
    // First check if the repo has any releases
    const releasesResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/releases`, 
      API_OPTIONS
    );
    
    if (!releasesResponse.ok) {
      return { hasApk: false, apkUrl: null };
    }
    
    const releases = await releasesResponse.json();
    
    // If there are no releases, return false
    if (!releases || releases.length === 0) {
      return { hasApk: false, apkUrl: null };
    }
    
    // Check the latest release for APK files
    const latestRelease = releases[0];
    const apkAsset = latestRelease.assets.find(asset => 
      asset.name.toLowerCase().endsWith('.apk')
    );
    
    if (apkAsset) {
      return { 
        hasApk: true, 
        apkUrl: apkAsset.browser_download_url,
        apkName: apkAsset.name,
        releaseTag: latestRelease.tag_name,
        releaseUrl: latestRelease.html_url
      };
    }
    
    return { hasApk: false, apkUrl: null };
  } catch (error) {
    console.error(`Error checking APK for ${repoName}:`, error);
    return { hasApk: false, apkUrl: null };
  }
};

/**
 * Fetch GitHub user data
 */
export const fetchGitHubUser = async () => {
  const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, API_OPTIONS);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Erro ${response.status}: ${errorData.message || 'Falha ao buscar dados do usuário'}`);
  }
  
  return response.json();
};

/**
 * Fetch GitHub repositories
 */
export const fetchGitHubRepos = async () => {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&direction=desc`, 
    API_OPTIONS
  );
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Erro ${response.status}: ${errorData.message || 'Falha ao buscar repositórios'}`);
  }
  
  const repos = await response.json();
  
  // Filter relevant repositories
  const filteredRepos = repos.filter(repo => 
    !repo.fork && 
    !repo.archived &&
    repo.name !== GITHUB_USERNAME &&
    repo.name !== `${GITHUB_USERNAME}.github.io`
  );
  
  // Check for APK files in mobile app repositories
  const reposWithApkInfo = await Promise.all(filteredRepos.map(async (repo) => {
    // Check if it's likely a mobile app repository based on topics or language
    const isMobileApp = 
      (repo.topics && (repo.topics.includes('android') || repo.topics.includes('flutter') || repo.topics.includes('dart'))) ||
      repo.language === 'Kotlin' || 
      repo.language === 'Java' || 
      repo.language === 'Dart';
    
    if (isMobileApp) {
      const apkInfo = await checkForApkFiles(repo.name);
      return { ...repo, ...apkInfo };
    }
    
    return { ...repo, hasApk: false, apkUrl: null };
  }));
  
  return reposWithApkInfo;
};


/**
 * Fetch repository documentation files
 */
export const fetchRepoDocumentation = async (repoName, docPaths) => {
  const results = [];

  for (const docPath of docPaths) {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/contents/${encodeURIComponent(docPath)}`, 
        API_OPTIONS
      );

      if (response.ok) {
        const data = await response.json();
        results.push({
          path: docPath,
          data
        });
      }
    } catch (err) {
      // Continue silently if file doesn't exist
      console.warn(`Could not fetch ${docPath}:`, err);
    }
  }

  return results;
};
