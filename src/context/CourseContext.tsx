'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Task } from '../types/Task';
import { Course } from '../types/Course';

interface CourseContextType {
  pending: Task[]
  setPending: React.Dispatch<React.SetStateAction<Task[]>>
  courses: Course[]
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const defaultPending: Task = { title: 'Bienvenido/a', course: 'Organiza tu vida estudiantil', date: new Date().toLocaleDateString("en-CA").slice(0, 10) };
  const defaultCourses: Course = { title: 'Ugenda', code: 'UG-3532' };

  useEffect(() => {
    setPending([defaultPending]);
    setCourses([defaultCourses]);
  }, [])

  return (
    <CourseContext.Provider value={{
      pending: pending, setPending: setPending,
      courses: courses, setCourses: setCourses
    }}>
      {children}
    </CourseContext.Provider>
  )
}

export function useCourse() {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }

  return context;
}
