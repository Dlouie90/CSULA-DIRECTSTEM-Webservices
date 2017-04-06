export class Webservice {
  id: number;
  title: string;
  description: string;
  type: string;
  inputs: string[];
  url: string;
  output: object;

  constructor(id: number,
              title: string,
              description: string,
              type: string,
              inputs: string[],
              url?: string,
              output?: object) {

    this.id          = id;
    this.title       = title;
    this.description = description;
    this.type        = type;
    this.inputs      = inputs;
    this.url         = url;
    this.output      = output;
  }

  addInput(input: string) {
    this.inputs.push(input);
  }
}
