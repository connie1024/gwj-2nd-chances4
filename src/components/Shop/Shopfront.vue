
<template>
  <div>
    <v-card class="mx-auto" tile>
      <v-img height="200" v-bind:src="background"></v-img>
      <v-row style="margin-left:2.5%;position:absolute; top: 160px">
        <v-list-item>
          <v-list-item-avatar size="100">
            <img v-bind:src="profile" v-bind:alt="name" />
          </v-list-item-avatar>
          <v-list-item-content style="padding-top: 50px; width: 300px">
            <h5>{{ name }}</h5>

            <!-- <v-list-item-title class="title" style="margin-top:20px;">Injamamul Haque Sonet</v-list-item-title>
            <v-list-item-subtitle>Software Engineer | dokanee</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-row>
      <h4 style="padding-top: 70px; text-align: left; padding-left: 50px;">
        About:
      </h4>
      <h4
        style="text-align: left; padding-left: 50px;font-size: 17px; padding-bottom: 40px"
      >
        {{ biography }}
      </h4>
      <h3 style="padding-bottom: 30px">Welcome to {{ name }}'s shop!!</h3>
    </v-card>
    <br /><br />
    <v-tabs
      v-model="tab"
      background-color="orange accent-4"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-on:click="currentTab = 'Listings'">
        Listings
      </v-tab>

      <v-tab v-on:click="currentTab = 'reviews'">
        Reviews
      </v-tab>
    </v-tabs>
    <div v-if="currentTab === 'Listings'">
      <UserListings
        v-bind:user="user"
        v-bind:profile="true"
        v-bind:rating="rating"
        v-bind:numRatings="numRatings"
        v-bind:name="name"
        v-bind:profileURL="profile"
        v-bind:isSameUser="isSameUser"
      ></UserListings>
    </div>
    <div v-if="currentTab === 'reviews'">
      <Reviews v-bind:shopOwner="user"></Reviews>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import UserListings from "../UserPage/UserListings";
import Reviews from "../UserPage/Reviews";

export default {
  props: ["user", "tabs"],
  data() {
    return {
      currentTab: this.tabs,
      name: "",
      email: "",
      profile: "",
      rating: 0,
      biography: "",
      dialog: false,
      background: "",
    };
  },
  components: {
    UserListings,
    Reviews,
  },
  created() {
    if (this.user) {
      localStorage.setItem("lastShopViewed", this.user);
    } else {
      this.user = localStorage.getItem("lastShopViewed");
    }

    // if (this.user === localStorage.getItem("UID")) {
    //   this.$router.push({
    //     path: `/profile`,
    //     name: "profile",
    //     params: { user: localStorage.UID },
    //     props: true,
    //   });
    // }
    console.log(this.user);
    firebase
      .firestore()
      .collection("users")
      .where("id", "==", this.user)
      .get()
      .then((res) => {
        const data = res.docs[0].data();
        this.name = data.Name;
        this.email = data.Email;
        this.profile = data.ProfileURL;
        this.rating = data.Rating;
        this.biography = data.Biography;
        this.background = data.BackgroundURL;
        this.rating = data.Rating;
        this.numRatings = data.numRatings;
        console.log(this.name);
      });
  },
  methods: {
    updateUser: function() {
      console.log(this.biography);
      firebase
        .firestore()
        .collection("users")
        .doc(this.user)
        .update({
          Name: this.name,
          Biography: this.biography,
        });
    },

    toListing: function() {
      this.$router.push({ path: `/newListing`, name: "newListing" });
    },
  },
};
</script>

<style scoped>
#mx-auto {
  position: absolute;
  top: 50px;
}
</style>