import pool from '../../../../lib/db';

async function handler(req, res) {
    const { id } = req.query;

    switch (method) {
        case 'PUT':
            try {
                const { authorId, name, createdDate, version, type, contentType, size } = req.body;

                await pool.query('UPDATE attachments SET authorId = ?, name = ?, createdDate = ?, version = ?, type = ?, contentType = ?, size = ? WHERE id = ?', [authorId, name, createdDate, version, type, contentType, size, id]);

                res.status(200).json({ message: 'Attachment updated' });
            } catch (error) {
                res.status(500).json({ message: 'Error updating attachment', error });
            }
            break;
        case 'DELETE':
            try {
                await pool.query('DELETE FROM attachments WHERE id = ?', [id]);
                res.status(200).json({ message: 'Attachment deleted' });
            } catch (error) {
                res.status(500).json({ message: 'Error deleting attachment', error });
            }
            break;
        default:
            res.setHeader('Allow', ['PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default handler;
