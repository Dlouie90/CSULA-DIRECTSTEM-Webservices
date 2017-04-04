import {Webservice} from './webservice.model';

export const DATA: Webservice[] = [
  new Webservice(0, 'Weather', 'Provide weather service data', 'weather'),
  new Webservice(1, 'Traffic', 'Provide traffic service report', 'traffic')
];
