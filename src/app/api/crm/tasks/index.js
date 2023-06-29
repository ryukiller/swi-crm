import pool from '../../../../lib/db';

async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { ids } = req.query;

                let query = 'SELECT * FROM tasks';
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
                res.status(500).json({ message: 'Error retrieving tasks', error });
            }
            break;

        case 'POST':
            try {
                const { accountId, title, description, briefDescription, status, importance, createdDate, updatedDate, scope, customStatusId, hasAttachments, attachmentCount, permalink, priority, folderId } = req.body;

                const result = await pool.query(
                    'INSERT INTO tasks (accountId, title, description, briefDescription, status, importance, createdDate, updatedDate, scope, customStatusId, hasAttachments, attachmentCount, permalink, priority, folderId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [accountId, title, description, briefDescription, status, importance, createdDate, updatedDate, scope, customStatusId, hasAttachments, attachmentCount, permalink, priority, folderId]
                );

                res.status(201).json({ message: 'Task created', result });
            } catch (error) {
                res.status(500).json({ message: 'Error creating task', error });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default handler;
