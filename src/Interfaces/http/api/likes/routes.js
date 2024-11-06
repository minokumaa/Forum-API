const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: (request, h) => handler.putLikeComment(request, h),
    options: {
      auth: 'forum_api_jwt'
    }
  }
])

module.exports = routes
