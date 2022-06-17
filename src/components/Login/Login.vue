
<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="rgb(239, 117, 47)">
                <v-toolbar-title>Login Form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="Email"
                    label="Email"
                    type="text"
                    v-model="email"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="person"
                    name="username"
                    label="username"
                    type="text"
                    v-model="Username"
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
                <div @click="socialLogin" class="other">
                  <img id="icon" src="../../assets/google.png" />
                  <p>Login by Google</p>
                </div>
                <v-btn
                  color="rgb(239, 117, 47)"
                  @click="login"
                  style="margin-left:80px"
                  ><span
                    style="color:white;text-align:center;line-height: 60px;"
                    >Login</span
                  ></v-btn
                >
                <v-btn color="rgb(239, 117, 47)" to="/signUp"
                  ><span
                    style="color:white;text-align:center;line-height: 60px;"
                    >Sign Up</span
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
      Username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    login: function() {
      // Login with email and password
      try {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            console.log(user);
            localStorage.setItem("username", this.username);
            localStorage.setItem("email", this.email);
            localStorage.setItem("UID", user.user.uid);
            localStorage.setItem("login", true);
            this.$router.push("/");
            location.reload();
          });
      } catch (err) {
        alert(err);
      }
    },
    socialLogin: function() {
      // Login wtih socialLogin
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(async (res) => {
            console.log(res);
            await firebase
              .firestore()
              .collection("users")
              .doc(res.user.uid)
              .get()
              .then(async () => {
                console.log(res.user);
                console.log(res.additionalUserInfo.isNewUser == true);
                if (res.additionalUserInfo.isNewUser) {
                  await firebase
                    .firestore()
                    .collection("users")
                    .doc(res.user.uid)
                    .set({
                      Email: res.user.email,
                      Name: res.user.displayName,
                      username: res.user.displayName,