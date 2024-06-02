import firestore from '@react-native-firebase/firestore'
import { Observable } from 'rxjs';

export const AddBlog = async (blogData) => {
    try {
        const collectionRef = firestore().collection('Blog');
        await collectionRef.add(blogData);
        console.log('Đã thêm blog mới vào Firestore');
    } catch (error) {
        console.error('Lỗi khi thêm blog mới vào Firestore:', error);
    }
}

export const updateBlogData = async (uid, NewBlogData) => {
    try {
        const useRef = firestore().collection('Blog').doc(uid);
        await useRef.update(NewBlogData);
    } catch (error) {
        console.log('Lỗi khi cập nhật thông tin blog:', error);
    }
}

export const deleteBlogData = async (uid) => {
    try {
        const collectionRef = firestore().collection('Blog').doc(uid);
        collectionRef.delete();
    } catch (error) {
        console.log('Lỗi khi xóa thông tin blog:', error)
    }
}

export const UserTotalBlog = (id, callback) => {
    try {
        const collectionRef = firestore().collection('Blog');

        return collectionRef.where('id_user', '==', id).where('status', '==', 'Approve')
            .onSnapshot((snapshot) => {
                const total = snapshot.size;
                callback(total);
            })
    } catch (error) {
        console.log(error)
    }
}

export const deleteBlogDataInApproveBlog = async (uid) => {
    try {
        const collectionRef = firestore().collection('ApproveBlog');
        const query = collectionRef.where('id_blog', '==', uid)

        const snapShot = await query.get();

        if (snapShot.empty) {
            return;
        }
        snapShot.forEach((doc) => {
            doc.ref.delete();
        })

    } catch (error) {
        console.log('Lỗi khi xóa thông tin blog:', error)
    }
}

export const deleteBlogDataInNotApproveBlog = async (uid) => {
    try {
        const collectionRef = firestore().collection('NotApproveBlog');
        const query = collectionRef.where('id_blog', '==', uid)

        const snapShot = await query.get();

        if (snapShot.empty) {
            return;
        }

        snapShot.forEach((doc) => {
            doc.ref.delete();
        })

    } catch (error) {
        console.log('Lỗi khi xóa thông tin blog:', error)
    }
}

