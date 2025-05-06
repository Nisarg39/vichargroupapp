import React, { createContext, useState, ReactNode } from 'react';
import { StudentData } from '../../src/types/interfaces';


interface StudentContextType {
  studentData: StudentData | null;
  setStudentData: React.Dispatch<React.SetStateAction<StudentData | null>>;
}

export const StudentContext = createContext<StudentContextType>({
  studentData: null,
  setStudentData: () => {},
});

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  return (
      <StudentContext.Provider value={{ studentData, setStudentData }}>
          {children}
      </StudentContext.Provider>
  );
};

export default StudentProvider;