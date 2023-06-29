import pool from '../../../../lib/db';

async function handler(req, res) {
    const { id } = req.query;

    switch (method) {
        case 'PUT':
            try {
                const { authorId, text, updatedDate, createdDate } = req.body;

                await pool.query('UPDATE comments SET authorId = ?, text = ?, updatedDate = ?, createdDate = ? WHERE id = ?', [authorId, text, updatedDate, createdDate, id]);

                res.status(200).json({ message: 'Comment updated' });
            } catch (error) {
                res.status(500).json({ message: 'Error updating comment', error });
            }
            break;
        case 'DELETE':
            try {
                await pool.query('DELETE FROM comments WHERE id = ?', [id]);
                res.status(200).json({ message: 'Comment deleted' });
            } catch (error) {
                res.status(500).json({ message: 'Error deleting comment', error });
            }
            break;
        default:
            res.setHeader('Allow', ['PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default handler;
