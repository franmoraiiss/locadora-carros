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
  name: string;
  brand: string;

  year: string;
  docNumber: string;
  chassi: string;
  licensePlate: string;
  category: string;
  client: string;
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
  const [carCategory, setCarCategory] = useState("Sedan");     
  const [carBrand, setCarBrand] = useState('');   

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
    setCarCategory("Sedan");
    setCarDocNumber('');    
    setCarLicensePlate('');    
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
      });
    } else {
      alert("Preencha os campos corretamente!");           
    }

    setCarID(0);
    setCarModel('');
    setCarBrand('');
    setCarYear('');  
    setCarCategory("Sedan");
    setCarDocNumber('');    
    setCarLicensePlate('');    
    
    getCars();
  }

  async function EditCar(event: React.FormEvent) {
    event.preventDefault();
    closeModalEdit();
    
    if(carModel && carBrand && carYear && carDocNumber && carLicensePlate && carCategory) {
      await api.put(`/cars/${carID}`, {             
        name: carModel,
        brand: carBrand,
        year: carYear,
        docNumber: carDocNumber,
        licensePlate: carLicensePlate,
        category: carCategory,
      });
    } else {
      alert("Preencha os campos corretamente!");           
    }

    setCarID(0);
    setCarModel('');
    setCarBrand('');
    setCarYear('');  
    setCarCategory("Sedan");
    setCarDocNumber('');    
    setCarLicensePlate('');    
    
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
      setCarModel(car.name);
      setCarBrand(car.brand);

      setCarYear(car.year);  
      setCarCategory(car.category);
      setCarDocNumber(car.docNumber);    
      setCarLicensePlate(car.licensePlate);      
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
              type="email"
              onChange={e => setCarBrand(e.target.value)}
            />
            
            <p>Ano:</p>
            <input 
              type="text"
              onChange={e => setCarYear(e.target.value)}
            />

            <p>Categoria:</p>
            <select 
              onChange={e => {
                if(e.target.value.length > 1) {
                  setCarCategory(e.target.value);
                } else {
                  setCarCategory("Sedan");
                }              
              }}
            >
              {carCategorys.map((category, index) => {                
                return (
                  <option key={index}>{category.name}</option>
                );
              })}
            </select>

            <p>Número do documento do carro:</p>
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
            
            <p>Email:</p>
            <input 
              type="email"
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

            <p>Número do documento do carro:</p>
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
              <th>Ações</th>                              
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
