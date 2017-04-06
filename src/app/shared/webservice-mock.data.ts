import {Webservice} from './webservice.model';

export const DATA: Webservice[] = [
  new Webservice(
      0,
      'Weather',
      'Provide weather data, including current weather data, forecast, and historical data',
      'Geographic Coordinates',
      'http://www.goodweather.com/',
      [
        ['zip', 'The zip code of the requested forecast'],
        ['yyyymmddd', 'Date: year/month/day']
      ],
      [
        ['coord', 'object'],
        ['id', 'number'],
        [' name', 'string'],
        ['temp', 'num'],
        ['tempMax', 'number'],
        ['wind ', 'object'],
      ]
  ),

  new Webservice(
      1,
      'Traffic',
      'Provide traffic conditions in real time on major roads and highway',
      'Geographic Coordinates',
      'http://www.traffic.iservice/',
      [
        ['srcAddr', 'Source address, starting address'],
        ['desAddr', 'Destination address'],
        ['time', 'Departure time'],
      ],
      [
        ['id', 'number'],
        ['fullSrc', 'string'],
        ['fullDesc', 'string'],
        ['severity', 'number'],
        ['type', 'number'],
        ['startTime', 'string'],
        ['endTime', 'string'],
        ['eventCode', 'number']
      ]
  )
];
