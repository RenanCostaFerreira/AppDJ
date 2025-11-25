export type User = {
  name: string;
  email: string;
  password?: string;
  role?: 'funcionario' | 'responsavel' | 'aluno';
  cpf?: string;
  avatar?: string | null;
};

export default User;
