export class User{
 username?: string = '';
 /* password: string = ''; */
 email: string = '';
 emailVerified: boolean = false;
 id: string = '';
 userImages: { filePath: string; downloadUrl: any}[] = [];
}