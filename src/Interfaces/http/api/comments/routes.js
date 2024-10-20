const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: (request, h) => handler.postCommentHandler(request, h),
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: (request, h) => handler.deleteCommentHandler(request, h),
    },
]);
  
module.exports = routes;