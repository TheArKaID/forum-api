exports.up = (pgm) => {
    pgm.createTable('likes', {
        id: {
            type: 'varchar(50)',
            primaryKey: true
        },
        owner_id: {
            type: 'varchar(50)',
            references: '"users"',
            notNull: true,
            onDelete: 'cascade'
        },
        comment_id: {
            type: 'varchar(50)',
            references: '"comments"',
            notNull: true,
            onDelete: 'cascade'
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
        }
    })
}

exports.down = (pgm) => {
    pgm.dropTable('likes')
}
