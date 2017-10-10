export const simpleService = {
    'description': ' (3 + 4)',
    'id': 1,
    'composition': false,
    'url': 'http://localhost:8080/webservice/rest/numbers/add',
    'title': 'add two numbers',
    'parameters': {
        'num1': 'number',
        'num2': 'number'
    },
    'returnType': {
        'result': 'number'
    },
    'children': [],
    'edges': [],
    'compEdges': [],
    'childEdges': [],
    'inputs': {
        'num1': 3,
        'num2': 4
    },
    'outputs': {
        'result': null
    }
};


export const compositeService = {
    'description': ' ((3+5) + (7*2) % 7) ',
    'id': 8,
    'x': 50,
    'y': 100,
    'composition': true,
    'url': null,
    'title': 'Tesla Sum',
    'parameters': {
        'teslaInput1': 'number',
        'teslaInput2': 'number'
    },
    'returnType': {
        'teslaResult': 'number'
    },
    'children': [
        {
            'id': 7,
            'x': 50,
            'y': 100,
            'composition': true,
            'url': null,
            'title': 'Yahoo Sum',
            'parameters': {
                'yahooInput1': 'number',
                'yahooInput2': 'number'
            },
            'returnType': {
                'yahooResult': 'number'
            },
            'children': [
                {
                    'id': 13,
                    'x': 50,
                    'y': 100,
                    'composition': false,
                    'url': 'http://localhost:8080/webservice/rest/numbers/add',
                    'title': 'sum',
                    'parameters': {
                        'num1': 'number',
                        'num2': 'number'
                    },
                    'returnType': {
                        'result': 'number'
                    },
                    'children': [],
                    'edges': [],
                    'childEdges': [],
                    'compEdges': [],
                    'inputs': {
                        'num1': null,
                        'num2': 5
                    },
                    'outputs': {
                        'result': null
                    }
                },
                {
                    'id': 2,
                    'x': 50,
                    'y': 100,
                    'composition': false,
                    'url': 'http://localhost:8080/webservice/rest/numbers/mul',
                    'title': 'multiply',
                    'parameters': {
                        'num1': 'number',
                        'num2': 'number'
                    },
                    'returnType': {
                        'result': 'number'
                    },
                    'children': [],
                    'edges': [],
                    'childEdges': [],
                    'compEdges': [],
                    'inputs': {
                        'num1': null,
                        'num2': 2
                    },
                    'outputs': {
                        'result': null
                    }
                },
                {
                    'id': 6,
                    'x': 50,
                    'y': 100,
                    'composition': false,
                    'url': 'http://localhost:8080/webservice/rest/numbers/add',
                    'title': 'sum',
                    'parameters': {
                        'num1': 'number',
                        'num2': 'number'
                    },
                    'returnType': {
                        'result': 'number'
                    },
                    'children': [],
                    'edges': [
                        {
                            'srcId': 13,
                            'name': 'num1',
                            'with': 'result'
                        },
                        {
                            'srcId': 2,
                            'name': 'num2',
                            'with': 'result'
                        }
                    ],
                    'childEdges': [],
                    'compEdges': [],
                    'inputs': {
                        'num1': null,
                        'num2': null
                    },
                    'outputs': {
                        'result': null
                    }
                }
            ],
            'compEdges': [
                {
                    'srcId': 6,
                    'name': 'yahooResult',
                    'with': 'result'
                }
            ],
            'edges': [],
            'childEdges': [
                {
                    'destId': 13,
                    'name': 'num1',
                    'with': 'yahooInput1'
                },
                {
                    'destId': 2,
                    'name': 'num1',
                    'with': 'yahooInput2'
                }
            ],
            'inputs': {
                'yahooInput1': null,
                'yahooInput2': null
            },
            'outputs': {
                'yahooResult': null
            }
        },
        {
            'id': 12,
            'x': 50,
            'y': 100,
            'composition': false,
            'url': 'http://localhost:8080/webservice/rest/numbers/mod',
            'title': 'sum',
            'parameters': {
                'num1': 'number',
                'num2': 'number'
            },
            'returnType': {
                'result': 'number'
            },
            'children': [],
            'edges': [
                {
                    'srcId': 7,
                    'name': 'num1',
                    'with': 'yahooResult'
                }
            ],
            'childEdges': [],
            'compEdges': [],
            'inputs': {
                'num1': null,
                'num2': 7
            },
            'outputs': {
                'result': null
            }
        }
    ],
    'compEdges': [
        {
            'srcId': 12,
            'name': 'teslaResult',
            'with': 'result'
        }
    ],
    'edges': [],
    'childEdges': [
        {
            'destId': 7,
            'name': 'yahooInput1',
            'with': 'teslaInput1'
        },
        {
            'destId': 7,
            'name': 'yahooInput2',
            'with': 'teslaInput2'
        }
    ],
    'inputs': {
        'teslaInput1': 3,
        'teslaInput2': 7
    },
    'outputs': {
        'teslaResult': null
    }
};

export const serviceArray = [
    simpleService,
    compositeService
];