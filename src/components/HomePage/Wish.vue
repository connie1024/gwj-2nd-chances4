<template>
  <div>
    <br />
    <div class="flex" style="margin-left:40px; margin-right:40px;">
      <div class="flex">
        <v-row style="">
          <v-col
            v-for="(x, i) in items"
            v-bind:key="i"
            col="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card :loading="false" class="mx-auto my-12" max-width="374">
              <v-card-actions>
                <v-list-item class="grow" style="font-weight: 700">
                  <v-list-item-avatar
                    color="grey darken-3"
                    @click="goToShopFront(x[6])"
                  >
                    <img v-bind:src="x[5]" class="elevation-6" alt="" />
                  </v-list-item-avatar>
                  {{ x[3] }}
                </v-list-item>
              </v-card-actions>

              <v-row
                align="center"
                class="mx-0"
                style="margin-bottom: 10px; padding-left: 20px;"
              >
                <v-rating
                  v-bind:value="x[2]"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
                ></v-rating>

                <div class="grey--text ml-4">
                  {{ x[2] }} ({{ x[4] }} reviews)
                </div>
              </v-row>
              <template slot="progress">
                <v-progress-linear
                  color="deep-purple"
                  height="10"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-img height="250" v-bind:src="x[1].images[0]"></v-img>

              <v-card-title>Wish: {{ x[1]["Title"] }}</v-card-title>

              <v-card-text>
                <div class="my-2 subtitle-1">
                  <strong>Description</strong>
                  <p>{{ x[1]["Description"] }}</p>
                </div>

                <div class="my-2 subtitle-1">
                  <strong>Location</strong>
                  <p>{{ x[1]["Location"] }}</p>
                </div>

                <div class="my-2">
                  <strong>TimeListed:</strong>
                  <timeago
                    :datetime="x[1]['date'].toDate()"
                    :auto-update="60"
                    style="padding-left: 5px; font-weight: 100; font-size: 15px"
                  ></timeago>
                </div>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>
              <v-card-actions>
                <v-btn
                  color="orange darken-2"
                  text
                  @click="contactOwner(x[6], x[1])"
                >
                  Contact
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
// import firebase from 'firebase'
import firebase from "firebase";
import { roomsRef } from "../../firebase";

export default {
  data() {
    return {
      items: [],
      profiles: [],
      subcats: [
        "Mobile & Electronics",
        "Hobbies & Games",
        "Sports",
        "Education",
        "Fashion",
        "Miscellaneous",
      ],
      rating: 0,
      name: "",
      numRatings: 0,
      profileURL: "",
      user: localStorage.UID,
      date: new Date(),
    };
  },
  methods: {
    toListing: function() {
      this.$router.push({ path: `/newListing`, name: "newListing" });
    },
    fetchItems: function() {
      // database.collection('Listings').get()
      // firebase.firestore().collection('Listings').get()
      this.items = [];
      firebase
        .firestore()
        .collection("Listings")
        .where("Type", "==", "wish")
        .orderBy("date", "desc")
        .get()
        .then((querySnapShot) => {
          querySnapShot.forEach(async (doc) => {
            let item = doc.data();
            //console.log(item.UserID);
            await firebase
              .firestore()
              .collection("users")
              .where("id", "==", item.UserID)
              .get()
              .then((res) => {
                if (res.docs[0].data().numRatings == 0) {
                  this.rating = 0;
                } else {
                  this.rating = (
                    res.docs[0].data().Rating / res.docs[0].data().numRatings
                  ).toFixed(2);
                }

                this.name = res.docs[0].data().Name;
                this.numRating = res.docs[0].data().numRatings;
                this.profileURL = res.docs[0].data().ProfileURL;
                this.items.push([
                  doc.id,
                  item,
                  this.rating,
                  this.name,
                  this.numRating,
                  this.profileURL,
                  item.UserID,
                ]);
              });
          });
        });
      console.log(this.items);
      this.items.forEach((x) => {
        firebase
          .firestore()
          .collection("User")
          .doc(x[0])
          .get()
          .then((x) => {
            this.profiles.push(x);
          });
      });
    },
    contactOwner: async function(ownerId, item) {
      if (ownerId == this.user) {
        return alert("this is your own store!");
      }
      //const chatRoomUsers = [ownerId, this.user];
      const query1 = await roomsRef
        .where("users", "==", [ownerId, this.user])
        .get();

      if (!query1.empty) {
        roomsRef
          .where("users", "==", [ownerId, this.user])
          .get()
          .then(async (res) => {
            await roomsRef
              .doc(res.docs[0].id)
              .collection("messages")
              .add({
                content:
                  "I am able to offer " +
                  item.Title +
                  "\n" +
                  "Type: " +
                  item.Type +
                  "\n" +
                  "Subcat: " +
                  item.Subcat +
                  "\n" +
                  "Location: " +
                  item.Location,
                file: {
                  extension: "png",
                  name: item.Title,
                  type: "image/png",
                  url: item.images[0],
                },
                sender_id: this.user,
                timestamp: new Date(),
              });
          });
        return this.$router.push({ path: `/chat` });
      }

      let query2 = await roomsRef
        .where("users", "==", [this.user, ownerId])
        .get();

      if (!query2.empty) {
        console.log("hello");
        roomsRef
          .where("users", "==", [this.user, ownerId])
          .get()
          .then(async (res) => {
            console.log(res.docs[0].id);
            await roomsRef
              .doc(res.docs[0].id)
              .collection("messages")
              .add({
                content:
                  "I am able to offer " +
                  item.Title +
                  "\n" +
                  "Type: " +
                  item.Type +
                  "\n" +
                  "Subcat: " +
                  item.Subcat +
                  "\n" +
                  "Location: " +
                  item.Location,
                file: {
                  extension: "png",
                  name: item.Title,
                  type: "image/png",
                  url: item.images[0],
                },
                sender_id: this.user,
                timestamp: new Date(),
              });
          });
        console.log(query2.docs);
        return this.$router.push({ path: `/chat` });
      }
      roomsRef
        .add({
          users: [ownerId, this.user],
          lastUpdated: new Date(),
        })
        .then((res) => {
          roomsRef
            .where("users", "==", [this.user, ownerId])
            .get()
            .then(async () => {
              await roomsRef
       