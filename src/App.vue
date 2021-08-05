
<template>
  <v-app>
    <head>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css"
        rel="stylesheet"
      />
    </head>

    <div id="app" style="margin: 0px">
      <Header></Header>
      <router-view></router-view>
    </div>
  </v-app>
</template>

<script>
import Header from "./components/Header";
//import Footer from "./components/Footer";

export default {
  name: "App",
  components: {
    Header,
  },
  methods: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>