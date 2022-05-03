import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/User.class';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  newUser = {email: '', password: ''};
  passwordConfirmation!: string;
  alert = '';
  existingUser!: User;

  @ViewChild('modal') modal!: ElementRef;

  constructor(
    public fireService: FirestoreService,
    private router: Router,
    public authService: AuthenticationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    /*    this.auth.onAuthStateChanged() */
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  hideAlert() {
    this.alert = '';
  }

  register(){
    if (this.passwordCheck() === true) {

    this.authService.SignUp(this.newUser.email, this.newUser.password)
  }
  }

  passwordCheck() {
    return this.newUser.password === this.passwordConfirmation;
  }

  /*  aync login(form){
   this.auth.signInWithEmailAndPassword(form.value.email), form.value.password.then().catch(error)
 } */

  /* async register(form: any) { */
  /*     this.auth.createUserWithEmailAndPassword(form.value.email, form.value.password)
    .then(result =>{
      
    }) */
  /* async register() {
    await this.getExistingUsers();
    if (this.usernameCheck() === false) {
      if (this.passwordCheck() === true) {
        await this.fireService.addUser(this.newUser);
        this.router.navigateByUrl('/boards');
      } else {
        this.showAlert('pw-alert')
        this.fireService.isProcessing = false;
      }
    } else {
      this.showAlert('username-alert')
      this.fireService.isProcessing = false;
    }
  }

  async getExistingUsers() {
    this.existingUser = this.fireService.checkForExistingUser(
      this.newUser.username
    )[0];
  }

  usernameCheck(){
    if (this.existingUser) {
      return true;
    } else return false;
  }

  showAlert(type: string){
    if(type == 'pw-alert'){
      this.alert =
      'You typed in two different passwords. The password and the password confirmation must be the same combination of characters.';
    } else{
      this.alert = 'Username already exists. Please choose another username.';
    }
  }
  */
}