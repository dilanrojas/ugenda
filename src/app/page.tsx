import styles from './page.module.css';
import Calendar from '../components/calendar/Calendar';
import Sidebar from '../components/sidebar/Sidebar';

export default function Home() {
  return (
    <>
      <section className={styles.columnsLayout}>
        <Sidebar />
        <Calendar />
      </section>
    </>
  )
}
