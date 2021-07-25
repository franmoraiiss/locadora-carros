import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface CarsProps {
  modelo: string;
  marca: string;
}

interface UserProps {
  name: string;
  password: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarsProps[]>();
  const [users, setUsers] = useState<UserProps[]>();

  function getUsers() {
    api.get("/users").then((response) => setUsers(response.data));
  }

  function getCars() {
    api.get("/cars").then((response) => setCars(response.data));
  }

  useEffect(() => {
    getUsers();
    getCars();
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
    <>      
      <div>
        <h2>Listagem Carros</h2>
        {cars?.map((car) => {
          return (
            <>
              <p>Carro {car.modelo}</p>
              <p>Modelo {car.marca}</p>
            </>
          );
        })}      
      </div>
      <div>
        <h2>Listagem Users</h2>

        {users?.map((user) => {
          return (
            <>
              <p>Carro {user.name}</p>
              <p>Modelo {user.password}</p>
            </>
          );
        })}

        <button onClick={CreateUser}>
          Create
        </button>
        <button onClick={() => DeleteUser(6)}>
          Delete
        </button>
      </div>
    </>
  );
}
