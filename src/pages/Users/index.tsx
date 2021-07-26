import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { Divider } from '../../components/Divider';
import { TitleBar } from '../../components/TitleBar';

import Delete from '@material-ui/icons/Delete';

import api from '../../services/api';

import styles from './styles.module.scss';
interface UserProps {
  id?: number;
  name: string;
  password: string;
  email: string;
  cpf: string;
  permission: string;
}

export function Users() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);

  const [userName, setUserName] = useState(''); 
  const [userEmail, setUserEmail] = useState('');
  const [userCPF, setUserCPF] = useState('');
  const [userPermission, setUserPermission] = useState('');
  const [userPassword, setUserPassword] = useState('');

  function openModal() {
    setModalCreateIsOpen(true);
  }

  function closeModal() {
    setModalCreateIsOpen(false);
  }


  function getUsers() {
    api.get("/users").then((response) => setUsers(response.data));
  }

  useEffect(() => {
    getUsers();
  }, []);

  async function CreateUser(event: React.FormEvent) {
    event.preventDefault();
    closeModal();

    await api.post("/users", {      
      name: userName, 
      email: userEmail,
      cpf: userCPF,
      permission: userPermission,
      password: userPassword,      
    });
    getUsers();
  }

  async function DeleteUser(id?: number) {
    // eslint-disable-next-line no-restricted-globals
    const confirmation = confirm("Deletar usuário?");  
    
    if(confirmation) {    
      await api.delete(`/users/${id}`);
      getUsers();
    }
  }

  return (
    <div className={styles.container}>
      <TitleBar title="Usuários"/>
      <Divider />

      <Modal
        isOpen={modalCreateIsOpen}        
        onRequestClose={closeModal}                 
      >
          <h2 style={{ textAlign: 'center' }}>Criar usuário</h2>        
          <div className={styles.modal}>
            <form onSubmit={(e) => CreateUser(e)}>
              <p>Nome:</p>
              <input 
                type="text" 
                onChange={e => setUserName(e.target.value)}
              />
              
              <p>Email:</p>
              <input 
                type="email"
                onChange={e => setUserEmail(e.target.value)}
              />

              <p>CPF:</p>      
              <input 
                type="text"
                onChange={e => setUserCPF(e.target.value)}
              />          

              <p>Permissão:</p>      
              <input 
                type="text"
                onChange={e => setUserPermission(e.target.value)}
              />         

              <p>Senha:</p>      
              <input 
                type="password"
                onChange={e => setUserPassword(e.target.value)}
              />                  

              <div>
                <button type="submit" onClick={CreateUser}>Criar</button>              
              </div>
            </form>
          </div>
          <button onClick={closeModal}>close</button>
      </Modal>

      <div>
        <div className={styles.header}>
          <button className={styles.addUser} onClick={openModal}>
            Adicionar usuário
          </button>
        </div>
        <table className={styles.users}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>              
              <th>Email</th>              
              <th>CPF</th>              
              <th>Permissão</th>              
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => {
              return (
                <tr>
                  <td>{user.id}</td>
                  <td>{user.name}</td>    
                  <td>{user.email}</td> 
                  <td>{user.cpf}</td>                  
                  <td>{user.permission}</td> 
                  <td>                    
                    <button onClick={() => DeleteUser(user.id)}>Editar</ button>
                    <button onClick={() => DeleteUser(user.id)}>
                      <Delete />
                    </button>
                  </td>                       
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
