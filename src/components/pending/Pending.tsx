'use client';

import styles from './Pending.module.css';
import { useCourse } from '@/context/CourseContext';

export default function Pending() {
  const { pending } = useCourse();
  return (
    <aside className={styles.pending}>
      <header className={styles.pendingHeader}>
        <h1>Pendientes</h1>
      </header>
      <ul className={styles.pendingList}>
        {pending && pending.map((task, id) => (
          <li key={id}>
            <a href='#'>{task.title} - {task.course}</a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
