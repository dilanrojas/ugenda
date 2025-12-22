'use client';

import styles from './Calendar.module.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from 'react';

export default function Calendar() {
  const [tasks, setTasks] = useState([
    { title: 'Tarea I', date: '2025-12-21', editable: true }
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const handleDateClick = (arg: any) => {
    alert(arg.dateStr)
  }

  const handleTaskClick = () => {
    setIsEditing((prev) => !prev)
  }

  const handleEdit = (title: string, date: string) => {
    setTasks([
      { title: title, date: date, editable: true }
    ])

    setIsEditing(false);
  }

  return (
    <div className={styles.calendarWrapper}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={handleDateClick}
        initialView="dayGridMonth"
        weekends={true}
        events={tasks}
        eventClick={handleTaskClick}
      />
      <dialog className={styles.addModal} open={isEditing}>
        <div className={styles.addModalContent}>
          <h3>Editar tarea</h3>
          <form method="dialog">
            <input
              placeholder='Curso'
              type='text'
              name='task-course'
              id='task-course'
              minLength={1}
              maxLength={25}
            />
            <input
              placeholder='Título'
              type='text'
              name='task-name'
              id='task-name'
              minLength={1}
              maxLength={15}
            />
            <input
              readOnly
              type="date"
              id="start"
              name="trip-start"
              value="2018-07-22"
              min="2025-01-01"
              max="2026-12-31"
            />
            <button onClick={() => handleEdit('prueba', '2025-12-21')}>Editar</button>
          </form>
        </div>
      </dialog>
    </div>
  )
}
