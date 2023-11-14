<template>
    <div class="col-md-12">
    <v-card class="mx-auto px-6 py-8" max-width="344" dark>
      <v-icon align-center>mdi-account</v-icon>
      <v-form v-model="form" @submit.prevent="loginUser">
        <v-text-field
          v-model="user.username"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Username"
        ></v-text-field>

        <v-text-field
          v-model="user.password"
          label="Password"
          :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="() => (value = !value)"
          :type="value ? 'password' : 'text'"
          :rules="[required]"
          class="mb-2"
          clearable
        ></v-text-field>
        <br>

        <v-btn
          :disabled="!form"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Login
        </v-btn>
      </v-form>
    </v-card>

    <div
      v-if="message"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >{{message}}</div>
  </div>
</template>
  
<script>
  import User from '../models/user';
  
  export default {
    name: 'login_user',
    data() {
      return {
        user: new User('', ''),
        message: '',
        form: false,
        value: String
      }
    },
    // i valori calcolati e/o memorizzati nelle proprietà computed vengono automaticamente 
    // aggiornati quando le dipendenze cambiano, assicurando che siano sempre sincronizzati 
    // con lo stato corrente dell'applicazione
    computed: {
      //controlla che sia loggato l'utente
      loggedIn() {
        return this.$store.state.auth.status.loggedIn
      }
    },
    // se l'utente è loggato reinderizzalo a /profile dopo il login
    // assieme ai dati dell'utente loggato
    created() {
      if (this.loggedIn) {
        this.$router.push('/profile')
      }
    },
    methods: {

      // effettua il login se username e password sono corretti
      loginUser() {
        if (!this.user.username && !this.user.password) {
          return
        }

        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/tasks');
            },
            error => {
              this.loading = false;
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          )
        }
      },
      required (v) {
        return !!v || 'Field is required'
      }
    }
  }
</script>
  
<style scoped>
.v-card {
  background-color: darkcyan;
}
</style>