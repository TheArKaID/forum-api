const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.postCommentHandler,
        options: {
            auth: 'forumapi_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: handler.deleteCommentByIdHandler,
        options: {
            auth: 'forumapi_jwt'
        }
    }
])

export default routes
