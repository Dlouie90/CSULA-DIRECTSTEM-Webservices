export class Webservice {
  id: number;
  title: string;
  description: string;
  type: string;
  domain: string;
  path: string;
  parameters: Array<[string, string]>;
  properties: Array<[string, string, string]>;

  compositions: number;

  constructor(id: number,
              title: string,
              description: string,
              type: string,
              domain: string,
              path: string,
              parameters: Array<[string, string]>,
              properties: Array<[string, string, string]>) {

    this.id          = id;
    this.title       = title;
    this.description = description;
    this.type        = type;
    this.domain      = domain;
    this.path        = path;
    this.parameters  = parameters;
    this.properties  = properties;


    this.compositions = 0;
  }
}
