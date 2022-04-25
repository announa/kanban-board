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
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  newUser = new User();
  passwordConfirmation!: string;
  width = 0;
  alert='';

  @ViewChild('modal') modal!: ElementRef;

  constructor(
    private fireService: FirestoreService,
    private router: Router,
    private auth: AngularFireAuth,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    /*    this.auth.onAuthStateChanged() */
  }

  ngAfterViewInit() {
    this.width = this.modal.nativeElement.clientWidth;
    this.cd.detectChanges();
  }

  hideAlert(){
    this.alert = '';
  }

  /*  aync login(form){
   this.auth.signInWithEmailAndPassword(form.value.email), form.value.password.then().catch(error)
 } */

  /* async register(form: any) { */
  /*     this.auth.createUserWithEmailAndPassword(form.value.email, form.value.password)
    .then(result =>{
      
    }) */
  async register() {
    let userCheck = await this.checkIfUserExists();
    if(userCheck === false){
      if(this.passwordCheck() === true){
        await this.fireService.addUser(this.newUser);
        this.router.navigateByUrl('/boards');
      } else{
        this.alert = 'You typed in two different passwords. The password and the password confirmation must be the same combination of characters.';
        this.fireService.isProcessing = false;
      }
    } else{
      this.alert = 'Username already exists. Please choose another username.';
      this.fireService.isProcessing = false;
    }
  }

  passwordCheck(){
    console.log(this.newUser.password === this.passwordConfirmation)
    return this.newUser.password === this.passwordConfirmation
  }
  
  async checkIfUserExists(){
    let existingUser = await firstValueFrom(this.fireService.checkForExistingUser(this.newUser.username));
    if(existingUser.length == 0){
      return false;
    } else
    return true;
  }
}
