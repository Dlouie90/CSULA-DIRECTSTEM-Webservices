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


// example of complex composition;
const node4 = {
  'id'         : 3,
  'x'          : 709,
  'y'          : 230,
  'neighbors'  : [],
  'children'   : [
    {
      'id'         : 4,
      'x'          : 391,
      'y'          : 324,
      'neighbors'  : [
        {
          'id'         : 5,
          'x'          : 592,
          'y'          : 224,
          'neighbors'  : [],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 8,
          'x'          : 668,
          'y'          : 451,
          'neighbors'  : [
            {
              'id'         : 6,
              'x'          : 860,
              'y'          : 266,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        }
      ],
      'children'   : [
        {
          'id'         : 9,
          'x'          : 404,
          'y'          : 331,
          'neighbors'  : [
            {
              'id'         : 10,
              'x'          : 585,
              'y'          : 307,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [
            {
              'id'         : 35,
              'x'          : 528,
              'y'          : 346,
              'neighbors'  : [
                {
                  'id'         : 36,
                  'x'          : 820,
                  'y'          : 279,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 36,
              'x'          : 820,
              'y'          : 279,
              'neighbors'  : [
                {
                  'id'         : 37,
                  'x'          : 737,
                  'y'          : 583,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 37,
              'x'          : 962,
              'y'          : 453,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 10,
          'x'          : 585,
          'y'          : 307,
          'neighbors'  : [
            {
              'id'         : 11,
              'x'          : 740,
              'y'          : 308,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [
            {
              'id'         : 57,
              'x'          : 591,
              'y'          : 251,
              'neighbors'  : [
                {
                  'id'         : 58,
                  'x'          : 865,
                  'y'          : 233,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 58,
              'x'          : 865,
              'y'          : 233,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 11,
          'x'          : 740,
          'y'          : 308,
          'neighbors'  : [
            {
              'id'         : 12,
              'x'          : 912,
              'y'          : 308,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [
            {
              'id'         : 59,
              'x'          : 515,
              'y'          : 234,
              'neighbors'  : [
                {
                  'id'         : 60,
                  'x'          : 732,
                  'y'          : 241,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 60,
              'x'          : 732,
              'y'          : 241,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 12,
          'x'          : 912,
          'y'          : 308,
          'neighbors'  : [
            {
              'id'         : 13,
              'x'          : 1077,
              'y'          : 292,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [
            {
              'id'         : 61,
              'x'          : 558,
              'y'          : 322,
              'neighbors'  : [
                {
                  'id'         : 62,
                  'x'          : 768,
                  'y'          : 307,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 62,
              'x'          : 768,
              'y'          : 307,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 13,
          'x'          : 1077,
          'y'          : 292,
          'neighbors'  : [],
          'children'   : [
            {
              'id'         : 63,
              'x'          : 554,
              'y'          : 296,
              'neighbors'  : [
                {
                  'id'         : 64,
                  'x'          : 829,
                  'y'          : 293,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 64,
              'x'          : 829,
              'y'          : 293,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        }
      ],
      'inputNodes' : [],
      'outputNodes': [],
      'isInput'    : false,
      'isOutput'   : false
    },
    {
      'id'         : 5,
      'x'          : 592,
      'y'          : 224,
      'neighbors'  : [
        {
          'id'         : 6,
          'x'          : 860,
          'y'          : 266,
          'neighbors'  : [],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        }
      ],
      'children'   : [
        {
          'id'         : 14,
          'x'          : 482,
          'y'          : 368,
          'neighbors'  : [
            {
              'id'         : 15,
              'x'          : 628,
              'y'          : 240,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 15,
          'x'          : 628,
          'y'          : 240,
          'neighbors'  : [
            {
              'id'         : 16,
              'x'          : 863,
              'y'          : 328,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 16,
          'x'          : 747,
          'y'          : 370,
          'neighbors'  : [
            {
              'id'         : 17,
              'x'          : 1007,
              'y'          : 325,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [
            {
              'id'         : 38,
              'x'          : 605,
              'y'          : 308,
              'neighbors'  : [
                {
                  'id'         : 39,
                  'x'          : 831,
                  'y'          : 303,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 39,
              'x'          : 831,
              'y'          : 303,
              'neighbors'  : [
                {
                  'id'         : 40,
                  'x'          : 681,
                  'y'          : 559,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 40,
              'x'          : 681,
              'y'          : 559,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 17,
          'x'          : 915,
          'y'          : 420,
          'neighbors'  : [
            {
              'id'         : 18,
              'x'          : 1056,
              'y'          : 257,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 18,
          'x'          : 1056,
          'y'          : 257,
          'neighbors'  : [],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        }
      ],
      'inputNodes' : [],
      'outputNodes': [],
      'isInput'    : false,
      'isOutput'   : false
    },
    {
      'id'         : 6,
      'x'          : 860,
      'y'          : 266,
      'neighbors'  : [
        {
          'id'         : 7,
          'x'          : 1010,
          'y'          : 242,
          'neighbors'  : [],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        }
      ],
      'children'   : [
        {
          'id'         : 19,
          'x'          : 428,
          'y'          : 326,
          'neighbors'  : [
            {
              'id'         : 20,
              'x'          : 679,
              'y'          : 304,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 20,
          'x'          : 679,
          'y'          : 304,
          'neighbors'  : [
            {
              'id'         : 21,
              'x'          : 827,
              'y'          : 145,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 23,
              'x'          : 807,
              'y'          : 545,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 21,
          'x'          : 827,
          'y'          : 145,
          'neighbors'  : [
            {
              'id'         : 22,
              'x'          : 1027,
              'y'          : 288,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 22,
          'x'          : 1027,
          'y'          : 288,
          'neighbors'  : [],
          'children'   : [
            {
              'id'         : 41,
              'x'          : 569,
              'y'          : 336,
              'neighbors'  : [
                {
                  'id'         : 42,
                  'x'          : 808,
                  'y'          : 346,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 42,
              'x'          : 808,
              'y'          : 346,
              'neighbors'  : [
                {
                  'id'         : 43,
                  'x'          : 1034,
                  'y'          : 321,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 43,
              'x'          : 1034,
              'y'          : 321,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 23,
          'x'          : 807,
          'y'          : 545,
          'neighbors'  : [
            {
              'id'         : 22,
              'x'          : 1027,
              'y'          : 288,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        }
      ],
      'inputNodes' : [],
      'outputNodes': [],
      'isInput'    : false,
      'isOutput'   : false
    },
    {
      'id'         : 7,
      'x'          : 1107,
      'y'          : 237,
      'neighbors'  : [],
      'children'   : [
        {
          'id'         : 24,
          'x'          : 393,
          'y'          : 357,
          'neighbors'  : [
            {
              'id'         : 25,
              'x'          : 671,
              'y'          : 207,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 27,
              'x'          : 585,
              'y'          : 512,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [
            {
              'id'         : 44,
              'x'          : 650,
              'y'          : 322,
              'neighbors'  : [
                {
                  'id'         : 45,
                  'x'          : 884,
                  'y'          : 315,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [
                {
                  'id'         : 53,
                  'x'          : 631,
                  'y'          : 288,
                  'neighbors'  : [
                    {
                      'id'         : 54,
                      'x'          : 875,
                      'y'          : 270,
                      'neighbors'  : [],
                      'children'   : [],
                      'inputNodes' : [],
                      'outputNodes': [],
                      'isInput'    : false,
                      'isOutput'   : false
                    }
                  ],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                },
                {
                  'id'         : 54,
                  'x'          : 875,
                  'y'          : 270,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 45,
              'x'          : 884,
              'y'          : 315,
              'neighbors'  : [
                {
                  'id'         : 46,
                  'x'          : 779,
                  'y'          : 604,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [
                {
                  'id'         : 51,
                  'x'          : 504,
                  'y'          : 248,
                  'neighbors'  : [
                    {
                      'id'         : 52,
                      'x'          : 811,
                      'y'          : 309,
                      'neighbors'  : [],
                      'children'   : [],
                      'inputNodes' : [],
                      'outputNodes': [],
                      'isInput'    : false,
                      'isOutput'   : false
                    }
                  ],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                },
                {
                  'id'         : 52,
                  'x'          : 811,
                  'y'          : 309,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 46,
              'x'          : 779,
              'y'          : 604,
              'neighbors'  : [],
              'children'   : [
                {
                  'id'         : 55,
                  'x'          : 479,
                  'y'          : 268,
                  'neighbors'  : [
                    {
                      'id'         : 56,
                      'x'          : 720,
                      'y'          : 149,
                      'neighbors'  : [],
                      'children'   : [],
                      'inputNodes' : [],
                      'outputNodes': [],
                      'isInput'    : false,
                      'isOutput'   : false
                    }
                  ],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                },
                {
                  'id'         : 56,
                  'x'          : 720,
                  'y'          : 149,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 25,
          'x'          : 671,
          'y'          : 207,
          'neighbors'  : [
            {
              'id'         : 26,
              'x'          : 984,
              'y'          : 307,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 26,
          'x'          : 984,
          'y'          : 307,
          'neighbors'  : [
            {
              'id'         : 29,
              'x'          : 1170,
              'y'          : 391,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 27,
          'x'          : 585,
          'y'          : 513,
          'neighbors'  : [
            {
              'id'         : 28,
              'x'          : 934,
              'y'          : 536,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 28,
          'x'          : 934,
          'y'          : 536,
          'neighbors'  : [
            {
              'id'         : 29,
              'x'          : 1170,
              'y'          : 391,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 29,
          'x'          : 1170,
          'y'          : 391,
          'neighbors'  : [],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        }
      ],
      'inputNodes' : [],
      'outputNodes': [],
      'isInput'    : false,
      'isOutput'   : false
    },
    {
      'id'         : 8,
      'x'          : 668,
      'y'          : 451,
      'neighbors'  : [
        {
          'id'         : 6,
          'x'          : 860,
          'y'          : 266,
          'neighbors'  : [],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        }
      ],
      'children'   : [
        {
          'id'         : 30,
          'x'          : 475,
          'y'          : 288,
          'neighbors'  : [
            {
              'id'         : 31,
              'x'          : 711,
              'y'          : 157,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 34,
              'x'          : 691,
              'y'          : 532,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 31,
          'x'          : 711,
          'y'          : 157,
          'neighbors'  : [
            {
              'id'         : 32,
              'x'          : 870,
              'y'          : 310,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 32,
          'x'          : 870,
          'y'          : 310,
          'neighbors'  : [
            {
              'id'         : 33,
              'x'          : 1022,
              'y'          : 236,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 33,
          'x'          : 1022,
          'y'          : 236,
          'neighbors'  : [],
          'children'   : [],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        },
        {
          'id'         : 34,
          'x'          : 691,
          'y'          : 532,
          'neighbors'  : [
            {
              'id'         : 32,
              'x'          : 870,
              'y'          : 310,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'children'   : [
            {
              'id'         : 48,
              'x'          : 586,
              'y'          : 268,
              'neighbors'  : [
                {
                  'id'         : 49,
                  'x'          : 835,
                  'y'          : 173,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 49,
              'x'          : 835,
              'y'          : 171,
              'neighbors'  : [
                {
                  'id'         : 50,
                  'x'          : 828,
                  'y'          : 444,
                  'neighbors'  : [],
                  'children'   : [],
                  'inputNodes' : [],
                  'outputNodes': [],
                  'isInput'    : false,
                  'isOutput'   : false
                }
              ],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            },
            {
              'id'         : 50,
              'x'          : 828,
              'y'          : 444,
              'neighbors'  : [],
              'children'   : [],
              'inputNodes' : [],
              'outputNodes': [],
              'isInput'    : false,
              'isOutput'   : false
            }
          ],
          'inputNodes' : [],
          'outputNodes': [],
          'isInput'    : false,
          'isOutput'   : false
        }
      ],
      'inputNodes' : [],
      'outputNodes': [],
      'isInput'    : false,
      'isOutput'   : false
    }
  ],
  'inputNodes' : [],
  'outputNodes': [],
  'isInput'    : false,
  'isOutput'   : false
};

export const DATA: Array<any> = [node1, node2, node3, node4];
