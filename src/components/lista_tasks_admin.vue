<template>
  <div class="container list">

    <div v-if="message" id="alert" class="alert mb-5" :class="successful ? 'alert-success' : 'alert-danger'">
      {{ message }}
      <v-icon @click="closeAlert" style="float: right;">mdi-close-circle</v-icon>
    </div>

    <div>
      <v-card class="mx-auto" tile dark>
        <v-card-title>Tasks</v-card-title>

        <v-data-table :headers="headers" :items="tasks">

          <template v-slot:item="{ item }">
            <tr @click="showDetailsDialog(item.id)" class="text-left">
              <td>{{ item.title }}</td>
              <td>{{ item.note }}</td>
              <td>{{ item.creationDate }}</td>
              <td>{{ item.lastEdit }}</td>
              <td>
                <v-avatar class="mr-1" color="grey" size="40px">
                  <v-img v-if="item.image" :src="item.image" size="40px" />
                  <v-icon v-else style="color: antiquewhite;" size="40px">mdi-account-circle</v-icon>
                </v-avatar>
                <strong>{{ item.username }}</strong>
              </td>
              <td>
                <v-icon large class="mr-3" color="warning"
                  @click.stop="showEditDialog(item.id)">mdi-pencil-circle</v-icon>
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
                <v-text-field v-model="currentTask.title" :rules="[(v) => !!v || 'Title is required']" label="Title"
                  required></v-text-field>

                <v-text-field v-model="currentTask.note" :rules="[(v) => !!v || 'Note is required']" label="Note"
                  required></v-text-field>

                <v-text-field v-model="currentTask.creationDate" label="Creation Date" readonly></v-text-field>

                <div v-if="currentTask.lastEdit !== currentTask.creationDate">
                  <v-text-field v-model="currentTask.lastEdit" label="Last Edit" readonly></v-text-field>
                </div>
                <div v-else>
                  <v-text-field placeholder="Not yet modified" readonly></v-text-field>
                </div>

                <div>
                  <v-select v-model="selectedUser" :items="usersEdit" label="Assigned To"
                    @change="changeAssignedUser(selectedUser)">
                    <template v-slot:selection="{ item }">
                      <v-avatar class="mr-1" color="grey" size="40px">
                        <v-img v-if="item.image" :src="item.image" size="40px" />
                        <v-icon v-else style="color: antiquewhite;" size="40px">mdi-account-circle</v-icon>
                      </v-avatar>
                      {{ item.username }}
                    </template>
                    <template v-slot:item="{ item }">
                      <v-list-item-avatar class="">
                        <v-img v-if="item.image" :src="item.image" size="24px" />
                        <v-icon v-else>mdi-account-circle</v-icon>
                      </v-list-item-avatar>
                      <strong>{{ item.username }}</strong>
                    </template>
                  </v-select>
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
                  <v-img v-if="currentTask.image" :src="currentTask.image" size="40px" />
                  <v-icon v-else style="color: antiquewhite;" size="40px">mdi-account-circle</v-icon>
                </v-avatar>
                <strong>{{ currentTask.username }}</strong>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-card-actions v-if="tasks.length > 0">
          <v-btn small color="error" @click="removeAllTasks">
            Remove All
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

  </div>
</template>

<script>
import TasksService from '../services/task.service'
import UserService from '../services/user.service'
import ImageService from '../services/image.service'
import { Buffer } from 'buffer'

