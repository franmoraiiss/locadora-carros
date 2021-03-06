import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { Divider } from '../../components/Divider';
import { TitleBar } from '../../components/TitleBar';

import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import api from '../../services/api';

import styles from './styles.module.scss';

interface UserProps {
  id?: number;
  name: string;
  cpf: string;
  birth: string;
  email: string;
  permission: string;
  password: string;
}

export function Users() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [user, setUser] = useState<UserProps>();
  const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);

  const [userID, setUserID] = useState<number>();
  const [userName, setUserName] = useState(''); 
  const [userEmail, setUserEmail] = useState('');
  const [userCPF, setUserCPF] = useState('');
  const [userPermission, setUserPermission] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [userPassword, setUserPassword] = useState('');

  function openModalCreate() {
    setModalCreateIsOpen(true);
  }

  function closeModalCreate() {
    setModalCreateIsOpen(false);
  }

  function openModalEdit() {
    setModalEditIsOpen(true);
  }

  function closeModalEdit() {
    setModalEditIsOpen(false);    
    setUserID(0);
    setUserName('');
    setUserEmail('');
    setUserBirth('');
    setUserCPF('');
    setUserPermission('');
    setUserPassword(''); 
  }

  function getUsers() {
    api.get("/users").then((response) => setUsers(response.data));
  }

  useEffect(() => {
    getUsers();
  }, []);

  async function CreateUser(event: React.FormEvent) {
    event.preventDefault();
    closeModalCreate();
    
    if(userName && userEmail && userCPF && userPermission && userPassword && userBirth) {
      await api.post("/users", {      
        name: userName, 
        email: userEmail,
        cpf: userCPF,
        birth: userBirth,
        permission: userPermission,        
        password: userPassword,      
      });
    } else {
      alert("Preencha os campos corretamente!");           
    }

    setUserID(0);
    setUserName('');
    setUserEmail('');
    setUserBirth('');
    setUserCPF('');
    setUserPermission('');
    setUserPassword('');  
    
    getUsers();
  }

  async function EditUser(event: React.FormEvent) {
    event.preventDefault();
    closeModalEdit();
    
    if(userName && userEmail && userCPF && userPermission && userPassword && userBirth) {
      await api.patch(`/users/${userID}`, {             
        name: userName, 
        email: userEmail,
        cpf: userCPF,
        birth: userBirth,
        permission: userPermission,
        password: userPassword,      
      });
    } else {
      alert("Preencha os campos corretamente!");           
    }

    setUserID(0);
    setUserName('');
    setUserEmail('');
    setUserBirth('');
    setUserCPF('');
    setUserPermission('');
    setUserPassword('');  
    
    getUsers();
  }

  async function DeleteUser(id?: number) {
    // eslint-disable-next-line no-restricted-globals
    const confirmation = confirm("Deletar usu??rio?");  
    
    if(confirmation) {    
      await api.delete(`/users/${id}`);
      getUsers();
    }
  }

  async function HandleEditUser(id?: number) {        
    await api.get(`/users/${id}`).then((response) => {
      setUser(response.data);       
      console.log(response.data);    
    })    
    openModalEdit();
  }
  
  useEffect(() => {
    if(user) {
      setUserID(user.id);
      setUserName(user.name);
      setUserEmail(user.email);
      setUserBirth(user.birth);
      setUserCPF(user.cpf);
      setUserPermission(user.permission);
      setUserPassword(user.password);  
    }    
  }, [user]);  

  return (
    <div className={styles.container}>
      <TitleBar title="Usu??rios"/>
      <Divider />

      <Modal
        id="createUser"
        contentLabel="createUser"
        isOpen={modalCreateIsOpen}        
        onRequestClose={closeModalCreate}   
        ariaHideApp={false}              
      >
        <h2 style={{ textAlign: 'center' }}>Criar usu??rio</h2>        
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

            <p>Permiss??o:</p>      
            <select 
              onChange={e => setUserPermission(e.target.value)}
            >
              <option hidden>Selecione uma op????o</option>
              <option>Administrador</option>
              <option>Funcion??rio</option>
            </select>  

            <p>Data de nascimento:</p>
            <input 
              type="date"            
              onChange={(e) => setUserBirth(e.target.value)} 
            />

            <p>Senha:</p>      
            <input 
              type="password"
              onChange={e => setUserPassword(e.target.value)}
            />                  

            <div className={styles.formActionButton}>
              <button onClick={closeModalCreate}>Fechar</button>
              <button type="submit" onClick={CreateUser}>Criar</button>              
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        id="editUser"
        contentLabel="editUser"
        isOpen={modalEditIsOpen}        
        onRequestClose={closeModalEdit}                 
        ariaHideApp={false}
      >
        <h2 style={{ textAlign: 'center' }}>Editar usu??rio</h2>        
        <div className={styles.modal}>
          <form onSubmit={(e) => EditUser(e)}>
            <p>Nome:</p>
            <input 
              type="text" 
              value={userName}              
              onChange={e => setUserName(e.target.value)}
            />
            
            <p>Email:</p>
            <input 
              type="email"
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
            />

            <p>CPF:</p>      
            <input 
              type="text"
              value={userCPF}
              onChange={e => setUserCPF(e.target.value)}
            />          

            <p>Permiss??o:</p>      
            <select 
              value={userPermission}
              onChange={(e) => setUserPermission(e.target.value)}
            >
              <option>Administrador</option>
              <option>Funcion??rio</option>
            </select>        

            <p>Data de nascimento:</p>
            <input 
              type="date"    
              value={userBirth}        
              onChange={(e) => setUserBirth(e.target.value)} 
            />

            <p>Senha:</p>      
            <input 
              type="password"
              value={userPassword}
              disabled
              onChange={e => setUserPassword(e.target.value)}
            />                  

            <div className={styles.formActionButton}>
              <button onClick={closeModalEdit}>Fechar</button>
              <button type="submit" onClick={EditUser}>Atualizar</button>              
            </div>
          </form>
        </div>
      </Modal>

      <div>
        <div className={styles.header}>
          <button className={styles.addUser} onClick={openModalCreate}>
            Adicionar usu??rio
          </button>
        </div>
        <table className={styles.users}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usu??rio</th>              
              <th>Email</th>              
              <th>CPF</th>              
              <th>Permiss??o</th>   
              <th>A????es</th>                              
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>    
                  <td>{user.email}</td> 
                  <td>{user.cpf}</td>                  
                  <td>{user.permission}</td> 
                  <td style={{ width: '150px' }}>                    
                    <button className={styles.tableActionButton} onClick={() => HandleEditUser(user.id)}>
                      <EditIcon />
                    </button>
                    <button className={styles.tableActionButton} onClick={() => DeleteUser(user.id)}>
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
