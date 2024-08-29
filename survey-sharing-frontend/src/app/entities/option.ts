export class Option{
  id!: string;
  option!: string;
  selected!: boolean;

  constructor(option: string){
    this.option = option;
    this.selected = false;
  }
}
