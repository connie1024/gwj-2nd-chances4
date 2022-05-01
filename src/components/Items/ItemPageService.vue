<template>
  <div>
    <br />
    <br />
    <h1 v-for="(x, i) in itemInfo" v-bind:key="i">
      {{ x[1].Title }} for {{ x[1].Type }}
    </h1>
    <v-container>
 