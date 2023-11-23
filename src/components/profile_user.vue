<template>
  <div class="container">
    <v-container fluid>
      <v-card max-width="450px" class="mx-auto bg" elevation="2">
        <v-row justify="center">
          <v-col align-self="start" class="d-flex justify-center align-center pa-0" cols="12">
            <v-avatar class="avatar-shadow mt-5" color="grey" size="164" @click="showImageDialog">
              <v-img v-if="image" :src="image" size="auto" />
              <v-icon v-else style="color: antiquewhite;" size="200">mdi-account-circle</v-icon>
            </v-avatar>
          </v-col>
        </v-row>
        <v-list-item class="ma-4">
          <v-list-item-content>
            <v-list-item-title>
              <h4><strong>{{ currentUser.username }}</strong></h4>
            </v-list-item-title>
            <v-list-item-subtitle>Middleware Developer</v-list-item-subtitle>
            <v-card-subtitle>
              <strong>E-mail:</strong>
              {{ currentUser.email }}
            </v-card-subtitle>
            <v-card-subtitle>
              <strong>Id:</strong>
              {{ currentUser.id }}
            </v-card-subtitle>
            <v-card-subtitle>
              <strong>Token:</strong>
              {{ currentUser.accessToken.substring(0, 15) }} ...
              {{ currentUser.accessToken.substr(currentUser.accessToken.length - 15) }}
            </v-card-subtitle>
            <v-card-subtitle>
              <p v-for="(role, index) in currentUser.roles" :key="index"><strong>Authorities:</strong> {{ role }}</p>
            </v-card-subtitle>
            <v-btn class="mx-auto" style="background-color: lightseagreen;" v-if="currentUser.roles == 'ROLE_ADMIN'"
              to="/tasksAdmin"><strong>RETURN TO TASKS</strong></v-btn>
            <v-btn class="mx-auto" style="background-color: lightseagreen;" v-if="currentUser.roles == 'ROLE_USER'"
              to="/tasksUser"><strong>RETURN TO TASKS</strong></v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-container>

    <v-dialog v-model="imageDialog" max-width="600px">
      <v-card class="bg">
        <v-card-title>Upload Image</v-card-title>
        <v-card-text>
          <v-file-input v-model="previewImage" prepend-icon="mdi-camera"
            accept="image/png, image/jpeg, image/bmp, image/jpg" @change="selectImage" />
        </v-card-text>
        <v-btn class="mx-auto mb-2" color="success" prepend-icon="mdi-cloud-upload" @click="uploadImage">Upload</v-btn>
        <v-btn class="ml-5 mb-2" color="error" @click="imageDialog = false">exit</v-btn>

        <div v-if="previewImage">
          <div>
            <img class="preview mx-auto" :src="previewImage" />
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-alert v-if="message" color="blue-grey" dark>
      {{ message }}
      <v-icon @click="closeAlert" style="float: right;">mdi-close-circle</v-icon>
    </v-alert>
  </div>
</template>
  
<script>
import UserService from '../services/user.service'
import ImageService from '../services/image.service'

export default {
  name: 'profile_user',
  data() {
    return {
      imageDialog: false,
      previewImage: null,
      message: null,
      image: null,
      formData: new FormData(),
      imageBuilder: []
    }
  },
  computed: {
    // ritorna i dati dell'utente loggato
    currentUser() {
      return this.$store.state.auth.user
    }

  },
  mounted() {
    // se non è loggato nessun utente reindirizza a /login
    if (!this.currentUser) {
      this.$router.push('/login')
    }

    if (this.currentUser.image != 'NO_IMAGE') {
      ImageService.get(this.currentUser.image)
        .then(response => {
          if (response && response.data) {
            this.image = URL.createObjectURL(response.data)
          } else {
            console.error('No data found')
          }
        }).catch((error) => {
          console.error('Do not find image with id:' + this.currentUser.image, error.response)
        })
    }
  },
  methods: {
    // mostra il dialog corrispondente alla selezione dell'immagine profilo
    showImageDialog() {
      this.imageDialog = true
    },
    // chiusura dialog
    closeAlert() {
      this.message = ''
    },

    //seleziona l'immagine da impostare
    selectImage(image) {
      this.previewImage = URL.createObjectURL(image)
      this.formData = new FormData()
      this.formData.append('image', image)
      this.message = ''
    },

    //salva l'immagine nel db in base allo user loggato
    uploadImage() {
      if (this.currentUser.roles[0] == 'ROLE_ADMIN')
        this.currentUser.roles[0] = '654e0d6982423b1d3e726dc6'
      else
        this.currentUser.roles[0] = '654e0d6982423b1d3e726dc4'
      ImageService.create(this.formData).then(
        (response) => {
          this.currentUser.image = response.data.id
        }
      ).catch((error) => {
        console.error('Create image error:', error.response)
        this.message = 'Could not create the image! ' + error.response.data.message
        this.previewImage = undefined
        this.imageDialog = false
      })

      UserService.saveImageForUser(this.currentUser.id, this.currentUser).then(
        () => {
          this.message = 'Image created and uploaded successfully'
          this.previewImage = null
          this.imageDialog = false
        }
      ).catch((error) => {
        console.error('Upload image error:', error.response)
        this.message = 'Could not upload the image! ' + error.response.data
        this.currentUser.image = ''
        this.previewImage = null
        this.imageDialog = false
      })
    },
  }
}
</script>

<style scoped>
.bg {
  background: rgb(255, 197, 185);
  background: linear-gradient(0deg, rgba(255, 197, 185) 0%, rgba(220, 246, 223) 35%, rgba(255, 255, 255) 74%);
}

.avatar-shadow {
  box-shadow: 0px 0px 10px 0px rgba(33, 0, 221, 0.75);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(33, 0, 221, 0.75);
  -moz-box-shadow: 0px 0px 10px 0px rgba(33, 0, 221, 0.75);
}

.preview {
  height: 320px;
  width: 250px;
  margin-bottom: 3%;
  margin-top: 3%;
}
</style>