/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const RepliesTableTestHelper = {
  async addReply ({
    id = 'reply-123',
    content = 'lorem ipsum',
    owner = 'user-123',
    comment = 'comment-123'
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4)',
      values: [id, content, owner, comment]
    }

    await pool.query(query)
  },

  async findReplyById (id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id=$1 AND is_deleted=FALSE',
      values: [id]
    }

    const result = await pool.query(query)

    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM replies WHERE 1=1')
  }
}

module.exports = RepliesTableTestHelper
