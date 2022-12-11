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
        room.data().users.forEach((userId) => {
          const foundUser = this.allUsers.find((user) => user.id === userId);
          if (!foundUser && roomUserIds.indexOf(userId) === -1) {
            roomUserIds.push(userId);
          }
        });
      });

      // this.incrementDbCounter('Fetch Room Users', roomUserIds.length)
      const rawUsers = [];
      roomUserIds.forEach((userId) => {
        const promise = usersRef
          .doc(userId)
          .get()
          .then((user) => user.data());

        rawUsers.push(promise);
      });

      this.allUsers = [...this.allUsers, ...(await Promise.all(rawUsers))];

      const roomList = {};
      rooms.forEach((room) => {
        roomList[room.id] = { ...room.data(), users: [] };
        room.data().users.forEach((userId) => {
          const foundUser = this.allUsers.find((user) => user.id === userId);
          if (foundUser) roomList[room.id].users.push(foundUser);
        });
      });

      const formattedRooms = [];

      Object.keys(roomList).forEach((key) => {
        const room = roomList[key];

        const roomContacts = room.users.filter(
          (user) => user.id !== this.currentUserId
        );
        //console.log(roomContacts[0].ProfileURL);
        room.roomName =
          roomContacts.map((user) => user.username).join(", ") || "Myself";

        const roomAvatar =
          roomContacts.length === 1 && roomContacts[0].ProfileURL
            ? roomContacts[0].ProfileURL
            : require("@/assets/defaultUser.jpg");

        formattedRooms.push({
          ...room,
          roomId: key,
          avatar: roomAvatar,
          index: room.lastUpdated.seconds,
          lastMessage: {
            content: "Room created",
            timestamp: this.formatTimestamp(
              new Date(room.lastUpdated.seconds),
              room.lastUpdated
            ),
          },
        });
      });

      this.rooms = this.rooms.concat(formattedRooms);
      formattedRooms.map((room) => this.listenLastMessage(room));

      if (!this.rooms.length) {
        this.loadingRooms = false;
        this.roomsLoadedCount = 0;
      }

      this.listenUsersOnlineStatus(formattedRooms);
      this.listenRooms(query);
      // setTimeout(() => console.log('TOTAL', this.dbRequestCount), 2000)
    },

    listenLastMessage(room) {
      const listener = messagesRef(room.roomId)
        .orderBy("timestamp", "desc")
        .limit(1)
        .onSnapshot((messages) => {
          // this.incrementDbCounter('Listen Last Room Message', messages.size)
          messages.forEach((message) => {
            const lastMessage = this.formatLastMessage(message.data());
            const roomIndex = this.rooms.findIndex(
              (r) => room.roomId === r.roomId
            );
            this.rooms[roomIndex].lastMessage = lastMessage;
            this.rooms = [...this.rooms];
          });
          if (this.loadingLastMessageByRoom < this.rooms.length) {
            this.loadingLastMessageByRoom++;

            if (this.loadingLastMessageByRoom === this.rooms.length) {
              this.loadingRooms = false;
              this.roomsLoadedCount = this.rooms.length;
            }
          }
        });

      this.roomsListeners.push(listener);
    },

    formatLastMessage(message) {
      if (!message.timestamp) return;

      let content = message.content;
      if (message.file)
        content = `${message.file.name}.${message.file.extension ||
          message.file.type}`;

      return {
        ...message,
        ...{
          content,
          timestamp: this.formatTimestamp(
            new Date(message.timestamp.seconds * 1000),
            message.timestamp
          ),
          distributed: true,
          seen: message.sender_id === this.currentUserId ? message.seen : null,
          new:
            message.sender_id !== this.currentUserId &&
            (!message.seen || !message.seen[this.currentUserId]),
        },
      };
    },

    formatTimestamp(date, timestamp) {
      const timestampFormat = isSameDay(date, new Date())
        ? "HH:mm"
        : "DD/MM/YY";
      const result = parseTimestamp(timestamp, timestampFormat);
      return timestampFormat === "HH:mm" ? `Today, ${result}` : result;
    },

    fetchMessages({ room, options = {} }) {
      this.$emit("show-demo-options", false);

      if (options.reset) this.resetMessages();

      if (this.endMessages && !this.startMessages)
        return (this.messagesLoaded = true);

      let ref = messagesRef(room.roomId);

      let query = ref.orderBy("timestamp", "desc").limit(this.messagesPerPage);

      if (this.startMessages) query = query.startAfter(this.startMessages);

      this.selectedRoom = room.roomId;

      query.get().then((messages) => {
        // this.incrementDbCounter('Fetch Room Messages', messages.size)
        if (this.selectedRoom !== room.roomId) return;

        if (messages.empty) this.