import { Request, Response, Router } from 'express';
import { execute } from '../server/mysql.connector';
import { getUser } from '../utils/bd';

export class Routes {
  public static indexRoutes(router: Router) {
    router.get('/get-users', async (req: Request, res: Response) => {
      try {
        let users = await execute('SELECT * FROM `usuarios`', []);
        res.status(200).json(users);
      } catch (error) {
        res.send({
          status: 500,
          msg: 'Hubo un error consultando los usuarios por favor intente mas tarde',
        });
      }
    });

    router.post('/create-user', async (req: Request, res: Response) => {
      try {
        let data = req.body;
        let query = await execute<{ affectedRows: number }>(
          'INSERT INTO `usuarios` (`ID`, `NIT`, `CUENTA`, `USUARIO`, `SALDO`, `FECHA`, `OBSERVACIONES`) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
          [
            data.nit,
            data.cuenta,
            data.usuario,
            data.saldo,
            new Date(),
            data.observaciones,
          ]
        );

        if (query.affectedRows > 0) {
          res.status(200).send({ msg: 'EL usuario se creo exitosdamente' });
        } else {
          res.status(300).send({ msg: 'El usuario no se creo' });
        }
      } catch (error) {
        console.log(error);
        res.send({
          status: 500,
          msg: 'Hubo un error creando los usuarios por favor intente mas tarde',
        });
      }
    });

    router.delete('/delete-user/:id', async (req: Request, res: Response) => {
      try {
        let id = req.params.id;

        const user = await getUser(Number(id));

        if (user && user.RowDataPacket && user.RowDataPacket.ID) {
          let query = await execute<{ affectedRows: number }>(
            'delete from `usuarios` where ID = ?',
            [id]
          );

          if (query.affectedRows > 0) {
            res
              .status(200)
              .send({ msg: 'EL usuario se elimino exitosdamente' });
          } else {
            res.status(300).send({
              msg: 'El usuario no se pudo eliminar intentelo mas tarde',
            });
          }
        } else {
          res.status(404).send({
            msg: 'El usuario no existe por favor verifique la informacion',
          });
        }
      } catch (error) {
        console.log(error);
        res.send({
          status: 500,
          msg: 'Hubo un error eliminando el usuario',
        });
      }
    });

    router.put('/update-user/:id', async (req: Request, res: Response) => {
      try {
        let id = req.params.id;

        const body = req.body;
        const user = await getUser(Number(id));

        if (user && user.length) {
          let query = await execute<{ affectedRows: number }>(
            'UPDATE `usuarios` SET `NIT` = ? , `USUARIO` = ?, `OBSERVACIONES` = ? WHERE `usuarios`.`ID` = ?',
            [body.nit, body.usuario, body.observacion, id]
          );

          if (query.affectedRows > 0) {
            res
              .status(200)
              .send({ msg: 'EL usuario se actualizo exitosdamente' });
          } else {
            res.status(300).send({
              msg: 'El usuario no se pudo actualizar intentelo mas tarde',
            });
          }
        } else {
          res.status(404).send({
            msg: 'El usuario no existe por favor verifique la informacion',
          });
        }
      } catch (error) {
        console.log(error);
        res.send({
          status: 500,
          msg: 'Hubo un error actualizando el usuario',
        });
      }
    });
  }
}

export default Routes;
