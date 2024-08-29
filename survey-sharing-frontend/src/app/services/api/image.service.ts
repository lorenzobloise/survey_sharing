import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ResponseMessage } from "../../support/response-message";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private path = 'images';

  constructor(@Inject('BASE_URL') private BASE_URL: string, private http: HttpClient){}

  // POST

  public uploadImage(image: number[], fileName: string){
    return this.http.post<ResponseMessage>(this.BASE_URL+this.path+'?fileName='+fileName, image);
  }

  // GET

  public findImageById(imageId: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'?imageId='+imageId);
  }

}
