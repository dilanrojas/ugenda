'use client';

import styles from './Calendar.module.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useRef } from 'react';
import { useCourse } from '../../context/CourseContext';

export default function Calendar() {
  const [date, setDate] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const inputCourse = useRef<HTMLInputElement>(null);
  const inputTitle = useRef<HTMLInputElement>(null);

  const { pending, setPending } = useCourse();

  console.log(pending);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleDateClick = (arg: any) => {
    alert(arg.dateStr)
  }

  const handleTaskClick = () => {
    setIsEditing((prev) => !prev)
  }

  const handleEdit = () => {
    if (!inputCourse.current) return; // TODO --> Error handling;
    if (!inputTitle.current) return;
    if (date === "") return;

    setPending([
      { title: inputTitle.current.value, date: date, editable: false, course: inputCourse.current.value }
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
        events={pending}
        eventClick={handleTaskClick}
      />
      <dialog className={styles.addModal} open={isEditing}>
        <div className={styles.addModalContent}>
          <h3>Editar tarea</h3>
          <form method="dialog">
            <input
              placeholder='Título'
              type='text'
              name='task-name'
              id='task-name'
              ref={inputTitle}
              minLength={1}
              maxLength={15}
            />
            <input
              placeholder='Curso'
              type='text'
              name='task-course'
              id='task-course'
              ref={inputCourse}
              minLength={1}
              maxLength={25}
            />
            <input
              type="date"
              id="start"
              name="trip-start"
              onChange={handleDateChange}
              min="2025-01-01"
              max="2026-12-31"
            />
            <button onClick={handleEdit}>Editar</button>
          </form>
        </div>
      </dialog>
    </div>
  )
}
