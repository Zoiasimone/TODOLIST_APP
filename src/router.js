import Vue from "vue";
import Router from "vue-router";
import header_tasks from "./components/header_tasks"
import lista_tasks_user from "./components/lista_tasks_user"
import lista_tasks_admin from "./components/lista_tasks_admin"
import login_user from "./components/login_user"
import register_user from "./components/register_user"

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home_app",
      component: header_tasks
    },
    {
      path: "/tasksUser",
      name: "lista_tasks_user",
      component: lista_tasks_user,props:true
    },
    {
      path: "/tasksAdmin",
      name: "lista_tasks_admin",
      component: lista_tasks_admin,props:true
    },
    {
      path: "/addTask",
      name: "add_task",
      component: () => import("./components/add_task")
    },
    {
      path: '/login',
      component: login_user
    },
    {
      path: '/register',
      component: register_user
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/profile_user.vue')
    }
  ]
});

