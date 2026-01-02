'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Task } from '../types/Task';
import { Course } from '../types/Course';

export type FilterType = 'all' | string

interface CourseContextType {
  pending: Task[]
  setPending: React.Dispatch<React.SetStateAction<Task[]>>
  courses: Course[]
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>
  filter: FilterType
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>
  clearFilter: () => void
  data: Task[]
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  const defaultCourse: Course = { title: 'Ugenda', code: 'UG-3532' };
  const defaultPendingCourse: Course = defaultCourse;
  const defaultPending: Task = { title: 'Bienvenido/a', course: defaultPendingCourse, date: new Date().toLocaleDateString("en-CA").slice(0, 10) };

  useEffect(() => {
    setPending([defaultPending]);
    setCourses([defaultCourse]);
  }, [])

  const clearFilter = () => {
    setFilter('all');
  }

  const getFilteredPending = (filter: FilterType) => {
    if (filter !== 'all') return pending.filter((e) => e.course.title === filter || e.course.code && e.course.code === filter)
    return pending
  }

  const data = getFilteredPending(filter)

  return (
    <CourseContext.Provider value={{
      pending: pending, setPending: setPending,
      courses: courses, setCourses: setCourses,
      filter: filter, setFilter: setFilter,
      clearFilter: clearFilter,
      data
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
