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
           