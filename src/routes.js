// Import the components you want to define routes for.
import NewListing from "./components/Listings/NewListing.vue";
import Login from "./components/Login/Login.vue";
import SignUp from "./components/Login/SignUp.vue";
import Sales from "./components/HomePage/Sales.vue";
import Wish from "./components/HomePage/Wish.vue";
import Home from "./components/HomePage/Home.vue";
import Chat from "./components/chatComponent/Chat.vue";
import UserListings from "./components/UserPage/UserListings.vue";
import Profile from "./components/UserPage/Profile.vue";
import ItemPage from "./components/Items/ItemPage.vue";
import Shopfront from "./components/Shop/Shopfront.vue";
import EditListing from "./components/UserPage/EditListing.vue";
import Search from "./components/HomePage/Search.vue";
import Blank from "./components/HomePage/Blank.vue";
import ItemPageRent from "./components/Items/ItemPageRent.vue";
import ItemPageService from "./components/Items/ItemPageService.vue";
import ItemPageCompleted from "./components/Items/ItemPageCompleted.vue";

export default [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/home", component: Home },
  {
    path: "/newListing",
    name: "newListing",
    component: NewListing,
    meta: { requiresAuth: true },
  },
  {
    path: "/myListings",
    name: "myListings",
    component: UserListings,
    meta: { requiresAuth: true },
  },
  { path: "/Signup", name: "signUp", component: SignUp },
  { path: "/sales", name: "sales