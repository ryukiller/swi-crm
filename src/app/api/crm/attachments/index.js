import pool from '../../../../lib/db';

async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { ids } = req.query;
                let query = 'SELECT * FROM attachments';
                if (ids) {
                    const idList = ids
                        .split(',')
                        .map((id) => `'${id}'`)
                        .join(',');
                    query += ` WHERE id IN (${idList})`;
                }

                const result = await pool.query(query);
                res.status(200).json(result);
            } catch (error) {
                res.status(500).json({ message: 'Error retrieving attachments', error });
            }
            break;
        case 'POST':
            try {
                const { authorId, name, createdDate, version, type, contentType, size } = req.body;
                const result = await pool.query('INSERT INTO attachments (authorId, name, createdDate, version, type, contentType, size) VALUES (?, ?, ?, ?, ?, ?, ?)', [authorId, name, createdDate, version, type, contentType, size]);

                res.status(201).json({ message: 'Attachment created', result });
            } catch (error) {
                res.status(500).json({ message: 'Error creating attachment', error });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default handler;
