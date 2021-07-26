import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { Divider } from '../../components/Divider';
import { TitleBar } from '../../components/TitleBar';

import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import api from '../../services/api';

import styles from './styles.module.scss';

interface CarProps {
  id?: number;
  model: string;
  brand: string;
}

export function Cars() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [car, setCar] = useState<CarProps>();
  
  const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);

  const [carID, setCarID] = useState<number>();
  const [carModel, setCarModel] = useState('');   
  const [carBrand, setCarBrand] = useState('');   

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
    setCarID(0);
    setCarModel('');
    setCarBrand('');
  }

  function getCars() {
    api.get("/cars").then((response) => setCars(response.data));
  }  

  useEffect(() => {
    getCars();    
  }, []);

  async function CreateCar(event: React.FormEvent) {
    event.preventDefault();
    closeModalCreate();
    
    if(carModel && carBrand) {
      await api.post("/cars", {      
        model: carModel,
        brand: carBrand   
      });
    } else {
      alert("Preencha os campos corretamente!");           
    }

    setCarID(0);
    setCarModel('');
    setCarBrand('');
    
    getCars();
  }

  async function EditCar(event: React.FormEvent) {
    event.preventDefault();
    closeModalEdit();
    
    if(carModel && carBrand) {
      await api.put(`/cars/${carID}`, {             
        model: carModel,
        brand: carBrand       
      });
    } else {
      alert("Preencha os campos corretamente!");           
    }

    setCarID(0);
    setCarModel('');
    setCarBrand('');
    
    getCars();
  }

  async function DeleteCar(id?: number) {
    // eslint-disable-next-line no-restricted-globals
    const confirmation = confirm("Deletar carro?");  
    
    if(confirmation) {    
      await api.delete(`/cars/${id}`);
      getCars();
    }
  }

  async function HandleEditCar(id?: number) {        
    await api.get(`/cars/${id}`).then((response) => {
      setCar(response.data);       
      console.log(response.data);    
    })    
    openModalEdit();
  }
  
  useEffect(() => {
    if(car) { 
      setCarID(car.id);
      setCarModel(car.model);
      setCarBrand(car.brand);
    }    
  }, [car]);  

  return (
    <div className={styles.container}>
      <TitleBar title="Carros"/>
      <Divider />

      <Modal
        id="createUser"
        contentLabel="createUser"
        isOpen={modalCreateIsOpen}        
        onRequestClose={closeModalCreate}   
        ariaHideApp={false}              
      >
        <h2 style={{ textAlign: 'center' }}>Criar usuário</h2>        
        <div className={styles.modal}>
          <form onSubmit={(e) => CreateCar(e)}>
            <p>Modelo:</p>
            <input 
              type="text" 
              onChange={e => setCarModel(e.target.value)}
            />
            
            <p>Marca:</p>
            <input 
              type="email"
              onChange={e => setCarBrand(e.target.value)}
            />

            <div className={styles.formActionButton}>
              <button onClick={closeModalCreate}>Fechar</button>
              <button type="submit" onClick={CreateCar}>Criar</button>              
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
        <h2 style={{ textAlign: 'center' }}>Editar Carro</h2>        
        <div className={styles.modal}>
          <form onSubmit={(e) => EditCar(e)}>
            <p>Nome:</p>
            <input 
              type="text" 
              value={carModel}              
              onChange={e => setCarModel(e.target.value)}
            />
            
            <p>Email:</p>
            <input 
              type="email"
              value={carBrand}
              onChange={e => setCarBrand(e.target.value)}
            />

            <div className={styles.formActionButton}>
              <button onClick={closeModalEdit}>Fechar</button>
              <button type="submit" onClick={EditCar}>Criar</button>              
            </div>
          </form>
        </div>
      </Modal>

      <div>
        <div className={styles.header}>
          <button className={styles.addUser} onClick={openModalCreate}>
            Adicionar carro
          </button>
        </div>
        <table className={styles.users}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Modelo</th>              
              <th>Marca</th>                                    
            </tr>
          </thead>
          <tbody>
            {cars?.map((car) => {
              return (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td>{car.model}</td>
                  <td>{car.brand}</td>    
                  <td style={{ width: '150px' }}>                     
                    <button className={styles.tableActionButton} onClick={() => HandleEditCar(car.id)}>
                      <EditIcon />
                    </button>
                    <button className={styles.tableActionButton} onClick={() => DeleteCar(car.id)}>
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
