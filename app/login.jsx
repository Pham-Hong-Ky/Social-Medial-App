import ScreenWrapper from '@/components/ScreenWrapper';
import { theme } from '@/constants/theme';
import Icon from '../assets/icons';
import { useRouter } from "expo-router";
import { StatusBar, View, StyleSheet, Text, Pressable, Alert } from 'react-native';
import BackButton from '../components/BackButton';
import { wp, hp } from "@/helper/common";
import { useRef, useState } from 'react';
import Input from '@/components/Input';
import Buton from '@/components/Button';
import { supabase } from '@/lib/supabase';

const Login = () => {

    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Login", "Please fill all fields");
            return;
        }

        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            Alert.alert("Login", error.message);
        }
    }

    return (
        <ScreenWrapper>
            <StatusBar style='dark' />
            <View style={styles.container}>
                <BackButton router={router} />

                <View>
                    <Text style={styles.welcomeText}>Hey</Text>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                </View>

                <View style={styles.form}>
                    <Text style={{ fontSize: hp(1.5), color: theme.colors.text, }}>
                        Please login to continue
                    </Text>
                    <Input
                        placeholder='Enter your email'
                        icon={<Icon name='mail' size={26} strokeWidth={1.6} />}
                        onChangeText={value => emailRef.current = value}
                    />
                    <Input
                        placeholder='Enter your password'
                        icon={<Icon name='lock' size={26} strokeWidth={1.6} />}
                        onChangeText={value => passwordRef.current = value}
                        secureTextEntry
                    />
                    <Text style={styles.forgotPassword}>
                        Forgot password?
                    </Text>
                    <Buton title='Login' loading={loading} onPress={onSubmit} />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Don't have an account?
                    </Text>
                    <Pressable onPress={() => router.push('signUp')}>
                        <Text style={[styles.footerText, { fontWeight: theme.fonts.semiBold, color: theme.colors.primaryDark }]}>Sign up</Text>
                    </Pressable>
                </View>

            </View>
        </ScreenWrapper>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },
    form: {
        gap: 25,
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semiBold,
        color: theme.colors.text,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        fontSize: hp(1.6),
        color: theme.colors.text,
        textAlign: 'center',
    },
})
