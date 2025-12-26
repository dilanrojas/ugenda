'use client';

import styles from './page.module.css';
import Calendar from '../components/calendar/Calendar';
import Courses from '../components/courses/Courses';
import Pending from '../components/pending/Pending';
import { CourseProvider } from '../context/CourseContext';

export default function Home() {
  return (
    <>
      <CourseProvider>
        <section className={styles.columnsLayout}>
          <Courses />
          <Calendar />
          <Pending />
        </section>
      </CourseProvider>
    </>
  )
}
