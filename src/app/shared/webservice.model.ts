export class Webservice {
  id: number;
  title: string;
  description: string;
  type: string;
  url: string;
  parameters: Array<[string, string]>;
  properties: Array<[string, string]>;

  constructor(id: number,
              title: string,
              description: string,
              type: string,
              url: string,
              parameters: Array<[string, string]>,
              properties: Array<[string, string]>) {

    this.id          = id;
    this.title       = title;
    this.description = description;
    this.type        = type;
    this.url         = url;
    this.parameters  = parameters;
    this.properties  = properties;
  }
}