export default {
  name: "lista_tasks_admin",
  data() {
    return {
      tasks: [],
      usersEdit: [],
      user: {
        id: '',
        username: '',
        email: '',
        password: ''
      },
      currentTask: {
        title: '',
        note: '',
        creationDate: '',
        lastEdit: '',
        users: []
      },
      headers: [
        { text: "Title", value: "title", sortable: false, align: "start" },
        { text: "Note", value: "note", sortable: false },
        { text: "CreationDate", value: "creationDate", sortable: false },
        { text: "LastEdit", value: "lastEdit", sortable: false },
        { text: "AssignedTo", value: "assignedTo", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      title: '',
      content: '',
      editDialog: false,
      deleteDialog: false,
      message: '',
      successful: false,
      dialogItemId: null,
      selectedTaskDetails: null,
      detailsDialog: false,
      selectedUser: { image: '', username: '' }
    }
  },
  methods: {
    // ricerca task che coincidono con title selezionato
    //se effettua la ricerca per titolo ritorna solo quelli che coincidono,
    //se no ritorna tutte le tasks
    async searchAndRefreshList(title) {
      if (title) {
        try {
          const response = await TasksService.findByTitle(title)
          const tasks = response.data

          this.tasks = await this.getDisplayTasks(tasks)
        } catch (error) {
          console.error(error)
        }
      } else {
        try {
          const response = await TasksService.getAll()
          const tasks = response.data

          this.tasks = await this.getDisplayTasks(tasks)
        } catch (error) {
          console.error(error)
        }
      }
    },

    // assegna ogni task recuperato dal DB a un oggetto task dell'array
    getDisplayTasks(tasks) {
      return Promise.all(
        tasks.map(async (task) => {
          const userAssigned = await this.getUserAssigned(task.users[0])
          const userImage = await this.getImageByUserId(userAssigned.id)

          return {
            id: task.id,
            title: task.title.length > 40 ? task.title.substr(0, 30) + "..." : task.title,
            note: task.note.length > 40 ? task.note.substr(0, 30) + "..." : task.note,
            creationDate: task.creationDate,
            lastEdit: task.lastEdit == task.creationDate ? "Not yet modified" : task.lastEdit,
            username: userAssigned.username,
            image: userImage
          }
        })
      )
    },

    // rimozione di tutte le task e ritorno delle variabili allo stato iniziale
    removeAllTasks() {
      TasksService.deleteAll()
        .then(() => {
          this.successful = true
          this.message = 'All tasks removed successfully!'
          this.searchAndRefreshList()
        })
        .catch((error) => {
          console.error(error)
        })
    },

    // recupero degli user in base all'id passato come parametro
    async getUserAssigned(id) {
      try {
        const response = await UserService.get(id)
        return response.data
      } catch (error) {
        console.error(error)
        return {}
      }
    },

    async getImageByUserId(id) {
      try {
        const response = await ImageService.findImageByUserId(id)

        if (response && response.data[0]) {
          const bufferedData = Buffer.from(response.data[0].data, 'base64')
          const blob = new Blob([bufferedData], { type: response.data[0].contentType })
          const imageUrl = URL.createObjectURL(blob)
          return imageUrl
        } else {
          console.log('No Image associated to this User: ID=' + id)
          return ''
        }
      } catch (error) {
        console.error(error)
        return {}
      }
    },

    // recupero task per update
    async getTask(id) {
      try {
        const response = await TasksService.get(id)
        this.currentTask = response.data
        const userAssigned = await this.getUserAssigned(this.currentTask.users[0])
        this.currentTask.username = userAssigned.username
        const image = await this.getImageByUserId(this.currentTask.users[0])
        this.currentTask.image = image
        return this.currentTask
      } catch (error) {
        console.error(error)
      }
    },

    // recupero di tutti gli users dal db
    async getAllUsersWithImage() {
      try {
        const response = await UserService.getAll()

        const users = await Promise.all(
          response.data.map(async (user) => {
            const image = await ImageService.findImageByUserId(user.id)
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              image: image
            }
          })
        )
        return users
      } catch (error) {
        console.error(error)
      }
    },

    // mostra il dialog corrispondente al button selezionato (update)
    async showEditDialog(id) {
      this.dialogItemId = id
      this.currentTask = await this.getTask(this.dialogItemId)
      this.usersEdit = await this.getAllUsersWithImage()
      this.selectedUser = { image: this.currentTask.image, username: this.currentTask.username }
      this.editDialog = true
    },

    // mostra il dialog corrispondente al button selezionato (delete)
    showDeleteDialog(id) {
      this.dialogItemId = id
      this.deleteDialog = true
    },

    // mostra il dialog corrispondente alla task selezionata (details)
    async showDetailsDialog(id) {
      this.dialogItemId = id
      this.currentTask = await this.getTask(this.dialogItemId)
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

    // update task selezionato, refresh lista dopo update e reset variabili necessarie per dialog
    async updateTask() {
      const date = new Date()
      this.currentTask.lastEdit = date.toLocaleString('it-IT', { timeZone: 'CET' })
      this.user = await this.changeAssignedUser(this.selectedUser.username)
      console.log('------------USER-----------\n')
      console.log(this.user)
      this.currentTask.users[0] = this.user.id

      TasksService.update(this.currentTask.id, this.currentTask)
        .then(() => {
          this.successful = true
          this.message = "The task was updated successfully!"
          this.searchAndRefreshList()
          this.resetDeleteStatus()
        })
        .catch(error => {
          console.error('Could not update Task: ' + error)
        })
    },

    async changeAssignedUser(selectedUser) {
      try {
        const response = await UserService.findByUsername(selectedUser.username)

        if (response && response.data && response.data.length > 0) {
          const userFound = response.data[0]
          console.log('USERFOUND\n')
          console.log(userFound)
          return userFound
        } else {
          // Handle the case where no user is found
          console.error('No user found with the specified username.')
        }
      } catch (error) {
        console.error('Error while fetching user by username:', error)
      }
    },

    // delete task selezionato, refresh lista dopo delete e reset variabili necessarie per dialog
    confirmDelete() {
      if (this.dialogItemId != null) {
        TasksService.delete(this.dialogItemId)
          .then(() => {
            this.successful = true
            this.message = 'The task was deleted successfully!'
            this.searchAndRefreshList()
            this.resetDeleteStatus()
          })
          .catch((error) => {
            console.error(error)
            this.resetDeleteStatus()
          })
      } else {
        console.error('Id non valido')
      }
    }
  }
  ,
  mounted() {
    UserService.getPublicContent().then(
      () => {
        this.searchAndRefreshList()
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
  width: 1200px;
  height: 800px;
}

#alert {
  width: 800px;
  height: 50px;
  margin: auto;
}

.bg {
  background: rgb(255, 197, 185);
  background: linear-gradient(0deg, rgba(255, 197, 185) 0%, rgba(220, 246, 223) 35%, rgba(255, 255, 255) 74%);
}
</style>