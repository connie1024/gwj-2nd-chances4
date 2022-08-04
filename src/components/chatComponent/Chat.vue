
<template>
  <div>
    <div
      class="app-container"
      :class="{ 'app-mobile': isDevice, 'app-mobile-dark': theme === 'dark' }"
    >
      <!-- <div>
				<button @click="resetData">Clear Data</button>
				<button @click="addData" :disabled="updatingData">Add Data</button>
			</div> -->
      <span
        class="user-logged"
        :class="{ 'user-logged-dark': theme === 'dark' }"
        v-if="showOptions"
      >
      </span>

      <chat-container
        :currentUserId="currentUserId"
        :theme="theme"
        :isDevice="isDevice"
        @show-demo-options="showDemoOptions = $event"
        v-if="showChat"
      />
      <!-- 
      <div class="button-theme" v-if="showOptions" style="margin-top: 20px;">
        <button @click="theme = 'light'" class="button-light">Light</button>
        <button @click="theme = 'dark'" class="button-dark">Dark</button>
      </div> -->

      <!-- <div class="version-container">
				v1.0.0
			</div> -->
    </div>
  </div>
</template>

<script>
import { roomsRef, usersRef } from "../../firebase";
import ChatContainer from "./ChatContainer";

export default {
  components: {
    ChatContainer,
  },

  data() {
    return {
      theme: "light",
      showChat: true,
      currentUserId: localStorage.UID,
      isDevice: false,
      showDemoOptions: true,
      updatingData: false,
    };
  },

  mounted() {
    this.isDevice = window.innerWidth < 500;
    window.addEventListener("resize", (ev) => {
      if (ev.isTrusted) this.isDevice = window.innerWidth < 500;
    });
  },

  watch: {
    currentUserId() {
      this.showChat = false;
      setTimeout(() => (this.showChat = true), 150);
    },
  },

  computed: {
    showOptions() {
      return !this.isDevice || this.showDemoOptions;
    },
  },

  methods: {
    resetData() {
      roomsRef.get().then((val) => {
        val.forEach(async (val) => {
          const ref = roomsRef.doc(val.id).collection("messages");

          await ref.get().then((res) => {
            if (res.empty) return;
            res.docs.map((doc) => ref.doc(doc.id).delete());
          });

          roomsRef.doc(val.id).delete();
        });
      });

      usersRef.get().then((val) => {
        val.forEach((val) => {
          usersRef.doc(val.id).delete();
        });
      });
    },
    async addData() {
      this.updatingData = true;

      const user1 = this.users[0];
      await usersRef.doc(user1._id).set(user1);

      const user2 = this.users[1];
      await usersRef.doc(user2._id).set(user2);

      const user3 = this.users[2];
      await usersRef.doc(user3._id).set(user3);

      await roomsRef.add({
        users: [user1._id, user2._id],
        lastUpdated: new Date(),
      });
      await roomsRef.add({
        users: [user1._id, user3._id],
        lastUpdated: new Date(),
      });
      await roomsRef.add({
        users: [user2._id, user3._id],
        lastUpdated: new Date(),
      });
      await roomsRef.add({
        users: [user1._id, user2._id, user3._id],
        lastUpdated: new Date(),
      });

      this.updatingData = false;
    },
  },
};
</script>

<style scoped>
body {
  background: #fafafa;
  margin: 0;
}
input {
  -webkit-appearance: none;
}
.app-container {
  font-family: "Quicksand", sans-serif;
  padding: 30px 20px 30px;
}
.app-mobile {
  padding-top: 50px;
}
.app-mobile.app-mobile-dark {
  background: #131415;
}
.app-mobile .user-logged {
  margin: 10px 5px 0 10px;
}
.app-mobile select {
  margin: 10px 0;
}
.app-mobile .button-theme {
  margin: 10px 10px 0 0;
}
.app-mobile .button-theme .button-github {
  height: 23px;
}
.app-mobile .button-theme .button-github img {
  height: 23px;
}
.user-logged {
  font-size: 12px;
  margin-right: 5px;
  margin-top: 10px;
}
.user-logged.user-logged-dark {
  color: #fff;
}
select {
  height: 20px;
  outline: none;
  border: 1px solid #e0e2e4;
  border-radius: 4px;
  background: #fff;
  margin-bottom: 20px;
}
.button-theme {
  float: right;
  display: flex;
  align-items: center;
}
.button-theme .button-light {
  background: #fff;
  border: 1px solid #46484e;
  color: #46484e;
}
.button-theme .button-dark {
  background: #1c1d21;
  border: 1px solid #1c1d21;
}
.button-theme button {
  color: #fff;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 6px 12px;
  margin-left: 10px;
  border: none;
  font-size: 14px;
  transition: 0.3s;
  vertical-align: middle;
}
.button-theme button.button-github {
  height: 30px;
  background: none;
  padding: 0;
  margin-left: 20px;
}
.button-theme button.button-github img {
  height: 30px;
}
.button-theme button:hover {
  opacity: 0.8;
}
.button-theme button:active {
  opacity: 0.6;
}
@media only screen and (max-width: 768px) {
  .button-theme button {
    padding: 3px 6px;
    font-size: 13px;
  }
}
.version-container {
  padding-top: 20px;
  text-align: right;
  font-size: 14px;
  color: grey;
}
</style>