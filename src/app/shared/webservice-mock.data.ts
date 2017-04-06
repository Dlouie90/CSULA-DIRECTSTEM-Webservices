import {Webservice} from './webservice.model';

export const DATA: Webservice[] = [
  new Webservice(
      0,
      'SUMMONER-V1.4',
      'Get a list of summoners by accounts id',
      'SummonerDto',
      'https://developer.riotgames.com',
      '/api/lol/{region}/v1.4/summoner/by-name/{summonerNames}',
      [
        ['region', 'Select region to execute against'],
        ['accountid', 'The summoner\'s name']
      ],
      [
        ['profileIconId', 'int', 'ID of the summoner icon associated with the summoner.'],
        ['revisionDate', 'long', 'Date summoner was last modified specified as' +
        ' epoch milliseconds. The following events will update this' +
        ' timestamp: profile icon change, playing the tutorial or advanced tutorial, finishing a game, summoner name change'],
        ['id', 'long', 'Summoner ID'],
        ['name', 'string', 'Summoner name'],
        ['summonerLevel', 'long', 'Summoner level associated with the summoner'],
      ]),

  new Webservice(
      1,
      'CURRENT-GAME-V1.0',
      'CurrentGameInfo',
      'Get current game information for the given summoner ID. (REST)',
      'https://developer.riotgames.com/',
      '/observer-mode/rest/consumer/getSpectatorGameInfo/{platformId}/{summonerId}',
      [
        ['summonerId', 'The ID of the summoner.'],
      ],
      [
        ['gameId', 'long', 'The ID of the game'],
        ['gameStartTime', 'long', 'The game start time represented in epoch milliseconds'],
        ['platformId', 'string', 'The ID of the platform on which the game is being played'],
        ['gameMode', 'string', 'The game mode'],
        ['mapId', 'long', 'The ID of the map'],
        ['gameType', 'string', 'The game type'],
        ['bannedChampions', '[object]', 'Banned champion information'],
        ['observers', 'object', 'The observer information'],
        ['participants', '[object]', 'The participant information'],
        ['gameLength', 'long', 'The amount of time in seconds that has passed since the game started'],
        ['gameQueueConfigId', 'long', 'The queue type (queue types are documented on the Game Constants page)']
      ],
  ),
];
