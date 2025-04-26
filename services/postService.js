import { supabase } from '../lib/supabase';
import { upLoadFile } from './imageService';

export const createOrUpdatePost = async (post) => {
    try {
        if (post.file && typeof post.file === 'object') {
            let isImage = post.file.type == 'image' ? true : false;
            let folderName = isImage ? 'postImages' : 'postVideos';
            let fileResult = await upLoadFile(folderName, post.file.uri, isImage);
            if (fileResult.success) post.file = fileResult.data;
            else {
                return fileResult;
            }
        }

        const { data, error } = await supabase
            .from('posts')
            .upsert(post)
            .select()
            .single();

        if (error) {
            console.log("Error creating or updating post: ", error);
            return { success: false, msg: 'Could not create or update post' };
        }
        return { success: true, data: data };
    } catch (error) {
        console.log("Error creating or updating post: ", error);
        return { success: false, msg: 'Could not create or update post' };
    }
}

export const fectchPosts = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*, user: users(id, name, image), postLikes(*), comments(count)')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.log("Error fetching posts: ", error);
            return { success: false, msg: 'Could not fetch posts' };
        }

        return { success: true, data: data };

    } catch (error) {
        console.log("Error fetching posts: ", error);
        return { success: false, msg: 'Could not fetch posts' };
    }
}

export const createPostLike = async (postLike) => {
    try {
        const { data, error } = await supabase
            .from('postLikes')
            .insert(postLike)
            .select()
            .single();

        if (error) {
            console.log("Error like post: ", error);
            return { success: false, msg: 'Could not like post' };
        }

        return { success: true, data: data };

    } catch (error) {
        console.log("Error like post: ", error);
        return { success: false, msg: 'Could not like post' };
    }
}

export const removePostLike = async (postId, userId) => {
    try {
        const { error } = await supabase
            .from('postLikes')
            .delete()
            .eq('postId', postId)
            .eq('userId', userId)

        if (error) {
            console.log("Error remove like post: ", error);
            return { success: false, msg: 'Could not remove like post' };
        }

        return { success: true };

    } catch (error) {
        console.log("Error remove like post: ", error);
        return { success: false, msg: 'Could not remove like post' };
    }
}

export const fetchPostDetails = async (postId) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*, user: users(id, name, image), postLikes(*), comments(*, user: users(id, name, image))')
            .eq('id', postId)
            .order('created_at', { ascending: false, foreignTable: 'comments' })
            .single();

        if (error) {
            console.log("Error fetching post details: ", error);
            return { success: false, msg: 'Could not fetch post details' };
        }

        return { success: true, data: data };

    } catch (error) {
        console.log("Error fetching post details: ", error);
        return { success: false, msg: 'Could not fetch post details' };
    }
}

export const createComment = async (comment) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .insert(comment)
            .select()
            .single();

        if (error) {
            console.log("Error creating post comment: ", error);
            return { success: false, msg: 'Could not create post comment' };
        }

        return { success: true, data: data };
    } catch (error) {
        console.log("Error creating post comment: ", error);
        return { success: false, msg: 'Could not create post comment' };
    }
}

export const removeComment = async (commentId) => {
    try {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId)

        if (error) {
            console.log("Error removing comment: ", error);
            return { success: false, msg: 'Could not remove comment' };
        }

        return { success: true, data: commentId };

    } catch (error) {
        console.log("Error removing comment: ", error);
        return { success: false, msg: 'Could not remove comment' };
    }
}

export const removePost = async (postId) => {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)

        if (error) {
            console.log("Error removing post: ", error);
            return { success: false, msg: 'Could not remove post' };
        }

        return { success: true, data: postId };

    } catch (error) {
        console.log("Error removing post: ", error);
        return { success: false, msg: 'Could not remove post' };
    }
}

export const editPost = async (postId, post) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .update(post)
            .eq('id', postId)
            .select()
            .single();

        if (error) {
            console.log("Error editing post: ", error);
            return { success: false, msg: 'Could not edit post' };
        }

        return { success: true, data: data };

    } catch (error) {
        console.log("Error editing post: ", error);
        return { success: false, msg: 'Could not edit post' };
    }
}