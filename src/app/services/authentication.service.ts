import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../models/User.class';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userData: any;
  currentUser: User | undefined;
  currentUser$ = new Subject();

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private fireService: FirestoreService
  ) {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        console.log(user);
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(user));
        const storageUser = localStorage.getItem('user');
        if (storageUser) JSON.parse(storageUser);
        const dbUser = await this.fireService.getCurrentUserFromDB(user.uid);
        this.setCurrentUser(dbUser);
        console.log(this.userData);
      } else {
        localStorage.setItem('user', '');
        const storageUser = localStorage.getItem('user');
        if (storageUser) JSON.parse(storageUser);
        this.setCurrentUser(undefined);
        /* await this.getCurrentUserFromLocalStorage();
        this.setCurrentUser(storageUser) */
      }
    });
    /*     this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        console.log(user);
        this.userData = user;
        this.saveUserToLocalStorage(this.userData);
        await this.getCurrentUserFromLocalStorage();
        console.log(this.userData);
      }
    }); */
  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user != null && result.user.emailVerified) {
          this.ngZone.run(() => {
            this.router.navigate(['/boards']);
          });
          console.log(result.user);
          this.setUserData(result.user);
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

  /*   signInAnonymously() {
    return this.afAuth
      .signInAnonymously()
      .then(() => {
        this.router.navigate(['/boards']);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  } */

  signUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.sendVerificationMail();
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

  async setUserData(user: any) {
    console.log(user);
    await this.fireService.addUser(user);
  }

  signOut() {
    return this.afAuth.signOut().then(async () => {
      localStorage.removeItem('user');
      await this.getCurrentUserFromLocalStorage();
      this.router.navigate(['login']);
    });
  }

  async loggedInAsGuest() {
    let user = new User();
    const storage = localStorage.getItem('user');
    if (storage) {
      user = await JSON.parse(storage);
    }
    if (user.username == 'guest') return true;
    else return false;
  }

  /* ###########  LOCAL STORAGE  ############ */

  saveUserToLocalStorage(object: any) {
    localStorage.setItem('user', JSON.stringify(object));
  }

  async getCurrentUserFromLocalStorage() {
    console.log('getCurrentUserFromLocalStorage');
    const storage = localStorage.getItem('user');
    if (storage) {
      const firebaseUser = await JSON.parse(storage);
      const dbUser = await this.fireService.getCurrentUserFromDB(firebaseUser.uid);
      this.setCurrentUser(dbUser);
    } else {
      this.setCurrentUser(undefined);
    }
  }

  setCurrentUser(user: User | undefined) {
    console.log('setCurrentUser');
    console.log(user);

    this.currentUser = user;
    this.currentUser$.next(this.currentUser);
    this.fireService.currentUser = this.currentUser;
  }

  deleteUser(){
/*     this.afAuth.authState.first().subscribe((authState: any) => { authState.delete(); });
 */  
console.log('delet user account')
}
}
