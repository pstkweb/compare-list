import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import List from '@/components/List';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/:id',
      name: 'List',
      component: List,
    },
  ],
});
