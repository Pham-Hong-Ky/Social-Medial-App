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
            .select('*, user: users(id, name, image)')
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