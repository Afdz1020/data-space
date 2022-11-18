import { execute } from '../server/mysql.connector';

export const getUser = async (id: number) => {
  try {
    let user = await execute<any>('SELECT * FROM `usuarios` WHERE ID=?', [id]);

    return user;
  } catch (error) {
    console.log({ error });
    return null;
  }
};
