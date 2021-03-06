/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { Divider } from '../../components/Divider';
import { TitleBar } from '../../components/TitleBar';

import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import api from '../../services/api';

import styles from './styles.module.scss';

export interface CarProps {
  id?: number;
  name: string;
  brand: string;
  year: string;
  category: string;
  docNumber: string;
  licensePlate: string;
  timesRented: number;
  status: "RENTING" | "NOT_RENTING";
}

interface CategoryProps {
  id?: number;
  name: string;
}

export function Cars() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [car, setCar] = useState<CarProps>();
  
  const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);

  const [carID, setCarID] = useState<number>();
  const [carModel, setCarModel] = useState('');   
  const [carYear, setCarYear] = useState('');   
  const [carDocNumber, setCarDocNumber] = useState('');   
  const [carLicensePlate, setCarLicensePlate] = useState('');   
  const [carCategory, setCarCategory] = useState('');     
  const [carBrand, setCarBrand] = useState('');   
  const [carStatus, setCarStatus] = useState<string>("NOT_RENTING");

  const [carCategorys, setCarCategorys] = useState<CategoryProps[]>([]);

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
    setCarYear('');  
    setCarCategory('');
    setCarDocNumber('');    
    setCarLicensePlate('');   
    setCarStatus("NOT_RENTING");
  }

  async function getCars() {
    await api.get("/cars").then((response) => setCars(response.data));
  }  

  async function getCarCategorys() {
    await api.get("/car-category").then((response) => setCarCategorys(response.data));
  }

  useEffect(() => {
    getCars();    
    getCarCategorys();        
  }, []);

  async function CreateCar(event: React.FormEvent) {
    event.preventDefault();
    closeModalCreate();
    
    if(carModel && carBrand && carYear && carDocNumber && carLicensePlate && carCategory) {
      await api.post("/cars", {      
        name: carModel,
        brand: carBrand,
        year: carYear,
        docNumber: carDocNumber,
        licensePlate: carLicensePlate,
        category: carCategory,
        status: carStatus,
        timesRented: 0,
      });
    } else {
      alert("Preencha os campos corretamente!");           
    }

    setCarID(0);
    setCarModel('');
    setCarBrand('');
    setCarYear('');  
    setCarCategory('');
    setCarDocNumber('');    
    setCarLicensePlate('');
    setCarStatus("NOT_RENTING");   
    
    getCars();
  }

  async function EditCar(event: React.FormEvent) {
    event.preventDefault();
    closeModalEdit();
    
    if(carModel && carBrand && carYear && carDocNumber && carLicensePlate && carCategory && carStatus) {
      await api.patch(`/cars/${carID}`, {             
        name: carModel,
        brand: carBrand,
        year: carYear,
        docNumber: carDocNumber,
        licensePlate: carLicensePlate,
        category: carCategory,    
        status: carStatus    
      });
    } else {
      alert("Preencha os campos corretamente!");           
    }

    setCarID(0);
    setCarModel('');
    setCarBrand('');
    setCarYear('');  
    setCarCategory('');
    setCarDocNumber('');    
    setCarLicensePlate(''); 
    setCarStatus("NOT_RENTING");   
    
    getCars();
  }

  async function DeleteCar(id?: number) {
    if(cars![id! - 1].status === "RENTING") {
      alert("N??o ?? poss??vel deletar o carro pois existe um aluguel ativo com este carro");
    } else {
      const confirmation = confirm("Deletar carro?");  
    
      if(confirmation) {  
        const reason = prompt("Qual a raz??o da exclus??o do carro?");

        const car = await api.get(`/cars/${id}`);

        await api.post('/car-deleted/', {
          car: car.data,
          reason: reason
        });
        
        await api.delete(`/cars/${id}`);
        getCars();
      }
    }
  }

  async function HandleEditCar(id?: number) {       
    if(cars![id! - 1].status === "RENTING") {
      alert("N??o ?? poss??vel editar o carro pois existe um aluguel ativo com este carro");
    } else { 
      await api.get(`/cars/${id}`).then((response) => {
        setCar(response.data);               
      })    
      openModalEdit();
    }
  }

  useEffect(() => {
    if(car) { 
      setCarID(car.id);
      setCarModel(car.name);
      setCarBrand(car.brand);
      setCarYear(car.year);  
      setCarCategory(car.category);
      setCarDocNumber(car.docNumber);    
      setCarLicensePlate(car.licensePlate);      
      setCarStatus(car.status);
    }    
  }, [car]);    

  return (
    <div className={styles.container}>
      <TitleBar title="Carros"/>
      <Divider />

      <Modal
        id="createCar"
        contentLabel="createCar"
        isOpen={modalCreateIsOpen}        
        onRequestClose={closeModalCreate}   
        ariaHideApp={false}              
      >
        <h2 style={{ textAlign: 'center' }}>Cadastrar carro</h2>        
        <div className={styles.modal}>
          <form onSubmit={(e) => CreateCar(e)}>
            <p>Nome do carro:</p>
            <input 
              type="text" 
              onChange={e => setCarModel(e.target.value)}
            />
            
            <p>Marca:</p>
            <input 
              type="text"
              onChange={e => setCarBrand(e.target.value)}
            />
            
            <p>Ano:</p>
            <input 
              type="text"
              onChange={e => setCarYear(e.target.value)}
            />

            <p>Categoria:</p>
            <select 
              onChange={e => setCarCategory(e.target.value)}              
            >
              <option hidden>Selecione uma op????o</option>
              {carCategorys.map((category, index) => {                
                return (
                  <option key={index}>{category.name}</option>
                );
              })}
            </select>

            <p>N??mero do documento do carro:</p>
            <input 
              type="text"
              onChange={e => setCarDocNumber(e.target.value)}
            />

            <p>Placa do carro:</p>
            <input 
              type="text"
              onChange={e => setCarLicensePlate(e.target.value)}
            />

            <div className={styles.formActionButton}>
              <button onClick={closeModalCreate}>Fechar</button>
              <button type="submit" onClick={CreateCar}>Criar</button>              
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        id="editCar"
        contentLabel="editCar"
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
            
            <p>Marca:</p>
            <input 
              type="text"
              value={carBrand}
              onChange={e => setCarBrand(e.target.value)}
            />

             
            <p>Ano:</p>
            <input 
              type="text"
              value={carYear}
              onChange={e => setCarYear(e.target.value)}
            />

            <p>Categoria:</p>
            <select value={carCategory} onChange={e => setCarCategory(e.target.value)}>
              {carCategorys.map((category, index) => {
                return (
                  <option key={index}>{category.name}</option>
                );
              })}
            </select>

            <p>N??mero do documento do carro:</p>
            <input 
              type="text"
              value={carDocNumber}
              onChange={e => setCarDocNumber(e.target.value)}
            />

            <p>Placa do carro:</p>
            <input 
              type="text"
              value={carLicensePlate}
              onChange={e => setCarLicensePlate(e.target.value)}
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
          <button className={styles.addCar} onClick={openModalCreate}>
            Adicionar carro
          </button>
        </div>
        <table className={styles.cars}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do carro</th>              
              <th>Marca</th>                                    
              <th>Categoria</th>                                                                      
              <th>Placa</th>      
              <th>Status</th>      
              <th>A????es</th>                              
            </tr>
          </thead>
          <tbody>
            {cars?.map((car) => {
              return (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td>{car.name}</td>
                  <td>{car.brand}</td>    
                  <td>{car.category}</td>    
                  <td>{car.licensePlate}</td>    
                  <td>{car.status === 'RENTING' ? 'ALUGANDO' : 'DISPON??VEL'}</td>    
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
