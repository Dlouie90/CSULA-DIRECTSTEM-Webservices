export class Webservice {
  id: number;
  title: string;
  description: string;
  type: string;


  constructor(id: number, title: string,
              description: string, type: string) {

    this.id          = id;
    this.title       = title;
    this.description = description;
    this.type        = type;
  }
}
