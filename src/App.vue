<template>
  <div id="app">
    <header_tasks @titleSelected="handleTitleSelected($event)"/> 
    <v-app>
      <router-view ref="listaTasksAdmin"/>
    </v-app>
  </div>
</template>

<script>
import header_tasks from './components/header_tasks.vue'

export default {
  name: 'App',
  data() {
    return {
      selectedTitle: ''
    }
  },
  components: {
    header_tasks
  },
  methods: {
    // setta selectedTitle = "title recuperato"
    // chiama il metodo searchAndRefreshList(selectedTitle) per refreshare la tabella con i task che coincidono con la ricerca
    handleTitleSelected(title) {
      this.selectedTitle = title
      this.$refs.listaTasksAdmin.searchAndRefreshList(this.selectedTitle)
    }
  }
};
</script>

<style>
  #app {
    font-family: Arial, Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background: url('https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg') no-repeat center top;
    width: 100%;
    height: 100%;
    top: 64px;
    left: 0;
    position: fixed; 
    z-index: -1;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
</style>
