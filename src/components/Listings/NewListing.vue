
<template>
  <b-container
    class="bv-example-row bv-example-row-flex-cols"
    style="padding-top: 100px;"
  >
    <v-card elevation="2" style="padding-bottom: 100px">
      <b-row align-h="center">
        <b-col cols="8">
          <h1>Post your listing</h1>
          <br />
          <div id="commonOptions">
            <!-- <v-radio-group v-model="radioGroup"></v-radio-group> -->
            <h3><strong>1. Choose a listing type</strong></h3>
            <v-select
              :items="type"
              v-model="selectedType"
              label="Listing Type"
              solo
            ></v-select>

            <div v-show="selectedType === 'sale'">
              <h3><strong>--Choose your sub-category</strong></h3>
              <v-select
                :items="subcat_sales"
                label="Sub Category"
                v-model="selectedSubcat"
                solo
              ></v-select>
            </div>

            <div v-show="selectedType === 'rent'">
              <h3><strong>--Choose your sub-category</strong></h3>
              <v-select
                :items="subcat_rent"
                label="Sub Category"
                v-model="selectedSubcat"
                solo
              ></v-select>
            </div>

            <h3><strong>2. Give your listing a title</strong></h3>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                label="Listing Name"
                solo
                type="text"
                id="listingname"
                maxlength="50"
                size="70"
                placeholder="no more than 50 chars"
                v-model="title"
              ></v-text-field>
            </v-col>
            <h3><strong>3. Describe your listing</strong></h3>
            <v-col cols="12" md="12">
              <v-textarea
                solo
                name="input-7-4"
                label="Listing Description"
                type="text"
                rows="6"
                cols="70"
                v-model="desc"
              ></v-textarea>
            </v-col>
            <h3><strong>4. Location where you want to deal</strong></h3>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                label="Location"
                solo
                type="text"
                id="listingloc"
                maxlength="50"
                size="70"
                placeholder="no more than 50 chars"
                v-model="loc"
              ></v-text-field>
            </v-col>
            <h3><strong>5. Upload your pictures:</strong></h3>
            <div v-if="imgcount > 0">
              You can upload more than one photo by clicking on the upload
              button again.
            </div>
            <br />
            <div>
              <div>
                <v-btn
                  @click="click1"
                  color="warning"
                  style="margin-bottom: 20px"
                  >Upload from Computer</v-btn
                >
                <input
                  type="file"
                  ref="input1"
                  style="display: none"
                  @change="previewImage"
                  accept="image/*"
                />
              </div>
              <v-row>
                <div
                  v-for="img in imgurls"
                  :key="img.id"
                  class="d-flex child-flex"
                  cols="4"
                  style="padding: 10px"
                >
                  <template>
                    <h1>{{ img.id }}</h1>
                    <v-hover v-slot="{ hover }">
                      <v-img
                        class="preview grey lighten-2"
                        height="268"
                        aspect-ratio="1"
                        width="356"
                        v-bind:src="img"
                        ><v-expand-transition>
                          <div
                            v-if="hover"
                            class="d-flex transition-fast-in-fast-out red v-card--reveal display-3 white--text"
                            style="height: 100%;"
                            @click="deleteImage(img)"
                          >
                            Delete Image
                          </div>
                        </v-expand-transition>
                      </v-img>
                    </v-hover>
                  </template>
                </div>
              </v-row>
            </div>
          </div>

          <div id="additionalOptions" v-show="selectedType === 'sale'">
            <br /><br />
            <h3><strong>6. Name your price and/or trades</strong></h3>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    label="$"
                    solo
                    type="number"
                    step="1"
                    v-model="price"
                    v-bind="attrs"
                    v-on="on"
                    style="width:100px"
                  ></v-text-field>
                </v-col>
              </template>
              <span
                >Price field is optional if you just want to purely trade for
                another item</span
              >
            </v-tooltip>
            <h4><strong>--or--</strong></h4>
            <br />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    label="Item you want to trade for"
                    solo
                    type="text"
                    maxlength="50"
                    size="70"
                    v-model="alt_trade"
                    v-bind="attrs"
                    v-on="on"
                    placeholder="item you want to trade for"
                  ></v-text-field>
                </v-col>
              </template>
              <span
                >This field is optional if you want a purely monetary
                transaction</span
              >
            </v-tooltip>
            <h3>
              <strong>7. Name your transaction/delivery preferences</strong>
            </h3>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                label="e.g. pick up at mrt, cash only, etc"
                solo
                type="text"
                placeholder="e.g. pick up at mrt, cash only, etc"
                size="70"
                v-model="trans_method"
              ></v-text-field>
            </v-col>
            <v-btn v-on:click="submitListing('sale')" color="warning"
              >Post for Sale</v-btn
            >
          </div>

          <div id="additionalOptions" v-show="selectedType === 'rent'">
            <h3><strong>6. Name your price</strong></h3>
            <br />

            $ <input type="number" step="1" v-model="price" /> per
            <select v-model="interval" required>
              <option
                v-for="x in rent_intervals"
                :key="x.id"
                v-bind:value="x"
                >{{ x }}</option
              >
            </select>
            <h3><strong>7. Name your rules</strong></h3>
            <br />
            <v-col cols="12" md="12">
              <v-textarea
                solo
                name="input-7-4"
                label="Name your rules"
                type="text"
                rows="5"
                cols="70"
                v-model="tnc"
              ></v-textarea> </v-col
            ><br />
            <v-btn v-on:click="submitListing('rent')" color="warning"
              >Post for Rental</v-btn
            >
          </div>

          <div id="additionalOptions" v-show="selectedType === 'wish'">
            <br /><br />
            <v-btn v-on:click="submitListing('wish')" color="warning"
              >Post for Wish</v-btn
            >
          </div>
        </b-col>
      </b-row>
    </v-card>
  </b-container>
