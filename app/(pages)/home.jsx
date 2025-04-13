import { Button, Text } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';


const Home = () => {

    const {setAuth} = useAuth();

    const onLogout = async () => {
        // setAuth(null);
        
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Logout", error.message);
        }
    }

    return (
        <ScreenWrapper>
            <Text>Home</Text>
            <Button title='logout' onPress={onLogout}></Button>
        </ScreenWrapper>
    );
}

export default Home;