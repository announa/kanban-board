export class User{
 username?: string = '';
 email: string;
 emailVerified: boolean = false;
 uid: string;
 userImages: { filePath: string; downloadUrl: any}[] = [];

 constructor(uid?: string, email?: string, verified?: boolean){
  this.uid = uid? uid : '';
  this.email = email? email : '';
  this.emailVerified = verified? verified : false;
 }
}