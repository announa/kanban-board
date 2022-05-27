export class User{
 username?: string = '';
 email: string;
 emailVerified: boolean = false;
 uid: string;
 userImages: { filePath: string; downloadUrl: any}[] = [];
 timestamp!: number;

 constructor(uid: string, username: string, email: string, verified: boolean){
  this.uid = uid;
  this.username = username;
  this.email = email;
  this.emailVerified = verified;
  this.timestamp = Date.now()
  console.log(this)
 }
}