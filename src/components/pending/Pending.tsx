'use client';

import styles from './Pending.module.css';
import { useCourse } from '@/context/CourseContext';
import { useState } from 'react';
import { Task } from '../../types/Task';
import { Course } from '../../types/Course';
import { AddIcon } from '../../assets/Icons';

export default function Pending() {
  const { setPending, courses, data } = useCourse();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [course, setCourse] = useState<Course>();
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
      alert("Seleccione un curso válido");
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
    setCourse(undefined);
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
    const selectedCode = e.target.value;

    const selectedCourse = courses.find(
      (c) => c.code === selectedCode
    );

    setCourse(selectedCourse);
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

  const pluralize = (value: number, singular: string) =>
    `${value} ${value === 1 ? singular : singular + 's'}`;

  const dateDiffInDays = (a: Date, b: Date): number => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  };

  const getDateStatus = (dateStr: string): string => {
    const today = new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    const taskDate = new Date(y, m - 1, d);

    const diffDays = dateDiffInDays(today, taskDate);
    const absDays = Math.abs(diffDays);

    if (diffDays === 0) return 'Vence hoy';

    // YEARS (only years)
    if (absDays >= 365) {
      const years = Math.floor(absDays / 365);
      return diffDays > 0
        ? `Vence en ${pluralize(years, 'año')}`
        : `Vencido hace ${pluralize(years, 'año')}`;
    }

    // MONTHS (only months)
    if (absDays >= 30) {
      const months = Math.floor(absDays / 30);
      return diffDays > 0
        ? `Vence en ${pluralize(months, 'mes')}`
        : `Vencido hace ${pluralize(months, 'mes')}`;
    }

    // WEEKS + DAYS (only for soon dates)
    if (absDays >= 7) {
      const weeks = Math.floor(absDays / 7);
      const days = absDays % 7;

      const parts = [
        pluralize(weeks, 'semana'),
        days ? pluralize(days, 'día') : null,
      ]
        .filter(Boolean)
        .join(' y ');

      return diffDays > 0
        ? `Vence en ${parts}`
        : `Vencido hace ${parts}`;
    }

    // DAYS ONLY
    return diffDays > 0
      ? `Vence en ${pluralize(absDays, 'día')}`
      : `Vencido hace ${pluralize(absDays, 'día')}`;
  };

  return (
    <aside className='sidebar'>
      <header className='sidebarHeader'>
        <h1>Pendientes</h1>
        <button onClick={handleAddClick}><span>Agregar</span> <AddIcon /></button>
      </header>
      <ol className={`${styles.pendingList} flow`}>
        {data && data.map((task, index) => (
          <li key={index} onClick={(e) => {
            e.preventDefault();
            handleTaskClick(task, index);
          }}>
            <span>
              {task.title} – {task.course.title} {task.course.code && `(${task.course.code})`}
              <br />
              <small>{getDateStatus(task.date)}</small>
            </span>
          </li>
        ))}
      </ol>

      {/* Add task dialog */}
      <dialog className='modal' open={isAdding}>
        <div className='modalContent'>
          <h3>Pendiente</h3>
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
            <select
              id="course-select"
              value={course?.code ?? ""}
              onChange={handleCourseChange}
            >
              <option value="">-- Seleccione un curso --</option>
              {courses.map((c, index) => (
                <option key={index} value={c.code}>
                  {c.title}
                  {c.code && ` (${c.code})`}
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
