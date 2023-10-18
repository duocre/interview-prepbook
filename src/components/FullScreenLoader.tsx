import React from 'react';
import styles from '@/styles/FullScreenLoader.module.css';

export default function FullScreenLoader() {
  //   assert('Metronome', 'size', size, 'number')
  //   assert('Metronome', 'color', color, 'string')
  //   assert('Metronome', 'speed', speed, 'number')

  //   const size = 40;
  //   const color = 'black';
  //   const speed = 1.6;

  return (
    <div className={styles.container}>
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
}
