import React from 'react';

import styles from './styles.module.scss';

export function Home() {
  return (
    <div className={styles.container}>
      <h1>Bem-vindo ao sistema Localiza.</h1>
      
      <div>
        <p>Use a barra de sistema navegação para navegar entre as funcionalidades</p>      
        <p>xicodes - Todos os direitos reservados - 2021</p>
      </div>
    </div>
  )
}
