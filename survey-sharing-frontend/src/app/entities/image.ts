export class Image {

  id!: string;
  image!: number[];
  fileName!: string;

  constructor(image: number[], fileName: string){
    this.image = image;
    this.fileName = fileName;
  }

}
