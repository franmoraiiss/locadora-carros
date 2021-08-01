/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { Divider } from '../../components/Divider';
import { TitleBar } from '../../components/TitleBar';

import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import api from '../../services/api';

import styles from './styles.module.scss';

export interface ClientProps {
  id?: number;
  name: string;
  cpf: string;
  cnh: string;  
  birth: string;  
  phone: string;
  status: "RENTING" | "NOT_RENTING";
}

export function Clients() {
  const [clients, setClients] = useState<ClientProps[]>([]);

  const [client, setClient] = useState<ClientProps>();

  const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);

  const [clientId, setClientId] = useState<number>();
  const [clientName, setClientName] = useState(''); 
  const [clientCPF, setClientCPF] = useState('');
  const [clientCnh, setClientCnh] = useState('');
  const [clientBirth, setClientBirth] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientStatus, setClientStatus] = useState<string>("NOT_RENTING");

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
    setClientId(0);
    setClientName('');
    setClientBirth('');
    setClientCPF('');
    setClientCnh('');
    setClientPhone('');
    setClientStatus("NOT_RENTING");
  }

  function getClients() {
    api.get("/clients").then((response) => setClients(response.data));
  }

  useEffect(() => {
    getClients();
  }, []);

  async function createClient(event: React.FormEvent) {
    event.preventDefault();
    closeModalCreate();
    
    if(clientName && clientCPF && clientBirth && clientCnh && clientPhone) {
      await api.post("/clients", {      
        name: clientName,         
        cpf: clientCPF,
        birth: clientBirth,
        cnh: clientCnh,         
        phone: clientPhone,        
        status: clientStatus
      });
    } else {
      alert("Preencha os campos corretamente!");           
    }

    setClientId(0);
    setClientName('');
    setClientBirth('');
    setClientCPF('');
    setClientCnh('');
    setClientPhone('');
    setClientStatus("NOT_RENTING");
    
    getClients();
  }

  async function editClient(event: React.FormEvent) {
    event.preventDefault();
    closeModalEdit();
    
    if(clientName && clientCPF && clientBirth && clientCnh && clientPhone && clientStatus) {
      await api.patch(`/clients/${clientId}`, {             
        name: clientName,         
        cpf: clientCPF,
        birth: clientBirth,
        cnh: clientCnh,  
        phone: clientPhone,
        status: clientStatus
      });
    } else {
      alert("Preencha os campos corretamente!");           
    }

    setClientId(0);
    setClientName('');
    setClientBirth('');
    setClientCPF('');
    setClientCnh('');
    setClientStatus("NOT_RENTING");
    
    getClients();
  }

  async function deleteClient(id?: number) {
    if(clients![id! - 1].status === "RENTING") {
      alert("Não é possível deletar o cliente pois ele possui um aluguel ativo");
    } else {
      const confirmation = confirm("Deletar cliente?");  
    
      if(confirmation) {    
        await api.delete(`/clients/${id}`);
        getClients();
      }
    }
  }

  async function handleEditClient(id?: number) {        
    await api.get(`/clients/${id}`).then((response) => {
      setClient(response.data);       
      console.log(response.data);    
    })    
    openModalEdit();
  }
  
  useEffect(() => {
    if(client) {
      setClientId(client.id);
      setClientName(client.name);
      setClientCPF(client.cpf);
      setClientCnh(client.cnh);
      setClientBirth(client.birth);      
      setClientPhone(client.phone);
      setClientStatus(client.status);
    }    
  }, [client]);  

  return (
    <div className={styles.container}>
      <TitleBar title="Clientes"/>
      <Divider />

      <Modal
        id="createClient"
        contentLabel="createClient"
        isOpen={modalCreateIsOpen}        
        onRequestClose={closeModalCreate}   
        ariaHideApp={false}              
      >
        <h2 style={{ textAlign: 'center' }}>Adicionar cliente</h2>        
        <div className={styles.modal}>
          <form onSubmit={(e) => createClient(e)}>
            <p>Nome:</p>
            <input 
              type="text" 
              onChange={e => setClientName(e.target.value)}
            />          

            <p>CPF:</p>      
            <input 
              type="text"             
              onChange={e => setClientCPF(e.target.value)}
            />          

            <p>CNH:</p>      
            <input 
              type="text"
              onChange={e => setClientCnh(e.target.value)}
            />         

            <p>Data de nascimento:</p>
            <input 
              type="date"            
              onChange={(e) => setClientBirth(e.target.value)} 
            />

            <p>Celular:</p>      
            <input 
              type="text"
              onChange={e => setClientPhone(e.target.value)}
            />                  

            <div className={styles.formActionButton}>
              <button onClick={closeModalCreate}>Fechar</button>
              <button type="submit" onClick={createClient}>Criar</button>              
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        id="editClient"
        contentLabel="editClient"
        isOpen={modalEditIsOpen}        
        onRequestClose={closeModalEdit}                 
        ariaHideApp={false}
      >
        <h2 style={{ textAlign: 'center' }}>Editar cliente</h2>        
        <div className={styles.modal}>
          <form onSubmit={(e) => editClient(e)}>
          <p>Nome:</p>
            <input 
              type="text" 
              value={clientName}
              onChange={e => setClientName(e.target.value)}
            />          

            <p>CPF:</p>      
            <input 
              type="text"    
              value={clientCPF}         
              onChange={e => setClientCPF(e.target.value)}
            />          

            <p>CNH:</p>      
            <input 
              type="text"
              value={clientCnh}
              onChange={e => setClientCnh(e.target.value)}
            />         

            <p>Data de nascimento:</p>
            <input 
              type="date"            
              value={clientBirth}
              onChange={(e) => setClientBirth(e.target.value)} 
            />

            <p>Celular:</p>      
            <input 
              type="text"
              value={clientPhone}
              onChange={e => setClientPhone(e.target.value)}
            />                        

            <div className={styles.formActionButton}>
              <button onClick={closeModalEdit}>Fechar</button>
              <button type="submit" onClick={editClient}>Atualizar</button>              
            </div>
          </form>
        </div>
      </Modal>

      <div>
        <div className={styles.header}>
          <button className={styles.addClient} onClick={openModalCreate}>
            Adicionar cliente
          </button>
        </div>
        <table className={styles.clients}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>              
              <th>CPF</th>              
              <th>Telefone</th>              
              <th>Ações</th>              
            </tr>
          </thead>
          <tbody>
            {clients?.map((client) => {
              return (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.name}</td>    
                  <td>{client.cpf}</td> 
                  <td>{client.phone}</td> 
                  <td style={{ width: '150px' }}>                    
                    <button className={styles.tableActionButton} onClick={() => handleEditClient(client.id)}>
                      <EditIcon />
                    </button>
                    <button className={styles.tableActionButton} onClick={() => deleteClient(client.id)}>
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
