
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