export const getAllBlogData = (callback) => {
    try {
        const collectionRef = firestore().collection("Blog").where('status', '==', 'Approve');
        return collectionRef.onSnapshot((snapShot) => {
            const blog = []
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idblog = doc.id;
                blog.push({ idblog, ...data });
            })
            callback(blog);
        })
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getBlogDataByIdUser = (uid, callback) => {
    try {
        const collectionRef = firestore().collection("Blog")
        return collectionRef.where("id_user", "==", uid).onSnapshot((snapShot) => {
            const blog = []
            snapShot.forEach((doc) => {
                const data = doc.data()
                const idblog = doc.id;
                blog.push({ idblog, ...data });
            });
            callback(blog);
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getAllCommentData = (idblog, callback) => {
    try {
        const collectionRef = firestore().collection("BlogComments");
        return collectionRef.where("id_blog", "==", idblog).onSnapshot((snapShot) => {
            const comment = []
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idcomment = doc.id;
                comment.push({ idcomment, ...data });
            })
            callback(comment);
        })
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const addCommentData = async (commentData) => {
    try {
        const collectionRef = firestore().collection('BlogComments');
        await collectionRef.add(commentData);
        console.log('Đã thêm comment mới vào Firestore');
    } catch (error) {
        console.error('Lỗi khi thêm comment mới vào Firestore:', error);
    }
}

export const getAllReplyBlogComment = (idcomment, callback) => {
    try {
        const collectionRef = firestore().collection("ReplyBlogComments");
        return collectionRef.where("id_comment", "==", idcomment).onSnapshot((snapShot) => {
            const comment = []
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idreply = doc.id;
                comment.push({ idreply, ...data });
            })
            callback(comment);
        })
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const addReplyBlogCommentData = async (commentData) => {
    try {
        const collectionRef = firestore().collection('ReplyBlogComments');
        await collectionRef.add(commentData);
        console.log('Đã thêm comment mới vào Firestore');
    } catch (error) {
        console.error('Lỗi khi thêm comment mới vào Firestore:', error);
    }
}

export const getReplyCommentCount = (idComment, callback) => {
    try {
        const collectionRef = firestore().collection("ReplyBlogComments");
        const query = collectionRef.where("id_comment", "==", idComment);

        return query.onSnapshot((querySnapshot) => {
            const count = querySnapshot.size;
            callback(count);
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

export const AddToBlogLikes = async (data) => {
    try {
        const FavoriteRef = firestore().collection('BlogLikes');
        await FavoriteRef.add(data);
        console.log('Thêm vào bảng thành công ');
    } catch (error) {
        console.error('Lỗi khi thêm vào bảng:', error);
    }
}

export const DeleteFromBlogLikes = async (idBlog, userId) => {
    try {
        const collectionRef = firestore().collection('BlogLikes')
        const query = await collectionRef.where('id_blog', '==', idBlog).where('id_user', '==', userId).get();
        if (!query.empty) {
            query.forEach((doc) => {
                doc.ref.delete();
            })
            console.log('Đã xóa dữ liệu thành công');
        } else {
            console.log('Không tìm thấy dữ liệu cần xóa');
        }

    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu:', error);
    }
}

export const CheckUserLike = (userId, idBlog, callback) => {
    const favoriteRef = firestore().collection('BlogLikes');
    return favoriteRef
        .where('id_user', '==', userId)
        .where('id_blog', '==', idBlog)
        .onSnapshot((querySnapshot) => {
            if (!querySnapshot.empty) {
                callback(true);
            }
            else {
                callback(false);
            }
        }, (error) => {
            console.log('Error checking favorite existence:', error);
            callback(false);
        });
}

export const getBlogLikeCount = (idBlog, callback) => {
    try {
        const collectionRef = firestore().collection("BlogLikes");
        const query = collectionRef.where("id_blog", "==", idBlog);

        return query.onSnapshot((querySnapshot) => {
            const count = querySnapshot.size;
            callback(count);
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

export const getBlogCommentCount = (idBlog, callback) => {
    try {
        const collectionRef = firestore().collection("BlogComments");
        const query = collectionRef.where("id_blog", "==", idBlog);

        return query.onSnapshot((querySnapshot) => {
            const count = querySnapshot.size;
            callback(count);
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

export const getReplyBlogCommentCount = (idBlog, callback) => {
    try {
        const collectionRef = firestore().collection("ReplyBlogComments");
        const query = collectionRef.where("id_blog", "==", idBlog);

        return query.onSnapshot((querySnapshot) => {
            const count = querySnapshot.size;
            callback(count);
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

export const CheckUserLikeComment = (userId, idComment, callback) => {
    try {
        const favoriteRef = firestore().collection('CommentBlogLikes');
        return favoriteRef
            .where('id_user', '==', userId)
            .where('id_comment', '==', idComment)
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot.empty) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            })
    } catch (error) {
        console.log('Error checking favorite existence:', error);
        callback(false);
    }
}

export const DeleteFromCommentBlogLikes = async (idComment, userId) => {
    try {
        const collectionRef = firestore().collection('CommentBlogLikes')
        const query = await collectionRef.where('id_comment', '==', idComment).where('id_user', '==', userId).get();
        if (!query.empty) {
            query.forEach((doc) => {
                doc.ref.delete();
            })
            console.log('Đã xóa dữ liệu thành công');
        } else {
            console.log('Không tìm thấy dữ liệu cần xóa');
        }

    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu:', error);
    }
}

export const getCommentBlogLikeCount = (idComment, callback) => {
    try {
        const collectionRef = firestore().collection("CommentBlogLikes");
        const query = collectionRef.where("id_comment", "==", idComment);
        return query.onSnapshot((querySnapshot) => {
            const count = querySnapshot.size;
            callback(count);
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

export const AddToCommentBlogLikes = async (data) => {
    try {
        const FavoriteRef = firestore().collection('CommentBlogLikes');
        await FavoriteRef.add(data);
        console.log('Thêm vào bảng thành công ');
    } catch (error) {
        console.error('Lỗi khi thêm vào bảng:', error);
    }
}

export const CheckUserLikeReplyComment = (userId, idReply, callback) => {
    try {
        const favoriteRef = firestore().collection('ReplyBlogCommentLikes');
        return favoriteRef
            .where('id_user', '==', userId)
            .where('id_reply', '==', idReply)
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot.empty) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            })
    } catch (error) {
        console.log('Error checking favorite existence:', error);
        callback(false);
    }
}

export const getReplyBlogCommentLikeCount = (idReply, callback) => {
    try {
        const collectionRef = firestore().collection("ReplyBlogCommentLikes");
        const query = collectionRef.where("id_reply", "==", idReply);
        return query.onSnapshot((querySnapshot) => {
            const count = querySnapshot.size;
            callback(count);
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

export const DeleteFromReplyBlogCommentLikes = async (idReply, userId) => {
    try {
        const collectionRef = firestore().collection('ReplyBlogCommentLikes')
        const query = await collectionRef.where('id_reply', '==', idReply).where('id_user', '==', userId).get();
        if (!query.empty) {
            query.forEach((doc) => {
                doc.ref.delete();
            })
            console.log('Đã xóa dữ liệu thành công');
        } else {
            console.log('Không tìm thấy dữ liệu cần xóa');
        }

    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu:', error);
    }
}

export const AddToReplyBlogCommentLikes = async (data) => {
    try {
        const FavoriteRef = firestore().collection('ReplyBlogCommentLikes');
        await FavoriteRef.add(data);
        console.log('Thêm vào bảng thành công ');
    } catch (error) {
        console.error('Lỗi khi thêm vào bảng:', error);
    }
}

export const getPosterBlogCount = (uid, callback) => {
    try {
        const collectionRef = firestore().collection('Blog');
        return collectionRef.where('id_user', '==', uid).where('status', '==', 'Approve').onSnapshot((snapShot) => {
            callback(snapShot.size);
        })
    } catch (error) {
        console.log(error)
        return []
    }
}

export const getAllPosterBlogData = (uid, callback) => {
    try 
    {
        const collectionRef = firestore().collection('Blog');
        
        return collectionRef.where('id_user', '==', uid).where('status', '==', 'Approve')
        .onSnapshot((snapShot) => {
            const blog = []
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idblog = doc.id;
                blog.push({idblog, ...data})
            })
            blog.sort((a, b) => b.date_posted - a.date_posted);
            callback(blog);
        })
    } catch (error) {
        console.log(error)
        return []
    }
}

export const getPosterBlogData = (uid, callback) => {
    try 
    {
        const collectionRef = firestore().collection('Blog');
        
        return collectionRef.where('id_user', '==', uid).where('status', '==', 'Approve')
        .onSnapshot((snapShot) => {
            const blog = []
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idblog = doc.id;
                blog.push({idblog, ...data})
            })
            blog.sort((a, b) => b.date_posted - a.date_posted);
            const blogData = blog.slice(0, 6);
            callback(blogData);
        })
    } catch (error) {
        console.log(error)
        return []
    }
}

