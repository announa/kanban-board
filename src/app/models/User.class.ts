export class User{
 username?: string = '';
 /* password: string = ''; */
 email: string;
 emailVerified: boolean = false;
 uid: string;
 userImages: { filePath: string; downloadUrl: any}[] = [];

 constructor(uid?: string, email?: string){
  this.uid = uid? uid : '';
  this.email = email? email : '';
 }
}