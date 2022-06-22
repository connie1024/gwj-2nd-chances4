
<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="rgb(239, 117, 47)">
                <v-toolbar-title>Register Form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="mail"
                    name="email"
                    label="email"
                    type="text"
                    v-model="email"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="person"
                    name="username"
                    label="username"
                    type="text"
                    v-model="username"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="rgb(239, 117, 47)"
                  @click="register()"
                  style="margin-left:80px"
                  ><span
                    style="color:white;text-align:center;line-height: 60px;"
                    >Register</span
                  ></v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      email: "",
      password: "",
      username: "",
      error: null,
    };
  },
  methods: {
    register: function() {
      console.log(this.email);
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((cred) => {
          firebase
            .firestore()
            .collection("users")
            .doc(cred.user.uid)
            .set({
              Email: this.email,
              Rating: 0,
              numRating: 0,
              Name: this.username,
              username: this.username,
              id: cred.user.uid,
              Biography: "",
              BackgroundURL:
                "https://raw.githubusercontent.com/Irislah/bt3103-week-6/main/bcg2.png",
              ProfileURL:
                "https://firebasestorage.googleapis.com/v0/b/bt3103-finalproject.appspot.com/o/default.png?alt=media&token=7117f25c-5744-4816-9a39-68d51ebb2530",
            })
            .then(() => {
              localStorage.setItem("username", this.username);
              localStorage.setItem("email", cred.user.email);
              localStorage.setItem("UID", cred.user.uid);
              localStorage.setItem("login", true);
              this.$router.push("/");
              location.reload();
            });
        })
        .catch((error) => {
          alert(error.message);
          console.error(error);
        });
    },
  },
  components: {},
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>