export class User{
 username!: string;
 password!: string;
 id!: string;
 userImages: { filePath: string; downloadUrl: any}[] = [];
}