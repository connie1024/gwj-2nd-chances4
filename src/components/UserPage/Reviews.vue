
<template>
  <b-container
    class="bv-example-row bv-example-row-flex-cols"
    style="padding-top: 50px;"
  >
    <v-card elevation="2" style="padding-bottom: 100px">
      <b-row align-h="center">
        <h1 v-show="allReviews.length == 0" style="padding-top:40px">
          <strong>You currently have no reviews yet!</strong>
        </h1>
        <b-col cols="8" v-show="localUser !== shopOwner">
          <v-col cols="12" md="12">
            <v-avatar color="primary" size="56">
              <img v-bind:src="userProfile" />
            </v-avatar>
            <h3 style="padding-top: 5px">
              <strong>Comment on this seller now!</strong>
            </h3>
          </v-col>
          <v-rating color="orange" v-model="rating"></v-rating>
          <v-col cols="12" md="12">
            <v-textarea
              solo
              name="input-7-4"
              v-model="reviewContent"
              label="Review on this seller"
            ></v-textarea>
            <v-btn color="warning" @click="uploadReview()">
              POST REVIEW
            </v-btn>
          </v-col>
        </b-col>
        <b-col cols="8">
          <v-col>
            <div
              vertical
              v-for="review in allReviews"
              :key="review.id"
              style="margin: 20px"
            >
              <v-card elevation="1" tile>
                <v-card-text>
                  <v-row class="mb-4" align="center">
                    <v-list-item-avatar style="margin-left: 20px">
                      <img
                        v-bind:src="review.reviewerProfile"
                        class="elevation-6"
                        alt=""
                      />
                    </v-list-item-avatar>

                    <strong class="title" style="padding-top: 30px">{{
                      review.reviewerName
                    }}</strong>

                    <v-spacer></v-spacer>
                  </v-row>
                  <timeago
                    :datetime="review.date.toDate()"
                    :auto-update="60"
                    style="padding-right: 20px"
                  ></timeago>
                  <v-rating
                    color="orange"
                    v-bind:value="review.rating"
                    size="15"
                    style="text-align:start"
                  ></v-rating>
                  <p style="text-align:start">{{ review.reviewContent }}</p>
                  <div style="text-align:start;">
                    <v-btn
                      class="ma-2"
                      text
                      icon
                      color="blue lighten-2"
                      @click="likeReview(review)"
                      v-bind:disabled="review.disabledlikes"
                    >
                      <v-badge color="blue" v-bind:content="review.likes"
                        ><v-icon>mdi-thumb-up</v-icon>
                      </v-badge></v-btn
                    >

                    <v-btn
                      class="ma-2"
                      text
                      icon
                      color="red lighten-2"
                      @click="dislikeReview(review)"
                      v-bind:disabled="review.disabledislikes"
                    >
                      <v-badge color="red" v-bind:content="review.dislikes"
                        ><v-icon>mdi-thumb-down</v-icon>
                      </v-badge></v-btn
                    >
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </b-col>
      </b-row>
    </v-card>
  </b-container>
</template>
<script>
import firebase from "firebase";

export default {
  props: ["shopOwner"],
  data() {
    return {
      date: new Date(),
      userProfile: "",
      reviewContent: "",
      localUser: localStorage.UID,
      localUserName: localStorage.username,
      rating: 0,
      allReviews: [],
    };
  },
  setup() {},
  methods: {
    likeReview: function(review) {
      if (review.likedorDisliked == false) {
        review.likes++;
        firebase
          .firestore()
          .collection("users")
          .doc(this.shopOwner)
          .collection("Reviews")
          .doc(review.reviewId)
          .update({
            likes: firebase.firestore.FieldValue.increment(1),
          });
        review.likedorDisliked = true;
      } else if (review.likedorDisliked == true) {
        review.likes--;
        firebase
          .firestore()
          .collection("users")
          .doc(this.shopOwner)
          .collection("Reviews")
          .doc(review.reviewId)
          .update({
            likes: firebase.firestore.FieldValue.increment(-1),
          });
        review.likedorDisliked = false;
      }
      review.disabledislikes = !review.disabledislikes;
    },
    dislikeReview: function(review) {
      if (review.likedorDisliked == false) {
        review.dislikes++;
        firebase
          .firestore()
          .collection("users")
          .doc(this.shopOwner)
          .collection("Reviews")
          .doc(review.reviewId)
          .update({
            dislikes: firebase.firestore.FieldValue.increment(1),
          });
        review.likedorDisliked = true;
      } else if (review.likedorDisliked == true) {
        review.dislikes--;
        firebase
          .firestore()
          .collection("users")
          .doc(this.shopOwner)
          .collection("Reviews")
          .doc(review.reviewId)
          .update({
            dislikes: firebase.firestore.FieldValue.increment(-1),
          });
        review.likedorDisliked = false;
      }
      review.disabledlikes = !review.disabledlikes;
    },
    getAvatar: function() {
      firebase
        .firestore()
        .collection("users")
        .doc(this.localUser)
        .get()
        .then((res) => {
          this.userProfile = res.data().ProfileURL;
        });
    },
    uploadReview: function() {
      let newReview = {
        date: new Date(),
        reviewerId: this.localUser,
        reviewerName: this.localUserName,
        reviewContent: this.reviewContent,
        reviewerProfile: this.userProfile,
        likes: 0,
        dislikes: 0,
        rating: this.rating,
      };
      firebase
        .firestore()
        .collection("users")
        .doc(this.shopOwner)
        .collection("Reviews")
        .add(newReview)
        .then(() => {
          firebase
            .firestore()
            .collection("users")
            .doc(this.shopOwner)
            .update({
              Rating: firebase.firestore.FieldValue.increment(this.rating),
              numRatings: firebase.firestore.FieldValue.increment(1),
            });
          this.getAllReviews();
        });
    },
    getAllReviews: function() {
      this.allReviews = [];
      firebase
        .firestore()
        .collection("users")
        .doc(this.shopOwner)
        .collection("Reviews")
        .orderBy("date", "desc")
        .get()
        .then((res) => {
          res.forEach((doc) => {
            let data = doc.data();
            let review = {
              date: data.date,
              reviewId: doc.id,
              reviewerId: data.reviewerId,
              reviewContent: data.reviewContent,
              reviewerProfile: data.reviewerProfile,
              reviewerName: data.reviewerName,
              rating: data.rating,
              likes: data.likes,
              dislikes: data.dislikes,
              likedorDisliked: false,
              disablelikes: false,
              disabledislikes: false,
            };
            console.log(data);
            this.allReviews.push(review);
          });
        });
    },
  },
  created() {
    this.getAvatar();
    this.getAllReviews();
  },
};
</script>
<style scoped></style>