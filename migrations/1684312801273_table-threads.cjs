exports.up = (pgm) => {
    pgm.createTable('threads', {
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
        title: {
            type: 'varchar(255)',
            notNull: true
        },
        body: {
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
        }
    })
}

exports.down = (pgm) => {
    pgm.dropTable('threads')
}
