// custom_field_settings/[id].js
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../../lib/database'; // Adjust the path to your pool file

async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'PUT':
      try {
        const {
          customFieldId,
          inheritanceType,
          readOnly,
          decimalPlaces,
          useThousandsSeparator,
          aggregation,
        } = req.body;

        await pool.query(
          'UPDATE custom_field_settings SET customFieldId = ?, inheritanceType = ?, readOnly = ?, decimalPlaces = ?, useThousandsSeparator = ?, aggregation = ? WHERE id = ?',
          [customFieldId, inheritanceType, readOnly, decimalPlaces, useThousandsSeparator, aggregation, id]
        );

        res.status(200).json({ message: 'Custom field setting updated' });
      } catch (error) {
        res.status(500).json({ message: 'Error updating custom field setting', error });
      }
      break;
    case 'DELETE':
      try {
        await pool.query('DELETE FROM custom_field_settings WHERE id = ?', [id]);
        res.status(200).json({ message: 'Custom field setting deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting custom field setting', error });
    }
    break;
  default:
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
}
}

export default handler;
