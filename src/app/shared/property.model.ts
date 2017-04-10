/**
 * This class represent a webservice input (parameter)
 * or output (returned value) property. It is used to
 * group the property name, data type, and description
 * together for readability and convenience purposes.
 */
export class Property {
  name: string;
  dataType: string;
  description: string;

  static create(name: string, dataType: string, description: string) {
    return new Property(name, dataType, description);
  }

  constructor(name: string,
              dataType: string,
              description: string) {

    this.name        = name;
    this.dataType    = dataType;
    this.description = description;
  }

}
