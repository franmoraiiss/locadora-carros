/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { CarProps } from '../Cars';
import { ClientProps } from '../Clients';

import { Divider } from '../../components/Divider';
import { TitleBar } from '../../components/TitleBar';

import CancelIcon from '@material-ui/icons/HighlightOff';
import DoneIcon from '@material-ui/icons/Done';

import api from '../../services/api';

import styles from './styles.module.scss';


interface RentProps {
  id?: number;
  car: string;
  client: string;
  price: string;
  startDate: string;
  endDate: string;
  clientId: number;
  carId: number;
  status: "ACTIVE" | "FINISH";
}

export function Rent() {
  const [rents, setRents] = useState<RentProps[]>([]);

  const [clients, setClients] = useState<ClientProps[]>();
  const [cars, setCars] = useState<CarProps[]>();

  const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);

  const [rentCar, setRentCar] = useState(''); 
  const [rentClient, setRentClient] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [rentStartDate, setRentStartDate] = useState('');
  const [rentEndDate, setRentEndDate] = useState('');
  const [rentStatus, setRentStatus] = useState<string>("ACTIVE");

  function openModalCreate() {
    setModalCreateIsOpen(true);
  }

  function closeModalCreate() {
    setModalCreateIsOpen(false);
  }

  function getRents() {
    api.get("/rents").then((response) => setRents(response.data));    
  }

  function getCars() {
    api.get("/cars").then((response) => setCars(response.data));
  }

  function getClients() {
    api.get("/clients").then((response) => setClients(response.data));
  }

  useEffect(() => {
    getRents();
    getClients();
    getCars();
  }, []);

  async function createRent(event: React.FormEvent) {
    event.preventDefault();
    closeModalCreate();

    const client = clients?.find(c => c.name === rentClient);
    await api.patch(`/clients/${client?.id}`, {
      status: "RENTING"
    });

    const car = cars?.find(c => c.name === rentCar);
    const timesRented = Number(car?.timesRented) + 1;
    await api.patch(`/cars/${car?.id}`, {
      status: "RENTING",
      timesRented: timesRented
    });
    
    if(rentCar && rentClient && rentPrice && rentStartDate && rentEndDate && rentStatus) {
      await api.post("/rents", {              
        car: rentCar,
        client: rentClient,
        price: rentPrice,
        startDate: rentStartDate,
        endDate: rentEndDate,
        clientId: client?.id,
        carId: car?.id,
        status: rentStatus,        
      });

      // Atualizar valor em caixa
      const oldTotal = await api.get('/cash/1');
      const newTotal = Number(oldTotal.data.total) + Number(rentPrice);
      const rents = Number(oldTotal.data.rents) + 1;

      await api.patch('/cash/1', {
        total: newTotal,
        rents: rents
      })

    } else {
      alert("Preencha os campos corretamente!");           
    }

    setRentClient('');
    setRentCar('');
    setRentPrice('');
    setRentStartDate('');
    setRentEndDate('');
    setRentStatus("ACTIVE");

    getRents();
    getClients();
    getCars();
  }

  async function deleteRent(id?: number) {
    const confirmation = confirm("Cancelar aluguel?");  
    
    if(confirmation) {    
      const rent = await api.get(`/rents/${id}`);
      const clientId = rent.data.clientId;
      const carId = rent.data.carId;
      const price = rent.data.price;

      // Atualizar valor em caixa
      const oldTotal = await api.get('/cash/1');
      const newTotal = Number(oldTotal.data.total) - Number(price);
      const rents = Number(oldTotal.data.rents) - 1;

      await api.patch('/cash/1', {
        total: newTotal,
        rents: rents
      });

      // Status do cliente para não alugando
      await api.patch(`/clients/${clientId}`, {
        status: "NOT_RENTING"
      });

      // Status do carro para não alugando
      const car = cars?.find(c => c.id === carId);
      const timesRented = Number(car?.timesRented) - 1;

      await api.patch(`/cars/${carId}`, {
        status: "NOT_RENTING",
        timesRented: timesRented
      });

      await api.delete(`/rents/${id}`);
      getRents();
      getClients();
      getCars();
    }
  }

  async function finishRent(id?: number) {
    const confirmation = confirm("Finalizar aluguel?");  
    
    if(confirmation) {    
      const rent = await api.get(`/rents/${id}`);
      const clientId = rent.data.clientId;
      const carId = rent.data.carId;      

      // Encerrar aluguel
      await api.patch(`/rents/${id}`, {              
        status: "FINISH"
      });
      
      // Status do cliente para não alugando
      await api.patch(`/clients/${clientId}`, {
        status: "NOT_RENTING"
      });

      // Status do carro para não alugando
      await api.patch(`/cars/${carId}`, {
        status: "NOT_RENTING"
      });
    }         

    getRents();
    getClients();
    getCars();
  }

  return (
    <div className={styles.container}>
      <TitleBar title="Aluguéis"/>
      <Divider />

      <Modal
        id="createRent"
        contentLabel="createRent"
        isOpen={modalCreateIsOpen}        
        onRequestClose={closeModalCreate}   
        ariaHideApp={false}              
      >
        <h2 style={{ textAlign: 'center' }}>Novo aluguel</h2>        
        <div className={styles.modal}>
          <form onSubmit={(e) => createRent(e)}>
            <p>Cliente:</p>
            <select               
              onChange={e => setRentClient(e.target.value)}
            > 
              <option hidden>Selecione um cliente</option>
              {clients?.map((client, index) => {
                return (
                  <option key={index}>{client.name}</option>
                );
              })}
            </select>          

            <p>Carro:</p>      
            <select               
              onChange={e => setRentCar(e.target.value)}
            >
              <option hidden>Selecione um carro</option>
              {cars?.filter(car => car.status !== 'RENTING').map((car, index) => {
                return (
                  <option key={index}>{car.name}</option>
                );
              })}
            </select>  

            <p>Período de aluguel:</p>      
            <div style={{ display: 'flex'}}>
              <div className={styles.startDate}>
                <span>Início</span>
                <input                 
                  type="date"            
                  onChange={(e) => setRentStartDate(e.target.value)}                   
                />
              </div>
              <div className={styles.endDate}>
                <span>Fim</span>
                <input 
                  type="date"            
                  onChange={(e) => setRentEndDate(e.target.value)}                 
                />
              </div>
            </div>        

            <p>Preço total:</p>
            <input 
              type="text"            
              onChange={(e) => setRentPrice(e.target.value)} 
            />             

            <div className={styles.formActionButton}>
              <button onClick={closeModalCreate}>Fechar</button>
              <button type="submit" onClick={createRent}>Criar</button>              
            </div>
          </form>
        </div>
      </Modal> 

      <div>
        <div className={styles.header}>
          <button className={styles.addRent} onClick={openModalCreate}>
            Adicionar aluguel
          </button>
        </div>
        <table className={styles.rents}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>              
              <th>Carro</th>              
              <th>Início do aluguel</th>              
              <th>Fim do aluguel</th>              
              <th>Preço</th> 
              <th>Status</th>              
              <th>Ações</th>              
            </tr>
          </thead>
          <tbody>
            {rents?.sort((a, b) => Number(b.id) - Number(a.id)).map((rent) => {
              return (
                <tr key={rent.id}>
                  <td>{rent.id}</td>
                  <td>{rent.client}</td>    
                  <td>{rent.car}</td> 
                  <td>{rent.startDate}</td> 
                  <td>{rent.endDate}</td> 
                  <td>R${rent.price},00</td> 
                  <td>{rent.status === 'ACTIVE' ? 'ATIVO' : 'FINALIZADO'}</td> 
                  <td style={{ width: '150px' }}>                    
                    <button 
                      className={styles.tableActionButton} 
                      onClick={() => finishRent(rent.id)}
                      disabled={rent.status !== "ACTIVE"}                   
                    >
                      <DoneIcon />
                    </button>
                    <button className={styles.tableActionButton} onClick={() => deleteRent(rent.id)}>
                      <CancelIcon />
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
