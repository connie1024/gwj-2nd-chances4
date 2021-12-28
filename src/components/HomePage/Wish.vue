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
                  <v-list