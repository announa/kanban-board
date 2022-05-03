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
    private fireService:FirestoreService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userState = user;
        localStorage.setItem('user', JSON.stringify(this.userState));
        let userFromStorage = localStorage.getItem('user');
        if (userFromStorage) {
          const storageUser = JSON.parse(userFromStorage);
        }
      } else {
        localStorage.setItem('user', JSON.stringify(new User()));
        let userFromStorage = localStorage.getItem('user');
        if (userFromStorage) {
          const storageUser = JSON.parse(userFromStorage);
        }
      }
    });
  }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if(result.user != null){
        this.ngZone.run(() => {
          this.router.navigate(['/boards']);
        });
        this.SetUserData(result.user );
      }})
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* this.SendVerificationMail(); */
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u) => {if (u) u.sendEmailVerification()})
      .then(() => {
        this.router.navigate(['email-verification']);
      });
  }

  ForgotPassword(passwordResetEmail: string) {
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

  /*  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  AuthLogin(provider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  } */

  async SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `user/${user.id}`
    );
    const userState: User = await this.fireService.addUser(user)
    /* {
      username: user.username? user.username : '',
      id: user.id,
      email: user.email,
      userImages: user.userImages,
      emailVerified: user.emailVerified,
    }; */
    return userRef.set(userState, {
      merge: true,
    });
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    });
  }
}
