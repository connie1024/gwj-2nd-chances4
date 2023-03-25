import Vue from "vue";
import App from "./App.vue";
import Routes from "./routes.js";
import VueRouter from "vue-router";
import Beufy from "buefy";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "buefy/dist/buefy.css";
import firebase from "firebase";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import VueChatScroll from "vue-chat-scroll";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueTimeago from "vue-timeago";

Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(Beufy);
Vue.use(VueChatScroll);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueTimeago, {
  name: "Timeago", // Com