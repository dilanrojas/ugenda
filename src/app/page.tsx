'use client';

import styles from './page.module.css';
import Calendar from '../components/calendar/Calendar';
import Sidebar from '../components/sidebar/Sidebar';
import Pending from '../components/pending/Pending';
import { CourseProvider } from '../context/CourseContext';

export default function Home() {
  return (
    <>
      <CourseProvider>
        <section className={styles.columnsLayout}>
          <Sidebar />
          <Calendar />
          <Pending />
        </section>
      </CourseProvider>
    </>
  )
}
