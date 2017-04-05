import {Webservice} from './webservice.model';

export const DATA: Webservice[] = [
  new Webservice(
      0,
      'Weather',
      'Provide weather data, including current weather data, forecast, and historical data',
      'Geographic Coordinates',
      ['Zip Code', 'Date'],
      {
        coord  : 'object',
        id     : 'number',
        name   : 'string',
        temp   : 'num',
        tempMax: 'number',
        wind   : 'object',
      }
  ),

  new Webservice(
      1,
      'Traffic',
      'Provide traffic conditions in real time on major roads and highway',
      'Geographic Coordinates',
      ['Starting Address', 'Destination Address', 'Departure Time'],
      {

        id       : 'number',
        fullSrc  : 'string',
        fullDesc : 'string',
        severity : 'number',
        type     : 'number',
        startTime: 'string',
        endTime  : 'string',
        eventCode: 'number',
      }
  )
];
