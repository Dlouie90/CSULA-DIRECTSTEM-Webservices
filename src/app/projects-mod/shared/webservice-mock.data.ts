import {Webservice} from './webservice.model';

export const DATA: Webservice[] = [
  new Webservice(
      0,
      'Weather',
      'Provide weather data, including current weather data, forecast, and historical data',
      'Geographic Coordinates'),

  new Webservice(
      1,
      'Traffic',
      'Provide traffic conditions in real time on major roads and highway',
      'Geographic Coordinates')
];
