import { useState } from 'react';
import './App.css';
import { Server, servers, serverType } from './commons';

interface Test {
  id: string;
  firstUsers: number;
  time: number;
  serverType: serverType;
  serverName: string;  
}

function MutationTest() {
  const [total, setTotal] = useState('1');
  const [runningMutation, setRunningMutation] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  
  const [server, setServer] = useState<Server>(servers[0]);  

  const runMutation = async() => {
    if (runningMutation) {
      return;
    }
    setRunningMutation(true);

    try {
    const headers: {[key: string]: string} = {
      'Content-Type': 'application/json',  
    };

    const startTime = new Date().getTime();
    
      console.log(`Creating ${total} clients...`);
      const createdAt = new Date();

      for (let i = 1; i <= +total; i++) {
        const response = await fetch(server.url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query: `
              mutation {
                createClient(client: {
                  name: "Juan ${i}",
                  email: "jp${i}@mail.com",
                  last_name: "P\u00E9rez ${i}",
                  birthday: "${new Date(1990, (i % 12) + 1, (i % 28) + 1).toISOString()}" ,
                  address: "Avenida de las Mercedeitas y Calle XYZ-${i}",
                  created_at: "${createdAt.toISOString()}"
                }
              ) {
                id
                name
              }
            }
          `
          })
        });

        const result = await response.json();
        if (result.errors) {
          console.log(`Error creating client ${i}`, result.errors);
          alert(`Error creando cliente ${i}: ${result.errors[0].message}`);
        }      
      }
      
      const newTests = [{id: `${new Date().getTime()}`,
        serverType: server.type,
        serverName: server.name,
        firstUsers: +total,
        time: (new Date().getTime() - startTime ) / 1000,
      }].concat(tests);
      setTests(newTests);
    } finally {
      setRunningMutation(false);
    }
  }

  return (
    <div>
      <h1 className="title">
        ReactJS Client - Mutaci&oacute;n
      </h1>
      <div className="form">
        <div className="field-container">
          <label htmlFor="firstUsers" className="label">Usuarios</label>
          <div>
            <input id="firstUsers" type="text" className="input-text" value={total} onChange={(e) => setTotal(e.target.value)} />
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
        <div className="button-container">
          <button id="submitButton" type="button" className="button" onClick={runMutation} disabled={runningMutation || isNaN(+total)}>CONSULTAR</button>
        </div>
      </div>
      <div className="tests-container">
        <div className="header">
          <div className="server">
            SERVIDOR
          </div>
          <div className="first">
            CLIENTES
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

export default MutationTest;
