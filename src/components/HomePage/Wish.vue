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
                  v-bind:value="x[2