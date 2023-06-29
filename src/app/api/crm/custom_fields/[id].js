import pool from '../../../../lib/db';

async function handler(req, res) {
  const {id} = req.query;

  switch (method) {
    case 'PUT':
      try {
        const { accountId, title, type } = req.body;

        await pool.query(
          'UPDATE custom_fields SET accountId = ?, title = ?, type = ? WHERE id = ?',
          [accountId, title, type, id]
        );

        res.status(200).json({ message: 'Custom field updated' });
      } catch (error) {
        res.status(500).json({ message: 'Error updating custom field', error });
      }
      break;
    case 'DELETE':
      try {
        await pool.query('DELETE FROM custom_fields WHERE id = ?', [id]);
        res.status(200).json({ message: 'Custom field deleted' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting custom field', error });
      }
      break;
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
