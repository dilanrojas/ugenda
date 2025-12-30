'use client';

import styles from './Courses.module.css';
import { useCourse } from '../../context/CourseContext';
import { useState } from 'react';
import { Course } from '../../types/Course';
import { AddIcon } from '../../assets/Icons';

export default function Courses() {
  const { courses, setCourses, filter, setFilter, clearFilter } = useCourse();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const isCourseActive = (course: Course) => {
    if (filter === 'all') return false;

    if (course.code) {
      return filter === course.code;
    }

    return filter === course.title;
  };

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

  // const handleCourseClick = (
  //   course: Course,
  //   index: number
  // ) => {
  //   setTitle(course.title);
  //   setCode(course.code ?? "");
  //
  //   setSelectedIndex(index);
  //   setIsAdding(true);
  // };

  const handleCourseClick = (course: Course) => {
    setFilter(() => {
      if (course.code) return course.code;
      return course.title
    });
  }

  return (
    <aside className='sidebar'>
      <header className='sidebarHeader'>
        <h1>Cursos</h1>
        <button onClick={handleAddClick}><span>Agregar</span> <AddIcon /></button>
      </header>
      <ul className='flow'>
        <li onClick={clearFilter}>
          <span className={filter === 'all' ? styles.active : ''}>Todos</span>
        </li>
        {courses.map((course, index) => (
          <li
            key={index}
            onClick={(e) => {
              e.preventDefault();
              handleCourseClick(course);
            }}
          >
            <span className={isCourseActive(course) ? styles.active : ''}>{course.title}</span>
          </li>
        ))}
      </ul>

      {/* Add course dialog */}
      <dialog className='modal' open={isAdding}>
        <div className='modalContent'>
          <h3>Curso</h3>
          <form method="dialog">
            <input
              placeholder='Título'
              type='text'
              name='task-title'
              id='task-title'
              value={title}
              onChange={handleTitleChange}
              minLength={1}
              maxLength={30}
            />
            <input
              placeholder='Sigla (Opcional)'
              type='text'
              name='task-code'
              id='task-code'
              value={code}
              onChange={handleCodeChange}
              minLength={1}
              maxLength={10}
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
