
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
                      Rating: 0,
                      numRating: 0,
                      id: res.user.uid,
                      BackgroundURL:
                        "https://raw.githubusercontent.com/Irislah/bt3103-week-6/main/bcg2.png",
                      ProfileURL: res.user.photoURL,
                    });
                }
                localStorage.setItem("username", res.user.displayName);
                localStorage.setItem("email", res.user.email);
                localStorage.setItem("UID", res.user.uid);
                localStorage.setItem("login", true);
              });
            this.$router.push("/");
            location.reload();
          });
      } catch (error) {
        alert(error.message);
        console.log(error);
      }
    },
  },
  components: {},
};
</script>

<style scoped>
#bg {
  position: fixed;
  width: 1200px;
  left: 0px;
  top: 0px;
  height: 100%;
}
.right {
  position: absolute;
  right: 0px;
  top: -20px;
  height: 120%;
  width: 55%;
}
.welcome {
  position: absolute;
  top: 8px;
  left: 16px;
  color: antiquewhite;
  z-index: 1000;
}
.logo {
  width: 300px;
  position: absolute;
  top: 17%;
  left: 25%;
}
.input1 {
  position: absolute;
  margin: 10px;
  top: 30%;
  left: 25%;
  font-family: inherit;
  width: 250px;
  border: 0;
  border-bottom: 2px solid #9b9b9b;
  outline: 0;
  font-size: 1.3rem;
  color: rgb(193, 183, 183);
  padding: 7px 0;
}
.input2 {
  position: absolute;
  margin: 10px;
  top: 40%;
  left: 25%;
  width: 250px;
  border: 0;
  border-bottom: 2px solid #9b9b9b;
  outline: 0;
  font-size: 1.3rem;
  color: rgb(193, 183, 183);
  padding: 7px 0;
}

.cut {
  position: absolute;
  margin: 10px;
  top: 65%;
  left: 25%;
  width: 250px;
  color: #9b9b9b;
}

.other {
  position: relative;
  font-style: bolder;
  color: rgb(239, 117, 47);
  text-align: center;
}

.but {
  position: absolute;
  margin: 10px;
  top: 52%;
  left: 25%;
  width: 250px;
  height: 40px;
  border: 0px;
  font-weight: 6px;
  color: rgb(249, 249, 249);
  border-radius: 15px;
  background-color: rgba(201, 136, 24, 0.851);
}

#icon {
  position: relative;
  width: 250px;
  height: 40px;
  width: 40px;
}
</style>