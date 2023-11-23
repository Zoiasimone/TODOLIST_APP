<template>
  <div class="container list">
    <v-card class="mx-auto" tile dark>
      <v-card-title>Tasks</v-card-title>

      <v-data-table :headers="headers" :items="tasks" items-per-page="10">
      </v-data-table>
    </v-card>

    <v-dialog v-model="detailsDialog" max-width="600px">
      <v-card class="bg">
        <v-card-title class="headline">Task Details
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="currentTask.title" label="Title" readonly />

          <v-text-field v-model="currentTask.note" label="Note" readonly />

          <v-text-field v-model="currentTask.creationDate" label="Creation Date" readonly />

          <div v-if="currentTask.lastEdit !== currentTask.creationDate">
            <v-text-field v-model="currentTask.lastEdit" label="Last Edit" readonly />
          </div>
          <div v-else>
            <v-text-field placeholder="Not yet modified" readonly />
          </div>
          <div>
            <v-avatar class="mr-1" color="grey" size="40px">
              <v-img v-if="currentTask.userAssigned && currentTask.userAssigned.image"
                :src="currentTask.userAssigned.image" size="40px" />
              <v-icon v-else style="color: antiquewhite;" size="40px">mdi-account-circle</v-icon>
            </v-avatar>
            <h3 v-if="currentTask.userAssigned && currentTask.userAssigned.username">
              <strong>{{ currentTask.userAssigned.username }}</strong>
            </h3>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TasksDataService from '../services/task.service'
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
        { text: "LastEdit", value: "lastEdit", sortable: false }
      ],
      detailsDialog: false,
      currentTask: {
        title: '',
        note: '',
        creationDate: '',
        lastEdit: '',
        userAssigned: {
          username: '',
          image: ''
        }
      }
    }
  },
  methods: {
    // recupero delle tasks dal DB e asseganzione all'array che verrà mostrato nella tabella
    async retrieveTasks() {
      try {
        const response = await TasksDataService.getAll()
        const tasks = response.data

        const tasksWithUserAssigned = await Promise.all(
          tasks.map(async (task) => {
            const userAssigned = await this.getUserAssigned(task.users[0])

            return {
              id: task.id,
              title: task.title.length > 40 ? task.title.substr(0, 30) + "..." : task.title,
              note: task.note.length > 40 ? task.note.substr(0, 30) + "..." : task.note,
              creationDate: task.creationDate,
              lastEdit: task.lastEdit == task.creationDate ? "Not yet modified" : task.lastEdit,
              userAssigned: userAssigned
            }
          })
        )
        this.tasks = tasksWithUserAssigned
      } catch (err) {
        console.error(err)
      }
    },

    // refresh della lista dopo qualsiasi tipo di modifica
    refreshList() {
      this.retrieveTasks()
    },

    // ricerca task che coincidono con title selezionato
    searchAndRefreshList(title) {
      TasksDataService.findByTitle(title)
        .then((response) => {
          if (title) {
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
        lastEdit: task.lastEdit == task.creationDate ? "Not yet modified" : task.lastEdit,
        userAssigned: this.getUserAssigned(task.users[0])
      }
    },

    // recupero degli user in base all'id passato come parametro
    async getUserAssigned(id) {
      try {
        const response = await UserService.get(id)
        return response.data
      } catch (err) {
        console.error(err)
        return {}
      }
    },

    // mostra il dialog corrispondente alla task selezionata (details)
    showDetailsDialog(id) {
      this.dialogItemId = id
      this.currentTask = this.getTask(this.dialogItemId)
      this.detailsDialog = true
    },

    // chiusura dialog
    closeDialog() {
      this.detailsDialog = false
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