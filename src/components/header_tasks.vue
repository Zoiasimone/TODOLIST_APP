<template>
  <div>
    <v-app-bar app dark>
      <div class="mx-3">
        TODOLIST-APP
      </div>

      <v-btn outlined v-if="(currentUser && isUser)" to="/tasksUser" text>
        Tasks list <v-icon>mdi-database-outline</v-icon>
      </v-btn>
      <v-btn outlined v-if="(currentUser && isAdmin)" to="/tasksAdmin" text>
        Tasks list <v-icon>mdi-database-outline</v-icon>
      </v-btn>
      <v-btn outlined class="mx-2" v-if="isAdmin" to="/addTask" text>
        New Task <v-icon>mdi-plus-circle</v-icon>
      </v-btn>
      
      <v-autocomplete 
        v-if="isTasksRoute"
        class="mt-4 mx-5"
        v-model="titleSearch"
        :items="tasksAutocomplete"
        item-text="title"
        label="Search by title"
        dark
        clearable
        @change="handleTitleSelection"
      />
      <v-spacer></v-spacer>

      <div v-if="!currentUser">
        <v-btn  class="mx-3" outlined to="/register" text>
          Sign Up <v-icon>mdi-chevron-down-circle-outline</v-icon>
        </v-btn>
        <v-btn outlined to="/login" text>
          Login <v-icon>mdi-login</v-icon>
        </v-btn>
      </div>
      <div v-if="currentUser">
        <v-btn outlined class="mx-3" to="/profile" text>
          {{ currentUser.username }}<v-icon>mdi-account-circle</v-icon>
        </v-btn>
        <v-btn outlined href @click="logOut" text>
          LogOut<v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import UserService from '@/services/user.service'
import TasksDataService from '@/services/TasksDataService'

export default {
  name: 'header_tasks',
  data() {
    return {
      titleSearch: '',
      tasksAutocomplete: []
    }
  },
  methods: {
    // effettua il logOut dell'utente
    logOut() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },

    //recupera le tasks dal DB e le assegna all'array che verrà mostrato nella tabella
    retrieveTasks() {
      TasksDataService.getAll()
        .then((response) => {
          this.tasksAutocomplete = response.data.map(this.getDisplayTasks)
          console.log(response.data)
        })
        .catch((err) => {
          console.error(err)
        })
    },

    // assegna ogni task recuperato dal DB a un oggetto task dell'array
    getDisplayTasks(task) {
      return {
        id: task.id,
        title: task.title.length > 40 ? task.title.substr(0, 30) + "..." : task.title,
        note: task.note.length > 40 ? task.note.substr(0, 30) + "..." : task.note,
        creationDate: task.creationDate,
        lastEdit: task.lastEdit == task.creationDate ? "Not yet modified" : task.lastEdit
      }
    },

    // assegna il valore del titleSelected recuperato alla variabile dell'autocomplete titleSearch
    // titleSearch rappresenta il title selezionato dalla lista di ricerca
    handleTitleSelection() {
      this.$emit('titleSelected', this.titleSearch)
    }
  },
  mounted() {
    // il componente header_tasks viene montato e vengono recuperati i task dal db
    // per poi essere assegnati i title all'autocomplete di ricerca
    UserService.getPublicContent().then(
      () => { 
        this.retrieveTasks() 
      },
      error => {
        console.error(
          (error.response && error.response.data) ||
          error.message ||
          error.toString())
      }
    )
  },
  computed: {
    // recupero dati utente loggato
    currentUser() {
      return this.$store.state.auth.user
    },
    // controllo se utente = admin
    isAdmin() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN')
      }
      return false
    },
    // controllo se utente = user
    isUser() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_USER')
      }
      return false
    },
    // Verifica se si è sulla route indicata
    isTasksRoute() {
      return this.$route.path === '/tasksAdmin' || this.$route.path === '/tasksUser'
    },
  },
}
</script>

<style scoped>
  #btn-color {
    background-color: darkcyan;
  }
</style>