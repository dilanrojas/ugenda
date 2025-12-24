'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Task } from '../types/Task';

interface CourseContextType {
  pending: Task[]
  setPending: React.Dispatch<React.SetStateAction<Task[]>>
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Task[]>([]);
  const defaultPending: Task = { title: 'Bienvenido/a', course: 'Organiza tu vida estudiantil', date: new Date().toLocaleDateString("en-CA").slice(0, 10), editable: false };

  useEffect(() => {
    setPending([defaultPending])
  }, [])

  return (
    <CourseContext.Provider value={{ pending: pending, setPending: setPending }}>
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
