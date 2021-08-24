
<template>
  <div id="nav" class="fixed" style="margin-bottom: 100px;">
    <!-- <v-navigation-drawer v-model="sidebar" app mobile-break-point="959">
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <v-app-bar app fixed dense shrink>
      <span class="d-none d-sm-flex d-md-none">
        <v-icon @click="sidebar = !sidebar"> </v-icon>
      </span>
      <v-toolbar-title>
        <router-link to="/Home" tag="span" style="cursor: pointer">
          <img src="../assets/logo.png" id="logo" />
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="mdi-microphone"
        class="mx-4 p-4"
        flat
        hide-details
        label="Search"
        prepend-inner-icon="mdi-magnify"
        solo-inverted
        v-model = "searchterm"
        v-on:keyup.enter="toSearch(searchterm)"
      ></v-text-field>
      <v-toolbar-items class="d-sm-none d-md-flex">
        <template v-for="item in menuItems">
          <v-btn
            text
            :key="item.title"
            :to="item.path"
            v-if="item.show"
            @click="item.method"
          >
            <v-icon left dark>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </template>
        <v-btn text v-if="loginState === 'true'" @click="toProfile">
          <v-icon left dark>mdi-account-arrow-right</v-icon>
          Profile
        </v-btn>
        <v-btn text v-if="loginState === 'true'" @click="signOut">
          <v-icon left dark>lock_open</v-icon>
          Sign Out
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      sidebar: false,
      menuItems: [
        { title: "Home", path: "/home", icon: "home", show: true, method: "" },
        { title: "Chat", path: "/chat", icon: "chat", show: true, method: "" },
        {
          title: "Sign Up",
          path: "/signup",
          icon: "face",
          show: true,
          method: "",
        },
        {
          title: "Sign In",
          path: "/login",
          icon: "mdi-account-arrow-right",
          show: true,
          method: "",
        },
      ],
      loginState: false,
      searchterm: '', 
    };
  },
  methods: {
    signOut: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("user sign out");
          localStorage.clear();
          localStorage.setItem("login", false);
          location.reload();
        });
    },
    toProfile: function() {
      this.$router.push({
        path: `/profile`,
        name: "profile",
        params: { user: localStorage.UID },
        props: true,
      });
    },
    toSearch: function(x) {
        console.log("routig"+x); 
        console.log(this.$route.path);
        if (this.$route.path==="/search") {
           this.$router.push({ name: 'blank', params: { searchterm: x }});
        } else {
        this.$router.push({ name: 'search', params: { searchterm: x } }) }
        // this.$router.push({ name: 'search', params: { searchterm: x } }).then(this.$router.push({ name: 'search', params: { searchterm: x } }))
    }
  },
  components: {},
  created() {
    this.loginState = localStorage.getItem("login");
    console.log(localStorage.getItem("login"));
    if (localStorage.getItem("login") == "true") {
      this.menuItems[2].show = false;
      this.menuItems[3].show = false;
      this.menuItems[1].show = true;
    } else {
      this.menuItems[2].show = true;
      this.menuItems[3].show = true;
      this.menuItems[1].show = false;
    }
  },
};
</script>

<style scoped>
#logo {
  width: 130px;
  top: 0px;
  left: 0px;
}
#search {
  position: absolute;
  top: 27px;
  left: 250px;
  border-radius: 20px;
  height: 20px;
  width: 200px;
}

li {
  text-decoration: none;
  list-style: none;
  float: left;
  margin-left: 30px;
  position: relative;
  top: 10px;
  left: 1000px;
}

#nav {
  position: absolute;
  top: 0;
  margin-bottom: 10px;
}

#icon2 {
  width: 40px;
  position: absolute;
  top: 20px;
  left: 460px;
}
</style>