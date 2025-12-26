'use client';

import styles from './Pending.module.css';
import { useCourse } from '@/context/CourseContext';
import { useState } from 'react';
import { Task } from '../../types/Task';

export default function Pending() {
  const { pending, setPending, courses } = useCourse();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const handleSave = () => {
    // TODO --> Add notifications (avoid alerts)

    if (!title && !course && !date) {
      alert("Ingrese los datos correspondientes");
      return;
    }
    if (!title) {
      alert("Digite un título válido");
      return;
    }

    if (!course) {
      alert("Digite un curso válido");
      return;
    }

    if (!date) {
      alert("Digite una fecha válida");
      return;
    }

    setPending(prev => {
      // TODO --> Add completed flag

      // EDIT
      if (selectedIndex !== null) {
        return prev.map((task, i) =>
          i === selectedIndex
            ? { title, course, date }
            : task
        );
      }

      // ADD
      return [...prev, { title, course, date }];
    });

    clearData();
    setSelectedIndex(null);
    setIsAdding(false);
  }

  const handleDelete = () => {
    if (selectedIndex === null) return;

    setPending(prev =>
      prev.filter((_, i) => i !== selectedIndex)
    );

    clearData();
    setSelectedIndex(null);
    setIsAdding(false);
  };

  const clearData = () => {
    setTitle("");
    setCourse("");
    setDate("");
  }

  const handleAddClick = () => {
    setIsAdding((prev) => !prev)
  }

  const handleCancel = () => {
    clearData();
    setSelectedIndex(null);
    setIsAdding(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourse(e.target.value);
  };

  const handleTaskClick = (
    task: Task,
    index: number
  ) => {
    setTitle(task.title);
    setCourse(task.course);
    setDate(task.date);

    setSelectedIndex(index);
    setIsAdding(true);
  };

  const getDateStatus = (dateStr: string) => {
    // TODO --> Fix tomorrow tasks

    const today = new Date();
    const taskDate = new Date(dateStr);

    // Normalize dates (ignore time)
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    const diffMs = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Future
    if (diffDays > 0) {
      if (diffDays >= 30) {
        const months = Math.floor(diffDays / 30);
        return `Faltan ${months} mes${months > 1 ? "es" : ""}`;
      }

      return `Faltan ${diffDays} día${diffDays > 1 ? "s" : ""}`;
    }

    // Today
    if (diffDays === 0) {
      return "Vence hoy";
    }

    // Past
    const overdueDays = Math.abs(diffDays);

    if (overdueDays >= 30) {
      const months = Math.floor(overdueDays / 30);
      return `Vencido hace ${months} mes${months > 1 ? "es" : ""}`;
    }

    return `Vencido hace ${overdueDays} día${overdueDays > 1 ? "s" : ""}`;
  };

  return (
    <aside className={styles.pending}>
      <header className={styles.pendingHeader}>
        <h1>Pendientes</h1>
        <button onClick={handleAddClick}>+</button>
      </header>
      <ul className={`${styles.pendingList} flow`}>
        {pending && pending.map((task, index) => (
          <li key={index} onClick={(e) => {
            e.preventDefault();
            handleTaskClick(task, index);
          }}>
            <a href="#">
              {task.title} – {task.course}
              <br />
              <small>{getDateStatus(task.date)}</small>
            </a>
          </li>
        ))}
      </ul>

      {/* Add task dialog */}
      <dialog className={styles.addModal} open={isAdding}>
        <div className={styles.addModalContent}>
          <h3>Editar tarea</h3>
          <form method="dialog">
            <input
              placeholder='Título'
              type='text'
              name='task-title'
              id='task-title'
              value={title}
              onChange={handleTitleChange}
              minLength={1}
              maxLength={15}
            />
            <select name='courses' id='course-select' value={course} onChange={handleCourseChange}>
              <option value=''>-- Seleccione un curso --</option>
              {courses && courses.map((course, index) => (
                <option key={index} value={course.title}>
                  {course.title}
                  {course.code && ` (${course.code})`}
                </option>
              ))}
            </select>
            <input
              type="date"
              id="start"
              name="trip-start"
              value={date}
              onChange={handleDateChange}
              min={`${new Date().getFullYear()}-01-01`}
              max={`${new Date().getFullYear() + 10}-12-31`}
            />
            <button type="button" onClick={handleSave}>Guardar</button>
            {selectedIndex !== null && (
              <button
                type="button"
                onClick={handleDelete}
                style={{ color: 'red' }}
              >
                Eliminar
              </button>
            )}
            <button type="button" onClick={handleCancel}>Cancelar</button>
          </form>
        </div>
      </dialog>
    </aside>
  )
}
