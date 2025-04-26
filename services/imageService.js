import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';
import { supabaseUrl, supabaseAnonKey } from '../constants';

export const getUserImageSrc = imagePath => {
    if (imagePath) {
        return getSupabaseFileUrl(imagePath);
        // return { uri: imagePath }
    } else {
        return require('../assets/images/user.png');
    }
}

export const upLoadFile = async (folderName, fileUri, isImage = true) => {
    try {
        let fileName = getFilePath(folderName, isImage);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
        let imageData = decode(fileBase64);
        let { data, error } = await supabase
            .storage
            .from('uploads')
            .upload(fileName, imageData, {
                cacheControl: '3600',
                upsert: false,
                contentType: isImage ? 'image/*' : 'video/*',
            });

        if (error) {
            console.log("Error uploading file: ", error);
            return { success: false, msg: 'Could not upload file' };
        }

        console.log("data: ", data);

        return { success: true, data: data.path };

    } catch (error) {
        console.log("Error uploading file: ", error);
        return { success: false, msg: 'Could not upload file' };
    }
}

export const getSupabaseFileUrl = (filePath) => {
    if (filePath) {
        return { uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}` };
    }
    return null;
}


export const getFilePath = (folderName, isImage = true) => {
    return `${folderName}/${(new Date()).getTime()}${isImage ? '.png' : '.mp4'}`;
}

export const downloadFile = async (url) => {
    try {
        const localPath = await getLocalFilePath(url);
        const { uri } = await FileSystem.downloadAsync(url, localPath);
        return uri;
    } catch (error) {
        console.log("Error downloading file: ", error);
        return null;
    }
}

export const getLocalFilePath = async (filePath) => {
    let fileName = filePath.split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`;
}

export const uploadImageFromPhone = async (file) => {
    try {
        if (file && typeof file === 'object') {
            let isImage = file.type == 'image' ? true : false;
            let folderName = isImage ? 'profiles' : '';
            let fileResult = await upLoadFile(folderName, file.uri, isImage);
            if (fileResult.success) file = fileResult.data;
            else {
                return fileResult;
            }
        }
        return { success: true, data: file };
    } catch (error) {
        console.log("Error : ", error);
        return { success: false, msg: 'Could not upload image from phone' };
    }
}