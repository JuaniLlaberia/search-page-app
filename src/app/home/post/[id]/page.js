'use client'

import { db } from "@/firebase_config";
import { doc, getDoc, onSnapshot} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useParams} from "next/navigation"
import { useEffect, useState } from "react";
import '../../../../assets/post.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faHeart, faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart, faBookmark as fullBookMark} from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "@/context/AuthContext";
import CreateComment from "@/components/CreateComment";
import CommentsContainer from "@/components/CommentsContainer";
import EditPost from "@/components/EditPost";
import DeletePost from "@/components/DeletePost";
import { formatDate } from "@/utils/formatDate";
import { addLike } from "@/utils/addLike";
import { unLike } from "@/utils/unLike";
import { useTheme } from "@/context/ThemeContext";
import PostSkeleton from "@/components/PostSkeleton";
import { removeFav } from "@/utils/removeFav";
import { addFav } from "@/utils/addFav";

const PostPage = () => {
  const {currentAcc, userData} = useAuthContext();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const docRef = doc(db, 'posts', id)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDelete, setModalOpenDelete] = useState(false);
  const {theme} = useTheme();
  const [userImg, setUserImg] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsuscribe = onSnapshot(docRef, snapshot => {
      setPost(snapshot.data());
    })
    setTimeout(() => {
      setLoading(false);
    }, 3000)
    return unsuscribe
  }, [id]);

  const isLikedByUser = post?.likedBy?.some(user => user === userData?.username)
  const isSaved = userData?.savedPosts?.some(postId => postId === id)

  useEffect(() => {
    const test = async () => {
      if(!post) return;
      const data = await getDoc(post.imgRef);
      setUserImg(data.data().userImg);
  };
    test()
  }, [post]);

  return (
    <main className={`post-page ${theme === 'light' ? 'light' : ''}`}>
      {!loading ? <>
      <div className='post-page-contaiener'>
        <div className='post-top-section'>
            <Link href={post?.userName === userData?.username ? '/home/my-profile' : `/home/profile/${post?.userName}`} style={{display:'flex', alignItems:'center', gap:'10px'}}>
              {userImg ? <Image draggable={false} src={userImg} width={50} height={50} alt="user"/> : null}
              @{post?.userName}
              {post?.updated && <span className='edited'>(edited)</span>}
            </Link>
          <p>{formatDate(post?.date?.seconds)}</p>
        </div>
        <p className='post-body'>{post?.postBody}</p>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', borderBottom:'1px solid rgba(255, 255, 255, 0.105)'}}>
          {post?.imgPath ? <Image draggable={false} className="post-img" src={post?.imgPath} width={400} alt="preview" height={300}/> : null}
        </div>
        <div className='profile-post-btns'>
          <div style={{display:'flex', gap:'5px'}}>
            {currentAcc?.uid === post?.createdBy && <div style={{color:'white'}}>{post?.likesNum}</div>}
            {isLikedByUser ? <button onClick={() => unLike(id, userData?.username)} className="post-btn"><FontAwesomeIcon size="2x" icon={fullHeart} color="#ff5747"/></button> : <button onClick={() => addLike(id, userData?.username, post?.userName)} className="post-btn"><FontAwesomeIcon size="2x" icon={faHeart}/></button>}
          </div>
          {isSaved ? <button onClick={() => removeFav(id, userData?.userId)} className="post-btn"><FontAwesomeIcon size="2x" icon={fullBookMark}/></button> : <button onClick={() => addFav(id, userData?.userId)} className="post-btn"><FontAwesomeIcon size="2x" icon={faBookmark}/></button>}
          {/* <button className="post-btn"><FontAwesomeIcon size="2x" icon={faBookmark}/></button> */}
          {currentAcc?.uid === post?.createdBy ? <>
              <button className="post-btn" onClick={() => setModalOpen(true)}><FontAwesomeIcon size="2x" icon={faPenToSquare}/></button>
              <button className="post-btn" onClick={() => setModalOpenDelete(true)}><FontAwesomeIcon size="2x" icon={faTrashCan}/></button>
            </> : null}
        </div>
        <CreateComment postId={id}/>
      </div>
      <CommentsContainer commentList={post?.comments} postId={id} crrUser={userData?.username}/>
      </> : <PostSkeleton/>}
      {modalOpen && <EditPost toggleModal={() => setModalOpen(false)} body={post?.postBody} docID={id}/>}
      {modalOpenDelete && <DeletePost toggleModal={() => setModalOpenDelete(false)} docID={id} photoPath={post?.imgPath}/>}
    </main>
  )
}

export default PostPage