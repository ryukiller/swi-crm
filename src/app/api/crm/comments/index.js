import pool from '../../../../lib/db';

async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { ids } = req.query;

                let query = 'SELECT * FROM comments';
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
                res.status(500).json({ message: 'Error retrieving comments', error });
            }
            break;
        case 'POST':
            try {
                const { authorId, text, updatedDate, createdDate } = req.body;

                const result = await pool.query('INSERT INTO comments (authorId, text, updatedDate, createdDate) VALUES (?, ?, ?, ?)', [authorId, text, updatedDate, createdDate]);

                res.status(201).json({ message: 'Comment created', result });
            } catch (error) {
                res.status(500).json({ message: 'Error creating comment', error });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default handler;
