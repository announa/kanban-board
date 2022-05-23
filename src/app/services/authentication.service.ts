import { HttpClient } from '@angular/common/http';
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

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private fireService: FirestoreService
  ) {
    console.log(this.afAuth.currentUser);

    this.afAuth.authState.subscribe(async (user: any) => {
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
    } else{
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
      });
  }

  signInAnonymously() {
    return this.afAuth
      .signInAnonymously()
      .then((userCredentials) => {
        this.setUserDataInDb(userCredentials.user);
        this.router.navigate(['/boards']);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  signUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        this.sendVerificationMail();
        this.setUserDataInDb(userCredentials.user);
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

  async setUserDataInDb(user: any) {
    await this.fireService.addUser(user);
    this.fireService.createExampleData(user.uid);
  }

  signOut() {
    return this.afAuth.signOut().then(async () => {
      this.router.navigate(['login']);
    });
  }

  /* ###########  LOCAL STORAGE  ############ */

  saveUserToLocalStorage(object: any) {
    localStorage.setItem('user', JSON.stringify(object));
  }

  async getCurrentUserFromLocalStorage() {
    console.log('getCurrentUserFromLocalStorage');
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
    console.log('setCurrentUser');
    console.log(user);

    this.fireService.currentUser = user;
    this.fireService.currentUser$.next(this.fireService.currentUser);
  }

  async deleteUser() {
    /*     if(await this.afAuth.currentUser != null){
    (await this.afAuth.currentUser).delete} */
    /*     this.afAuth.authState.first().subscribe((authState: any) => { authState.delete(); });
     */
    console.log(this.afAuth.currentUser);
  }
}