</template>

<script>
// import database from '../firebase.js'
import firebase from "firebase";

export default {
  components: {},
  name: "NewListing",
  data() {
    return {
      type: [
        { text: "I am selling/trading an item", value: "sale" },
        { text: "I am renting an item", value: "rent" },
        { text: "I want to add a wish item", value: "wish" },
      ],
      imgcount: 0,
      radioGroup: "",
      listing: {},
      selectedType: "sale",
      selectedSubcat: "Miscellaneous",
      title: "",
      desc: "",
      loc: "",
      price: "",
      alt_trade: "",
      trans_method: "",
      subcat_sales: [
        { text: "Mobile & Electronics", value: "Mobile & Electronics" },
        { text: "Hobbies & Games", value: "Hobbies & Games" },
        { text: "Sports", value: "Sports" },
        { text: "Education", value: "Education" },
        { text: "Fashion", value: "Fashion" },
        { text: "Miscellaneous", value: "Miscellaneous" },
      ],
      subcat_rent: [
        { text: "Automobiles", value: "Automobiles" },
        { text: "Property", value: "Property" },
        { text: "Books", value: "Books" },
        { text: "Games", value: "Games" },
        { text: "Electronics", value: "Electronics" },
        { text: "Miscellaneous", value: "Miscellaneous" },
      ],
      subcat_service: [
        { text: "Housework", value: "Housework" },
        { text: "Education & Child Care", value: "Education & Child Care" },
        {
          text: "Construction & Maintenance",
          value: "Construction & Maintenance",
        },
        { text: "Event Planning", value: "Event Planning" },
        { text: "Travel Agent", value: "Travel Agent" },
        { text: "Miscellaneous", value: "Miscellaneous" },
      ],
      rent_intervals: ["hour", "day", "week", "month", "year"],
      interval: "hour",
      tnc: "",
      img1: "",
      imageData: null,
      imgurls: [],
      user: localStorage.UID,
    };
  },
  methods: {
    deleteImage: function(img) {
      this.imgurls = this.imgurls.filter(function(value) {
        return value != img;
      });
    },
    submitListing: function(x) {
      this.listing["Type"] = this.selectedType;
      this.listing["Subcat"] = this.selectedSubcat;
      this.listing["Title"] = this.title;
      this.listing["Description"] = this.desc;
      this.listing["Location"] = this.loc;
      this.listing["Price"] = this.price;
      this.listing["UserID"] = localStorage.getItem("UID");
      this.listing["images"] = this.imgurls;
      this.listing["date"] = new Date();
      console.log(x);
      console.log("submitting");
      if (x === "sale") {
        var others = {};
        others["Alternatives"] = this.alt_trade;
        others["Transaction method"] = this.trans_method;
        this.listing["sale"] = others;
      } else if (x === "rent") {
        var others2 = {};
        others2["Interval"] = this.interval;
        others2["Terms and Conditions"] = this.tnc;
        this.listing["rent"] = others2;
      } else if (x === "wish") {
        var others3 = {};
        this.listing["wish"] = others3;
      }
      // firebase.database().ref('Listings').push(this.listing).then(
      //     ()=>
      //         {location.reload()});
      if (this.selectedType === "rent" && !this.tnc) {
        alert("One or more required fields is not filled in!");
      }
      if (this.title === "" || this.imgurls.length === 0 || this.desc === "") {
        alert("Please fill in your title/description and upload your images");
      } else {
        firebase
          .firestore()
          .collection("Listings")
          .add(this.listing)
          .then(() => {
            this.$router.push({
              path: `/profile`,
              name: "profile",
              params: { user: localStorage.UID },
              props: true,
            });
          });
        console.log(this.listing);
      }
    },
    // create () {
    //     const post = {
    //         photo: this.img1,
    //         caption: this.caption
    //     }
    //     firebase.database().ref('PhotoGallery').push(post)
    //     .then((response) => {
    //         console.log(response)
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    // },
    click1() {
      this.$refs.input1.click();
    },
    previewImage(event) {
      this.uploadValue = 0;
      this.img1 = null;
      this.imageData = event.target.files[0];
      this.onUpload();
    },
    onUpload() {
      this.img1 = null;
      const storageRef = firebase
        .storage()
        .ref(`${this.user}/Listings` + `/${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.img1 = url;
            this.imgurls.push(this.img1);
            console.log("imgurl array " + this.imgurls);
            this.imgcount++;
          });
        }
      );
      // console.log("ran")
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 50px;
  font-weight: 600;
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
h3 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #e09d20;
  padding-top: 20px;
}
strong {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #e09d20;
  padding-top: 20px;
}
#additionalOptions,
#commonOptions {
  text-align: start;
}
textarea {
  background-color: #fff8e1;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.7;
  position: absolute;
  width: 100%;
}
</style>