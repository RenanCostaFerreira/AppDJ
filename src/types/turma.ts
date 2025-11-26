export type Turma = {
  id: string;
  name: string; // e.g., 'Turma A - Matemática'
  courseId?: string; // link to Course.id
  course?: string; // fallback: course title
  professor?: string; // professor name
  vacancies?: number; // available slots
  schedule?: string; // e.g., 'Seg, Qua - 19:00 às 21:00'
  students?: string[]; // array of student emails or IDs
};

export default Turma;
