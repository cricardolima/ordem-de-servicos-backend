import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltRounds = process.env.SALT_ROUNDS as string;
  return await bcrypt.hash(password, Number(saltRounds));
};
