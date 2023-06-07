exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: {
            type: 'varchar(50)',
            primaryKey: true
        },
        thread_id: {
            type: 'varchar(50)',
            references: '"threads"',
            notNull: true,
            onDelete: 'cascade'
        },
        owner_id: {
            type: 'varchar(50)',
            references: '"users"',
            notNull: true,
            onDelete: 'cascade'
        },
        content: {
            type: 'text',
            notNull: true
        },
        created_at: {
            type: 'string',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        updated_at: {
            type: 'string',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        is_deleted: {
            type: 'boolean',
            notNull: true,
            default: 'false'
        }
    })
}

exports.down = (pgm) => {
    pgm.dropTable('comments')
}
