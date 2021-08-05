import firebase from './firebase';
import store from './store';

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    