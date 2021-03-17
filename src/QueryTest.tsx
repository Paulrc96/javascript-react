import { useState } from 'react';
import './App.css';
import { Server, servers, serverType } from './commons';

interface Case {
  id: string;
  name: string;
  query(first: string): string;
}

const cases: Case[] = [
  {
    id: 'case1',
    name: 'Caso 1',
    query: (first) => `
      query {
        users (first: ${first}) {
          id
          name
          last_name
          email
          address
          birthday
        }
      }
    `
  },
  {
    id: 'case2',
    name: 'Caso 2',
    query: (first) => `
      query {
        users (first: ${first}) {
          id
          name
          last_name
          email
          address
          birthday
          posts {
            title
            description
          }
        }
      }
    `
  },
  {
    id: 'case3',
    name: 'Caso 3',
    query: (first) => `
      query {
        users (first: ${first}) {
          id
          name
          last_name
          email
          address
          birthday
          posts {
            title
            description
            comments {
              post_id
              description
            }
          }
        }
      }
    `
  }
];

interface Test {
  id: string;
  firstUsers: number;
  time: number;
  serverType: serverType;
  serverName: string;
  caseId: string;
  caseName: string;
}

function QueryTest() {
  const [firstUsers, setFirstUsers] = useState('1');
  const [gettingData, setGettingData] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [currentCase, setCurrentCase] = useState<Case>(cases[0]);
  
  const [server, setServer] = useState<Server>(servers[0]);  

  const query = async() => {
    if (gettingData) {
      return;
    }
    setGettingData(true);

    const headers: {[key: string]: string} = {
      'Content-Type': 'application/json',  
    };
  
    if (server.type === 'GO') {
      headers['X-FirstUsers'] = firstUsers;
    }

    const startTime = new Date().getTime();
    
    try {
      console.log('Getting data...');
      const response = await fetch(server.url, {
        method: 'POST',
        // mode: 'cors',
        headers,
        body: JSON.stringify({
          query : currentCase.query(firstUsers),
        })
      });    
      const jsonResponse =  await response.json();
      // console.log('DATA', jsonResponse.data);
      if (jsonResponse.errors) {
        alert(`Error: ${jsonResponse.errors.map((e: {message: string}) => e.message).join(', ')}`);
      } else {
        const newTests = [{id: `${new Date().getTime()}`,
          serverType: server.type,
          serverName: server.name,
          firstUsers: +firstUsers,
          time: (new Date().getTime() - startTime ) / 1000,
          caseId: currentCase.id,
          caseName: currentCase.name
        }].concat(tests);
        setTests(newTests);
      }
    } catch (error) {
      alert(`Error querying! ${error.message}`)
      console.error('Error querying!', server, error);
    } finally {
      setGettingData(false);
    }
  }

  return (
    <div>
      <h1 className="title">
        ReactJS Client
      </h1>
      <div className="form">
        <div className="field-container">
          <label htmlFor="firstUsers" className="label">Usuarios</label>
          <div>
            <input id="firstUsers" type="text" className="input-text" value={firstUsers} onChange={(e) => setFirstUsers(e.target.value)} />
          </div>
        </div>
        <div className="field-container">
          <label htmlFor="server" className="label">Servidor</label>
          <div>
            <select id="serverSelect" className="select" value={server.type} 
              onChange={(e) => {
                setServer(servers.find((s) => e.target.value === s.type) || server);
              }}>
              {servers.map((s) => (<option key={s.type} value={s.type}>{s.name}</option>))}
            </select>
          </div>
        </div>
        <div className="field-container">
          <label htmlFor="caseSelect" className="label">Caso</label>
          <div>
            <select id="caseSelect" className="select" value={currentCase.id} 
              onChange={(e) => {
                setCurrentCase(cases.find((c) => e.target.value === c.id) || currentCase);
              }}>
              {cases.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
        </div>
        <div className="button-container">
          <button id="submitButton" type="button" className="button" onClick={query} disabled={gettingData || isNaN(+firstUsers)}>CONSULTAR</button>
        </div>
      </div>
      <div className="tests-container">
        <div className="header">
          <div className="server">
            SERVIDOR
          </div>
          <div className="case">
            CASO
          </div>
          <div className="first">
            USUARIOS
          </div>
          <div className="time">
            TIEMPO (segundos)
          </div>
        </div>
        <div id="testsList" className="tests-list">         
          {tests.map((t) => (
            <div key={t.id} className="row">
              <div className="server">
                {t.serverName}
              </div>
              <div className="case">
                {t.caseName}
              </div>
              <div className="first">
                {t.firstUsers}
              </div>
              <div className="time">
                {t.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QueryTest;
