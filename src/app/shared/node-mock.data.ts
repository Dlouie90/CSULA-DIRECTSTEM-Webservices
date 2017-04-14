import {Node} from './node.model';
import {Property} from './property.model';

const node1 = new Node(
    0,
    300,
    100,
    {
      title       : 'SUMMONER-V1.4',
      description : 'Get a list of summoners by accounts id',
      type        : 'SummonerDto',
      domain      : 'https://developer.riotgames.com',
      path        : '/api/lol/{region}/v1.4/summoner/by-name/{summonerNames}',
      parameters  : [
        Property.create('region', 'string', 'Select region to execute against'),
        Property.create('accountId', 'string', 'The summoner\s name')
      ],
      returnValues: [
        Property.create('profileIconId', 'int', 'ID of the summoner icon associated with the summoner.'),
        Property.create('revisionDate', 'long', 'Date summoner was last modified specified as' +
            ' epoch milliseconds. The following events will updateToService this' +
            ' timestamp: profile icon change, playing the tutorial or advanced tutorial, finishing a game, summoner name change'),
        Property.create('id', 'long', 'Summoner ID'),
        Property.create('name', 'string', 'Summoner name'),
        Property.create('summonerLevel', 'long', 'Summoner level associated with the summoner'),
      ]
    });

const node2 = new Node(
    1,
    500,
    200,
    {
      title       : 'CURRENT-GAME-V1.0',
      description : 'Get current game information for the given summoner ID. (REST)',
      type        : 'CurrentGameInfo',
      domain      : 'https://developer.riotgames.com/',
      path        : '/observer-mode/rest/consumer/getSpectatorGameInfo/{platformId}/{summonerId}',
      parameters  : [
        Property.create('summonerId', 'string', 'The ID of the summoner.'),
      ],
      returnValues: [
        Property.create('gameId', 'long', 'The ID of the game'),
        Property.create('gameStartTime', 'long', 'The game start time represented in epoch milliseconds'),
        Property.create('platformId', 'string', 'The ID of the platform on which the game is being played'),
        Property.create('gameMode', 'string', 'The game mode'),
        Property.create('mapId', 'long', 'The ID of the map'),
        Property.create('gameType', 'string', 'The game type'),
        Property.create('bannedChampions', '[object]', 'Banned champion information'),
        Property.create('observers', 'object', 'The observer information'),
        Property.create('participants', '[object]', 'The participant information'),
        Property.create('gameLength', 'long', 'The amount of time in seconds that has passed since the game started'),
        Property.create('gameQueueConfigId', 'long', 'The queue type (queue types are documented on the Game Constants page)')
      ]
    });


const node3 = new Node(
    2,
    500,
    400,
    {
      title       : 'SPOTIFY-GET-TRACK',
      description : 'Get Spotify catalog information for a single track identified by its unique Spotify ID.',
      type        : 'TrackObject',
      domain      : 'https://api.spotify.com',
      path        : 'v1/tracks/{id}',
      parameters  : [
        Property.create('id', 'string', 'The Spotify ID for the track.'),
      ],
      returnValues: [
        Property.create('album ', 'object', 'The album on which the track appears.'),
        Property.create('artists ', '[object]', 'The artists who performed the track.'),
        Property.create('duration_ms  ', 'integer', 'The track length in milliseconds'),
        Property.create('id', 'string', '	The Spotify ID for the track.'),
        Property.create('name', 'string', 'The name of the track.'),
        Property.create('popularity', 'integer', 'The popularity of the track. ' +
            'The value will be between 0 and 100, with 100 being the most popular.'),
        Property.create('track_number ', 'integer', 'The number of the track.'),
        Property.create('bannedChampions', '[object]', 'Banned champion information'),
      ]
    });

node2.addCompositionNode(node1);
node2.addCompositionNode(node3);
node1.neighbors.push(node3);

export const DATA: Array<Node> = [node1, node2, node3];
