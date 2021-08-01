import { Divider } from "@material-ui/core";
import { useEffect, useState } from "react";
import { TitleBar } from "../../components/TitleBar";
import api from "../../services/api";
import { CarProps } from "../Cars";

import styles from './styles.module.scss';

interface CashProps {
  id?: number;
  total: number;
  rents: number;
}

export function Reports() {

  const [cars, setCars] = useState<CarProps[]>();
  const [totalRent, setTotalRent] = useState<CashProps>();

  async function getCars() {
    await api.get("/cars").then((response) => setCars(response.data));
  }  

  async function getTotalRent() {
    await api.get("/cash/1").then((response) => setTotalRent(response.data));
  }    

  useEffect(() => {
    getCars();
    getTotalRent();
  }, []);

  function getPriceMd() {
    if(totalRent) {
      const priceMd = totalRent.total / totalRent.rents;
      return priceMd;
    } else {
      return 'Loading';
    }
  }

  function getCarPercentByTotalRent(timesRented: number) {
    if(totalRent) {
      const percent = timesRented / totalRent.rents ;
      return (percent * 100).toFixed(1);
    } else {
      return "Loading";
    }
  }

  return(
    <div className={styles.container}>
      <TitleBar title="Relatórios"/>
      <Divider />

      <div className={styles.rents}>
        <h3>Carros mais alugados</h3>

        <table className={styles.cars}>
          <thead>
            <tr>              
              <th>Nome do carro</th>              
              <th>Marca</th>                                    
              <th>Categoria</th>           
              <th>Número de aluguéis</th>     
              <th>Porcentagem sobre total</th>                                                                                                        
            </tr>
          </thead>
          <tbody>
            {cars?.sort((a, b) => b.timesRented - a.timesRented).map((car) => {
              return (
                <tr key={car.id}>                  
                  <td>{car.name}</td>
                  <td>{car.brand}</td>    
                  <td>{car.category}</td>    
                  <td>{car.timesRented}</td>    
                  <td>{getCarPercentByTotalRent(car.timesRented)}%</td>                      
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        {
          totalRent !== null && (
            <>
              <h3>Receita</h3>
              <table className={styles.cars}>
                <thead>
                  <tr>              
                    <th>Total de aluguéis</th>              
                    <th>Preço médio aluguel</th>
                    <th>Receita</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{totalRent?.rents}</td>
                    <td>R${getPriceMd()}</td>
                    <td>R${totalRent?.total}</td>
                  </tr>
                </tbody>
              </table>
            </>
          )
        }        
      </div>

      
    </div>
  );
}
