export interface Student {
  id?: string;
  nis: string;
  name: string;
  class_name: string;
  gender: 'L' | 'P';
}

export interface Transaction {
  id?: string;
  date: string;
  student_nis: string;
  unique_bk_number: string;
  // Join fields
  students?: {
    name: string;
    gender: string;
  };
}

export type ViewType = 'dashboard' | 'master' | 'transaction' | 'report';
