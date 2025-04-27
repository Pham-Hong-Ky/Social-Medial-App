import { supabase } from "../lib/supabase"

export const createNotification = async (notification) => {
    try {
        const { data, error } = await supabase
            .from('notification')
            .insert(notification)
            .select()
            .single()

        if (error) {
            console.error("Error creating notification: ", error);
            return { success: false, msg: 'Could not create notifications' };
        }
        return { success: true, data: data };
    } catch (error) {
        console.error("Error in notificationService:", error);
        return { success: false, msg: 'Could not create notifications' };
    }
}

export const fecthNotifications = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('notification')
            .select('*, sender: senderId(id, name , image)')
            .eq('receiverId', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error fetching notifications: ", error);
            return { success: false, msg: 'Could not fetch notifications' };
        }

        return { success: true, data: data };
        
    } catch (error) {
        console.error("Error in notificationService:", error);
        return { success: false, msg: 'Could not fetch notifications' };
    }
}