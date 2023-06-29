import pool from '../../../../lib/db';

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { ids } = req.query;

        let query = 'SELECT * FROM custom_fields';
        if (ids) {
          const idList = ids.split(',').map(id => `'${id}'`).join(',');
          query += ` WHERE id IN (${idList})`;
        }

        const result = await pool.query(query);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: 'Error retrieving custom_fields', error });
      }
      break;
    case 'POST':
      try {
        const { accountId, title, type } = req.body;

        const result = await pool.query(
          'INSERT INTO custom_fields (accountId, title, type) VALUES (?, ?, ?)',
          [accountId, title, type]
        );

        res.status(201).json({ message: 'Custom field created', result });
      } catch (error) {
        res.status(500).json({ message: 'Error creating custom field', error });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
