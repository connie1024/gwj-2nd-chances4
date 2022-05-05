<template>
  <div>
    <br />
    <br />
    <h1 v-for="(x, i) in itemInfo" v-bind:key="i">
      {{ x[1].Title }} for {{ x[1].Type }}
    </h1>
    <v-container>
      <v-row no-gutters>
        <v-col v-for="(x, i) in itemInfo" v-bind:key="i" md="12">
          <v-card color="grey lighten-4">
            <v-card-text>
              <v-row no-gutters>
                <v-col md="6">
                  <v-card color="grey lighten-4">
                    <v-carousel>
                      <v-carousel-item
                        v-for="(item, i) in x[1].images"
                        :key="i"
                        :src="item"
                      ></v-carousel-item>
                    </v-carousel>
                    <!-- <v-img
                      height="600"
                      :width="600"
                      v-bind:src="x[1].images[0]"
                    ></v-img> -->
                  </v-card>
                </v-col>
                <v-col md="6">
                  <v-card color="grey lighten-4">
                    <v-card-actions>
                      <v-list-item class="grow" style="font-weight: 700">
                        <v-list-item-avatar color="grey darken-3">
                          <img v-bind:src="x[5]" class="elevation-6" alt="" />
                        </v-list-item-avatar>
                        {{ x[3] }}
            