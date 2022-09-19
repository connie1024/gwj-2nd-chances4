<template>
  <div class="window-container" :class="{ 'window-mobile': isDevice }">
    <chat-window
      :height="screenHeight"
      :theme="theme"
      :styles="styles"
      :current-user-id="currentUserId"
      :room-id="roomId"
      :rooms="loadedRooms"
      :loading-rooms="loadingRooms"
      :messages="messages"
      :messages-loaded="messagesLoaded"
      :rooms-loaded="roomsLoaded"
      :room-actions="roomActions"
      :menu-actions="menuActions"
      :room-message="roomMessage"
      @fetch-more-rooms="fetchMoreRooms"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
      @edit-message="editMessage"
      @delete-message="deleteMessage"
      @open-file="openFile"
      @open-user-tag="openUserTag"
      @room-action-handler="menuActionHandler"
      @menu-action-handler="menuActionHandler"
      @send-message-reaction="sendMessageReaction"
      @typing-message="typingMessage"
      @toggle-rooms-list="$emit('show-demo-options', $event.opened)"
    >
    </chat-window>
  </div>
</template>

<script>
import {
  firebase,
  roomsRef,
  messagesRef,
  usersRef,
  filesRef,
  deleteDbField,
  storage,
} from "../../firebase";
import { parseTimestamp, isSameDay } from "../../utils/dates";
import ChatWindow from "vue-advanced-chat";
import "vue-advanced-chat/dist/vue-advanced-chat.css";
// import ChatWindow, { Rooms } from 'vue-advanced-chat'
// import ChatWindow from 'vue-advanced-chat'
// import 'vue-advanced-chat/dist/vue-advanced-chat.css'
// import ChatWindow from './../../dist/vue-advanced-chat.umd.min.js'

export default {
  components: {
    ChatWindow,
  },

  props: ["currentUserId", "theme", "isDevice"],

  data() {
    return {
      roomsPerPage: 15,
      rooms: [],
      roomId: "",
      startRooms: null,
      endRooms: null,
      roomsLoaded: false,
      loadingRooms: true,
      allUsers: [],
      loadingLastMessageByRoom: 0,
      roomsLoadedCount: false,
      selectedRoom: null,
      messagesPerPage: 20,
      messages: [],
      messagesLoaded: false,
      roomMessage: "",
      startMessages: null,
      endMessages: null,
      roomsListeners: [],
      listeners: [],
      typingMessageCache: "",
      disableForm: false,
      addNewRoom: null,
      addRoomUsername: "",
      inviteRoomId: null,
      invitedUsername: "",
      removeRoomId: null,
      removeUserId: "",
      removeUsers: [],
      roomActions: [
        { name: "inviteUser", title: "Invite User" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Room" },
      ],
      menuActions: [
        { name: "inviteUser", title: "Invite User" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Room" },
      ],
      styles: { container: { borderRadius: "4px" } },
      // ,dbRequestCount: 0
    };
  },

  mounted() {
    this.fetchRooms();
    this.updateUserOnlineStatus();
  },

  destroyed() {
    this.resetRooms();
  },

  computed: {
    loadedRooms() {
      return this.rooms.slice(0, this.roomsLoadedCount);
    },
    screenHeight() {
      return this.isDevice ? window.innerHeight + "px" : "calc(100vh - 80px)";
    },
  },

  methods: {
    resetRooms() {
      this.loadingRooms = true;
      this.loadingLastMessageByRoom = 0;
      this.roomsLoadedCount = 0;
      this.rooms = [];
      this.roomsLoaded = true;
      this.startRooms = null;
      this.endRooms = null;
      this.roomsListeners.forEach((listener) => listener());
      this.roomsListeners = [];
      this.resetMessages();
    },

    resetMessages() {
      this.messages = [];
      this.messagesLoaded = false;
      this.startMessages = null;
      this.endMessages = null;
      this.listeners.forEach((listener) => listener());
      this.listeners = [];
    },

    fetchRooms() {
      this.resetRooms();
      this.fetchMoreRooms();
    },

    async fetchMoreRooms() {
      if (this.endRooms && !this.startRooms) return (this.roomsLoaded = true);
      let query = roomsRef
        .where("users", "array-contains", this.currentUserId)
        .orderBy("lastUpdated", "desc")
        .limit(this.roomsPerPage);

      if (this.startRooms) query = query.startAfter(this.startRooms);

      const rooms = await query.get();
      // this.incrementDbCounter('Fetch Rooms', rooms.size)

      this.roomsLoaded = rooms.empty || rooms.size < this.roomsPerPage;

      if (this.startRooms) this.endRooms = this.startRooms;
      this.startRooms = rooms.docs[rooms.docs.length - 1];

      const roomUserIds = [];
      rooms.forEach((room) => {
        r