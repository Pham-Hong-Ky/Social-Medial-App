import { supabase } from '../lib/supabase';

export const getUserData = async (userId) => {
    try{
        const { data, error } = await supabase
            .from('users')
            .select()
            .eq('id', userId)
            .single();
            if(error) {
                return {success: false, msg: error.message};
            }
            return {success: true, data};
    }catch (error) {
        console.log("Error fetching user data: ", error);
        return {success: false, msg: error.message};
    }
}

export const updateUser = async (userId, data) => {
    try{
        const { error } = await supabase
            .from('users')
            .update(data)
            .eq('id', userId);
        if(error) {
            return {success: false, msg: error.message};
        }
        return {success: true, data};
    }catch (error) {
        console.log("Error updating user data: ", error);
        return {success: false, msg: error.message};
    }
}

export const getAllUserData = async () => {
    try{
        const { data, error } = await supabase
            .from('users')
            .select();
        if(error) {
            return {success: false, msg: error.message};
        }
        return {success: true, data};
    }catch (error) {
        console.log("Error fetching all users: ", error);
        return {success: false, msg: error.message};
    }
}

export const addNewFriend = async (data) => {
    try{
        const { error } = await supabase
            .from('friendships')
            .insert(data)
            .single()

        if(error) {
            return {success: false, msg: error.message};
        }
        return {success: true};
    }catch (error) {
        console.log("Error adding new friend: ", error);
        return {success: false, msg: error.message};
    }
}

export const getFriendList = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('friendships')
            .select('*')
            .eq('userId', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return { success: false, msg: error.message };
        }
        return { success: true, data };
    } catch (error) {
        console.log("Error fetching friend list: ", error);
        return { success: false, msg: error.message };
    }
}

export const acceptFriend = async (dataCrr, data) => {
    try {
        const { error } = await supabase
            .from('friendships')
            .update(dataCrr)
            .eq('userId', data.userId)
            .eq('friendId', data.friendId);

        const { error2 } = await supabase
            .from('friendships')
            .insert(data)
            .single();

        if (error) {
            return { success: false, msg: error.message };
        }

        if (error2) {
            return { success: false, msg: error2.message };
        }

        return { success: true };
    } catch (error) {
        console.log("Error accepting friend: ", error);
        return { success: false, msg: error.message };
    }
}

export const deleteFriend = async (userId, friendId) => {
    try {
        const { error } = await supabase
            .from('friendships')
            .delete()
            .eq('userId', userId)
            .eq('friendId', friendId);


        const { error2 } = await supabase
            .from('friendships')
            .delete()
            .eq('userId', friendId)
            .eq('friendId', userId);

        if (error) {
            return { success: false, msg: error.message };
        }

        if (error2) {
            return { success: false, msg: error2.message };
        }

        return { success: true };
    } catch (error) {
        console.log("Error deleting friend: ", error);
        return { success: false, msg: error.message };
    }
}

export const getUserById = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            return { success: false, msg: error.message };
        }
        return { success: true, data };
    } catch (error) {
        console.log("Error fetching user by ID: ", error);
        return { success: false, msg: error.message };
    }
}