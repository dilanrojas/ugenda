'use client';

import styles from './Sidebar.module.css';

export default function sidebar() {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.sidebarHeader}>
        <h1>Cursos</h1>
        <button>+</button>
      </header>
      <ul className='flow'>
        <li><a href='#' className={styles.active}>Todos</a></li>
        <li><a href='#'>Seminario</a></li>
        <li><a href='#'>Desarrollo de software II</a></li>
        <li><a href='#'>Cálculo I</a></li>
        <li><a href='#'>Apreciación del cine</a></li>
      </ul>
    </aside>
  )
}
