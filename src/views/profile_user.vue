<template>
    <div class="container">
      <v-container fluid>
          <v-card max-width="450px" class="mx-auto bg" elevation="2">

            <v-row justify="center">
              <v-col align-self="start" class="d-flex justify-center align-center pa-0" cols="12">
                <v-avatar class="profile avatar-shadow mt-5" color="grey" size="164">
                  <v-icon style="color: antiquewhite;" size="200">mdi-account-circle</v-icon>
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
                    <strong>Email:</strong>
                    {{ currentUser.email }}
                  </v-card-subtitle>
                  <v-card-subtitle>
                      <strong>Id:</strong>
                      {{currentUser.id}}
                  </v-card-subtitle>
                  <v-card-subtitle>
                    <strong>Token:</strong>
                    {{currentUser.accessToken.substring(0, 15)}} ... {{currentUser.accessToken.substr(currentUser.accessToken.length - 15)}}
                  </v-card-subtitle>
                  <v-card-subtitle>
                    <p v-for="(role,index) in currentUser.roles" :key="index"><strong>Authorities:</strong> {{role}}</p>
                  </v-card-subtitle>
                  <v-card-action>
                    <v-btn style="background-color: lightseagreen;" v-if="currentUser.roles == 'ROLE_ADMIN'" to="/tasksAdmin"><strong>RETURN TO TASKS</strong></v-btn>
                    <v-btn style="background-color: lightseagreen;" v-if="currentUser.roles == 'ROLE_USER'" to="/tasksUser"><strong>RETURN TO TASKS</strong></v-btn>
                  </v-card-action>
                </v-list-item-content>
              </v-list-item>
          </v-card>
        </v-container>
    </div>
  </template>
  
  <script>
  export default {
    name: 'profile_user',
    computed: {
      // ritorna i dati dell'utente loggato
      currentUser() {
        return this.$store.state.auth.user;
      }
    },
    mounted() {
      // se non è loggato nessun utente reindirizza a /login
      if (!this.currentUser) {
        this.$router.push('/login');
      }
    },
    methods: {
      //
    }
  }
  </script>

  <style scoped>
    .upload-btn{
      position: absolute !important;
        z-index: 999;
        top: 121px;
    }

    .bg{
    background: rgb(255,197,185);
    background: linear-gradient(0deg, rgba(255,197,185) 0%, rgba(220,246,223) 35%, rgba(255,255,255) 74%);
    }

    .avatar-shadow{
    box-shadow: 0px 0px 10px 0px rgba(33, 0, 221, 0.75);
    -webkit-box-shadow: 0px 0px 10px 0px rgba(33, 0, 221, 0.75);
    -moz-box-shadow: 0px 0px 10px 0px rgba(33, 0, 221, 0.75);
    }
    
  </style>