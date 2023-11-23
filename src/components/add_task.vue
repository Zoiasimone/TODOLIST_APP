<template>
  <div class="submit-form bg mt-3 mx-auto pa-4">
    <p class="headline">Add new task
      <v-col>
        <v-btn color="error" class="mt-2 mr-5" @click="resetForm">reset form</v-btn>
        <v-btn color="warning" class="mt-2" @click="resetValidation">reset validation</v-btn>
      </v-col>
    </p>

    <div v-if="!submitted">
      <v-form ref="form" lazy-validation>
        <v-text-field v-model="task.title" :rules="[(v) => !!v || 'Title is required']" label="Title"
          required></v-text-field>

        <v-text-field v-model="task.note" :rules="[(v) => !!v || 'Note is required']" label="Note"
          required></v-text-field>
      </v-form>
      <v-btn color="success" class="mt-3" @click="saveTask">add</v-btn>
    </div>

    <div v-else>
      <v-card class="mx-auto">
        <v-card-title>
          Submitted successfully!
        </v-card-title>

        <v-card-subtitle>
          Click the button to add new Task.
        </v-card-subtitle>

        <v-card-actions>
          <v-btn color="success" @click="newTask">Add</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import TasksDataService from '../services/task.service'

export default {
  name: "add_task",
  data() {
    return {
      task: {
        id: null,
        title: '',
        note: '',
        creationDate: '',
        lastEdit: '',
        users: []
      },
      submitted: false,
    }
  },
  methods: {
    // crea e salva la task nella collection del DB
    saveTask() {
      const date = new Date()
      this.task.users.push(this.currentUser.id)
      var data = {
        title: this.task.title,
        note: this.task.note,
        creationDate: date.toLocaleString('it-IT', { timeZone: 'CET' }),
        lastEdit: date.toLocaleString('it-IT', { timeZone: 'CET' }),
        users: this.task.users[0]
      }

      TasksDataService.create(data)
        .then((response) => {
          this.task.id = response.data.id
          console.log(response.data)
          this.submitted = true
        })
        .catch((e) => {
          console.log(e)
        })
    },

    // dopo aver premuto il button di creazione della task, 
    // permette di ricreare subito un'altra task senza dover riaccedere alla ruote del componente
    newTask() {
      this.submitted = false
      this.task = {}
    },

    // resetta il form del componente
    resetForm() {
      this.$refs.form.reset()
    },

    // resetta la validazione del componente
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },
  computed: {
    // ritorna i dati dell'utente loggato
    currentUser() {
      return this.$store.state.auth.user
    }
  },
}
</script>

<style>
.submit-form {
  width: 500px;
  height: 350px;
  border-style: double;
}

.bg {
  background: rgb(255, 197, 185);
  background: linear-gradient(0deg, rgba(255, 197, 185) 0%, rgba(220, 246, 223) 35%, rgba(255, 255, 255) 74%);
}
</style>