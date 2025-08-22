import { createRouter, createWebHistory } from 'vue-router';
import Home from '../App.vue';
import ProjectDetail from '../views/ProjectDetail.vue';
import AllProjects from '../views/AllProjects.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: ProjectDetail,
    props: true
  },
  {
    path: '/projects',
    name: 'AllProjects',
    component: AllProjects
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
});

export default router;
