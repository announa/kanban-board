import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '../models/User.class';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  newUser = new User();

  @ViewChild('modal') modal!: ElementRef;
  width = 0;

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

  /*  aync login(form){
   this.auth.signInWithEmailAndPassword(form.value.email), form.value.password.then().catch(error)
 } */

  /* async register(form: any) { */
  /*     this.auth.createUserWithEmailAndPassword(form.value.email, form.value.password)
    .then(result =>{
      
    }) */
  async register() {
    this.fireService.checkUsers(this.newUser.username, this.newUser.password);
    let id = await this.fireService.addUser(this.newUser);
    this.router.navigateByUrl('/' + id + '/boards');
  }
}
