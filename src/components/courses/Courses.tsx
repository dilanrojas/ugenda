'use client';

import styles from './Courses.module.css';
import { useCourse } from '../../context/CourseContext';
import { useState } from 'react';
import { Course } from '../../types/Course';

export default function Courses() {
  const { courses, setCourses } = useCourse();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  }

  const handleCancel = () => {
    clearData();
    setSelectedIndex(null);
    setIsAdding(false);
  };

  const handleSave = () => {
    // TODO --> Add notifications (avoid alerts)

    if (!title) {
      alert("Digite un título válido");
      return;
    }

    setCourses(prev => {
      // EDIT
      if (selectedIndex !== null) {
        return prev.map((task, i) =>
          i === selectedIndex
            ? { title, code }
            : task
        );
      }

      // ADD
      return [...prev, { title, code }];
    });

    clearData();
    setSelectedIndex(null);
    setIsAdding(false);
  }

  const handleDelete = () => {
    if (selectedIndex === null) return;

    setCourses(prev =>
      prev.filter((_, i) => i !== selectedIndex)
    );

    clearData();
    setSelectedIndex(null);
    setIsAdding(false);
  };

  const clearData = () => {
    setTitle("");
    setCode("");
  }

  const handleAddClick = () => {
    setIsAdding((prev) => !prev)
  }

  const handleTaskClick = (
    course: Course,
    index: number
  ) => {
    setTitle(course.title);
    setCode(course.code ?? "");

    setSelectedIndex(index);
    setIsAdding(true);
  };

  return (
    <aside className={styles.courses}>
      <header className={styles.coursesHeader}>
        <h1>Cursos</h1>
        <button onClick={handleAddClick}>+</button>
      </header>
      <ul className='flow'>
        {courses && courses.map((course, index) => (
          <li key={index} onClick={(e) => {
            e.preventDefault();
            handleTaskClick(course, index);
          }}>
            <a href='#'>{course.title}</a>
          </li>
        ))}
      </ul>

      {/* Add course dialog */}
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
            <input
              placeholder='Sigla (Opcional)'
              type='text'
              name='task-code'
              id='task-code'
              value={code}
              onChange={handleCodeChange}
              minLength={1}
              maxLength={25}
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
