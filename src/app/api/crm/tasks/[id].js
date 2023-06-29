import pool from '../../../../lib/db';

async function handler(req, res) {
    const {id} = req.query;

    switch (method) {
        case 'PUT':
            try {
                const { accountId, title, description, briefDescription, status, importance, createdDate, updatedDate, scope, customStatusId, hasAttachments, attachmentCount, permalink, priority, folderId } = req.body;

                await pool.query(
                    'UPDATE tasks SET accountId = ?, title = ?, description = ?, briefDescription = ?, status = ?, importance = ?, createdDate = ?, updatedDate = ?, scope = ?, customStatusId = ?, hasAttachments = ?, attachmentCount = ?, permalink = ?, priority = ?, folderId = ? WHERE id = ?',
                    [accountId, title, description, briefDescription, status, importance, createdDate, updatedDate, scope, customStatusId, hasAttachments, attachmentCount, permalink, priority, folderId, id]
                );

                res.status(200).json({ message: 'Task updated' });
            } catch (error) {
                res.status(500).json({ message: 'Error updating task', error });
            }
            break;
        case 'DELETE':
            try {
                await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
                res.status(200).json({ message: 'Task deleted' });
            } catch (error) {
                res.status(500).json({ message: 'Error deleting task', error });
            }
            break;
        default:
            res.setHeader('Allow', ['PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default handler;
