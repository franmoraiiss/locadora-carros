import React from 'react';
import styles from './styles.module.scss';

interface TitleProps {
  title: string;
}

export function TitleBar(props: TitleProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{props.title}</h1>
    </div>
  );
}
