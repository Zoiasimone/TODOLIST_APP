<template>
  <div class="container list">
    <v-card class="mx-auto" tile dark>
      <v-card-title>Tasks</v-card-title>

      <v-data-table
        :headers="headers"
        :items="tasks"
        items-per-page="10"
      >
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import TasksDataService from '@/services/TasksDataService'
import UserService from '../services/user.service'


export default {
  name: "lista_tasks_user",
  data() {
    return {
      tasks: [],
      title: '',
      content: '',
      headers: [
        { text: "Title", align: "start", sortable: false, value: "title" },
        { text: "Note", value: "note", sortable: false },
        { text: "CreationDate", value: "creationDate", sortable: false },
        { text: "LastDate", value: "lastDate", sortable: false }
      ],
    };
  },
  methods: {
    // recupera le tasks dal DB e le assegna all'array che verrà mostrato nella tabella
    retrieveTasks() {
      TasksDataService.getAll()
        .then((response) => {
          this.tasks = response.data.map(this.getDisplayTasks)
          console.log(response.data)
        })
        .catch((err) => {
          console.error(err)
        });
    },

    // refresh della lista dopo qualsiasi tipo di modifica
    refreshList() {
      this.retrieveTasks()
    },

    // ricerca task che coincidono con title selezionato
    searchAndRefreshList(title) {
      TasksDataService.findByTitle(title)
        .then((response) => {
          if(title) {
            this.tasks = response.data.map(this.getDisplayTasks)
            console.log(response.data)
          } else {
            this.retrieveTasks()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    // assegna ogni task recuperato dal DB a un oggetto task dell'array
    getDisplayTasks(task) {
      return {
        id: task.id,
        title: task.title.length > 40 ? task.title.substr(0, 30) + "..." : task.title,
        note: task.note.length > 40 ? task.note.substr(0, 30) + "..." : task.note,
        creationDate: task.creationDate,
        lastDate: task.lastDate == task.creationDate ? "Not yet modified" : task.lastDate
      }
    },
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
  // osserva i cambiamenti nelle proprietà definite all'interno.
  // quando una di queste proprietà cambia, il corrispondente 'handler' viene eseguito
  watch: {
    selectedTitle: {
      handler: 'searchAndRefreshList',
      immediate: true //chiama il metodo immediatamente alla montatura
    }
  }
}
</script>

<style>
.list {
  margin: auto;
  width: 1000px;
  height: 800px;
}
</style>