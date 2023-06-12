const routes = (handler) => ([
    {
        method: 'PUT',
        path: '/threads/{threadId}/comments/{commentId}/likes',
        handler: handler.putLikeCommentHandler,
        options: {
            auth: 'forumapi_jwt'
        }
    }
])

export default routes
