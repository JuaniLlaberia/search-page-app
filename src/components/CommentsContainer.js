import CommentItem from "./CommentItem"

const CommentsContainer = ({commentList, postId, crrUser}) => {
    const commentsToRender = commentList?.map(comment => {
        return <CommentItem key={comment.commentId} crrUser={crrUser} commentId={comment.commentId} postId={postId}  userName={comment.userName} commentBody={comment.commentBody} userImg={comment.userImg}/>
    })

  return (
    <ul className='comments-container'>
      {commentsToRender}
    </ul>
  )
}

export default CommentsContainer