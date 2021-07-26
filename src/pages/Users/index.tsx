import React, { useEffect, useState } from 'react';
import { Divider } from '../../components/Divider';
import { TitleBar } from '../../components/TitleBar';
import api from '../../services/api';

import styles from './styles.module.scss';

interface UserProps {
  id?: number;
  name: string;
  password: string;
}

export function Users() {
  const [users, setUsers] = useState<UserProps[]>();

  function getUsers() {
    api.get("/users").then((response) => setUsers(response.data));
  }

  useEffect(() => {
    getUsers();
  }, []);

  async function CreateUser() {
    await api.post("/users", {      
      name: "Novo",
      password: "fdsa321"
    });
    getUsers();
  }

  async function DeleteUser(id: number) {
    await api.delete(`/users/${id}`);
    getUsers();
  }

  return (
    <div className={styles.container}>
      <TitleBar title="Usuários"/>
      <Divider />

      <div className={styles.users}>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>              
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => {
              return (
                <tr>
                  <td>{user.id}</td>
                  <td>{user.name}</td>                  
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      
      <button onClick={CreateUser}>
        Create
      </button>
      <button onClick={() => DeleteUser(6)}>
        Delete
      </button>
    </div>
  );
}
