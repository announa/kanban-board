import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../models/User.class';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userData: any;
  currentUser: any = undefined;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private fireService: FirestoreService
  ) {
    this.afAuth.authState.subscribe(async (user: any) => {
      this.currentUser = user;
      if (user != null) {
        this.setUserData(user);
      } else if (user == null) {
        this.setUserData(null);
      }
    });
  }

  async setUserData(user: any) {
    this.userData = user;
    if (user != null) {
      localStorage.setItem('user', JSON.stringify(user));
      const dbUser = await this.fireService.getCurrentUserFromDB(user.uid);
      this.setCurrentUser(dbUser);
    } else {
      localStorage.removeItem('user');
      this.setCurrentUser(null);
    }
  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user != null && result.user.emailVerified) {
          this.ngZone.run(() => {
            this.router.navigate(['/boards']);
          });
        } else if (result.user != null && !result.user.emailVerified) {
          this.ngZone.run(() => {
            this.router.navigate(['/verify']);
          });
        }
      })
      .catch((error) => {
        window.alert(error.message);
        this.fireService.isProcessing = false;
      });
  }

  signInAnonymously() {
    return this.afAuth
      .signInAnonymously()
      .then(async (userCredentials) => {
        await this.setUserDataInDb(userCredentials.user, 'Guest');
        this.router.navigate(['/boards']);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  signUp(registerData: any) {
    return this.afAuth
      .createUserWithEmailAndPassword(registerData.email, registerData.password)
      .then((userCredentials) => {
        this.sendVerificationMail();
        this.setUserDataInDb(userCredentials.user, registerData.username);
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
        this.router.navigate(['/verify']);
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

  setUserDataInDb(user: any, username: string) {
    return new Promise(async (resolve, reject) => {
      user.username = username;
      await this.fireService.addUser(user);
      await this.fireService.createDummyData(user.uid);
      resolve('data added'), (err: any) => reject(err);
    });
  }

  signOut() {
    return this.afAuth.signOut().then(async () => {
      this.router.navigate(['login']);
    });
  }

  async deleteUser() {
    this.fireService.isProcessing = true;
    if (this.currentUser) {
      await this.currentUser.delete();
      this.router.navigateByUrl('/login');
    }
  }

  /* ###########  LOCAL STORAGE  ############ */

  saveUserToLocalStorage(object: any) {
    localStorage.setItem('user', JSON.stringify(object));
  }

  async getCurrentUserFromLocalStorage() {
    const storage = localStorage.getItem('user');
    if (storage) {
      const storageUser = await JSON.parse(storage);
      const dbUser = await this.fireService.getCurrentUserFromDB(
        storageUser.uid
      );
      this.setCurrentUser(dbUser);
    } else {
      this.setCurrentUser(null);
    }
  }

  setCurrentUser(user: User | null) {
    this.fireService.currentUser = user;
    this.fireService.currentUser$.next(this.fireService.currentUser);
  }
}
