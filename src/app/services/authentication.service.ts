import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../models/User.class';
import { FirestoreService } from './firestore.service';
import { ThisReceiver } from '@angular/compiler';
import { FirebaseApp } from '@angular/fire/app';

/* export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
} */

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userState: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private fireService: FirestoreService
  ) {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        this.userState = user;
        this.fireService.saveUserToLocalStorage(this.userState);
        await this.fireService.getCurrentUserFromLocalStorage();
      }
    });
  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user != null) {
          this.ngZone.run(() => {
            this.router.navigate(['/boards']);
          });
          /* this.SetUserData(result.user ); */
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  signInAnonymously() {
    return this.afAuth
      .signInAnonymously()
      .then(() => {
        this.router.navigate(['/boards']);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  signUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.router.navigate(['/boards']);
        /* this.SendVerificationMail(); */
        this.setUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  sendVerificationMail() {
    return this.afAuth.currentUser
      .then((u) => {
        if (u) u.sendEmailVerification();
      })
      .then(() => {
        this.router.navigate(['email-verification']);
      });
  }

  resetPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  get isLoggedIn(): boolean {
    let user = localStorage.getItem('user');
    if (user) {
      const storageUser = JSON.parse(user);
      return storageUser !== null && storageUser.emailVerified !== false
        ? true
        : false;
    } else return false;
  }

  async setUserData(user: any) {
    await this.fireService.addUser(user);
  }

  signOut() {
    return this.afAuth.signOut().then(async () => {
      localStorage.removeItem('user');
      await this.fireService.getCurrentUserFromLocalStorage();
      this.router.navigate(['/']);
    });
  }
}
