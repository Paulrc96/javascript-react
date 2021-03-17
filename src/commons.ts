export type serverType = 'JS' | 'PYTHON' | 'GO';

export interface Server {
  type: serverType;
  name: string;
  url: string
};

export const servers: Server[] = [
  {
    type: 'JS',
    name: 'JavaScript',
    url: 'http://localhost:4000/'
  },
  {
    type: 'PYTHON',
    name: 'Python',
    url: 'http://localhost:8000/graphql_server'
  },
  {
    type: 'GO',
    name: 'Go',
    url: 'http://localhost:8080/query'
  },
];