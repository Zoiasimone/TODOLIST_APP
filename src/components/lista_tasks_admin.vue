<template>
    <div class="container list">

      <div
      v-if="message"
      id="alert"
      class="alert mb-5"
      :class="successful ? 'alert-success' : 'alert-danger'">
      {{message}}
      <v-icon @click="closeAlert" style="float: right;">mdi-close-circle</v-icon>
    </div>

      <div>
      <v-card class="mx-auto" tile dark>
        <v-card-title>Tasks</v-card-title>

        <v-data-table
          :headers="headers"
          :items="tasks"
          items-per-page="10">
          
          <template v-slot:item="{ item }">
            <tr @click="showDetailsDialog(item.id)" class="text-left">
              <td>{{ item.title }}</td>
              <td>{{ item.note }}</td>
              <td>{{ item.creationDate }}</td>
              <td>{{ item.lastEdit }}</td>
              <td>
                <v-icon large class="mr-3" color="warning" @click.stop="showEditDialog(item.id)">mdi-pencil-circle</v-icon>
                <v-icon large color="error" @click.stop="showDeleteDialog(item.id)">mdi-delete-circle</v-icon>
              </td>
            </tr>
          </template>

        </v-data-table>

        <v-dialog v-model="deleteDialog" max-width="400px">
            <v-card class="bg">
                <v-card-title class="headline">Confirm Delete</v-card-title>
                  <v-card-text style="color: black;">
                    Are you sure you want to delete this task?
                  </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="confirmDelete">Yes</v-btn>
                    <v-btn color="error" @click="closeDialog">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="editDialog" max-width="600px">
          <v-card class="bg">
            <v-card-title class="headline">Edit Task
              <v-spacer></v-spacer>
              <v-btn icon @click="closeDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-text-field
                  v-model="currentTask.title"
                  :rules="[(v) => !!v || 'Title is required']"
                  label="Title"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="currentTask.note"
                  :rules="[(v) => !!v || 'Note is required']"
                  label="Note"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="currentTask.creationDate"
                  label="Creation Date"
                  readonly
                ></v-text-field>

                <div v-if="currentTask.lastEdit !== currentTask.creationDate">
                  <v-text-field
                    v-model="currentTask.lastEdit"
                    label="Last Edit"
                    readonly
                  ></v-text-field>
                </div>
                <div v-else>
                  <v-text-field
                    placeholder="Not yet modified"
                    readonly
                  ></v-text-field>
                </div>

                <v-btn class="mt-2" color="warning" @click="updateTask">Update</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog v-model="detailsDialog" max-width="600px">
          <v-card class="bg">
            <v-card-title class="headline">Task Details
              <v-spacer></v-spacer>
              <v-btn icon @click="closeDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text>
                <v-text-field
                  v-model="currentTask.title"
                  label="Title"
                  readonly
                ></v-text-field>

                <v-text-field
                  v-model="currentTask.note"
                  label="Note"
                  readonly
                ></v-text-field>

                <v-text-field
                  v-model="currentTask.creationDate"
                  label="Creation Date"
                  readonly
                ></v-text-field>

                <div v-if="currentTask.lastEdit !== currentTask.creationDate">
                  <v-text-field
                    v-model="currentTask.lastEdit"
                    label="Last Edit"
                    readonly
                  ></v-text-field>
                </div>
                <div v-else>
                  <v-text-field
                    placeholder="Not yet modified"
                    readonly
                  ></v-text-field>
                </div>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-card-actions v-if="tasks.length > 0" >
          <v-btn small color="error" @click="removeAllTasks">
            Remove All
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

  </div>
</template>

<script>
import TasksDataService from '@/services/TasksDataService'
import UserService from '../services/user.service'


export default {
  name: "lista_tasks_admin",
  data() {
    return {
      tasks: [],
      title: '',
      content: '',
      editDialog: false,
      deleteDialog: false,
      message: '',
      successful: false,
      dialogItemId: null,
      selectedTaskDetails: null,
      detailsDialog: false,
      headers: [
        { text: "Title", align: "start", sortable: false, value: "title" },
        { text: "Note", value: "note", sortable: false },
        { text: "CreationDate", value: "creationDate", sortable: false },
        { text: "LastEdit", value: "lastEdit", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      currentTask: {
        title: '',
        note: '',
        creationDate: '',
        lastEdit: ''
      }
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

    // rimozione di tutte le task e ritorno delle variabili allo stato iniziale
    removeAllTasks() {
      TasksDataService.deleteAll()
        .then((response) => {
          console.log(response.data)
          this.successful = true
          this.message = 'All tasks removed successfully!'
          this.refreshList()
        })
        .catch((err) => {
          console.error(err)
        })
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
        lastEdit: task.lastEdit == task.creationDate ? "Not yet modified" : task.lastEdit
      }
    },

    // mostra il dialog corrispondente al button selezionato (update)
    showEditDialog(id) {
      this.dialogItemId = id
      this.currentTask = this.getTask(this.dialogItemId)
      this.editDialog = true
    },

    // mostra il dialog corrispondente al button selezionato (delete)
    showDeleteDialog(id) {
      this.dialogItemId = id
      this.deleteDialog = true
    },

    // mostra il dialog corrispondente alla task selezionata (details)
    showDetailsDialog(id) {
      this.dialogItemId = id
      this.currentTask = this.getTask(this.dialogItemId)
      this.detailsDialog = true
    },

    // chiusura dialog
    closeDialog() {
      this.deleteDialog = false
      this.editDialog = false
      this.detailsDialog = false
    },

    // reset variabili dialog
    resetDeleteStatus() {
      this.deleteDialog = false
      this.editDialog = false
    },

    // chiusura alert
    closeAlert() {
      this.message = ''
      this.successful = false
    },

    // recupero task per update
    getTask(id) {
      TasksDataService.get(id)
        .then((response) => {
          this.currentTask = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  
    // update task selezionato, refresh lista dopo update e reset variabili necessarie per dialog
    updateTask() {
      const date = new Date()
      this.currentTask.lastEdit = date.toLocaleString('it-IT', { timeZone: 'CET' })
      TasksDataService.update(this.currentTask.id, this.currentTask)
        .then(() => {
          this.successful = true
          this.message = "The task was updated successfully!";
          this.refreshList()
          this.resetDeleteStatus()
        })
        .catch((e) => {
          console.log(e);
        });
    },

    // delete task selezionato, refresh lista dopo delete e reset variabili necessarie per dialog
    confirmDelete() {
      if(this.dialogItemId != null) {
        TasksDataService.delete(this.dialogItemId)
        .then(() => {
          this.successful = true
          this.message = 'The task was deleted successfully!'
          this.refreshList()
          this.resetDeleteStatus()
        })
        .catch((err) => {
          console.error(err)
          this.resetDeleteStatus()
        })
      } else {
        console.log('Id non valido')
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

<style scoped>
.list {
  margin: auto;
  width: 1000px;
  height: 800px;
}

#alert {
  width: 800px;
  height: 50px;
  margin: auto;
}

.bg{
  background: rgb(255,197,185);
  background: linear-gradient(0deg, rgba(255,197,185) 0%, rgba(220,246,223) 35%, rgba(255,255,255) 74%);
}
</style>