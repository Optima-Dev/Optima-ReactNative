import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
 

function Splash({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('OnBoarding1');
        }, 1000);

        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/Images/Splash-Logo.png')} />
            <View style={styles.textContainer}>
                <Text style={styles.text}>A Glimpse of vision</Text>
                <Text style={styles.copyright}>© All rights reserved to Optima 2025</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    copyright: {
        fontSize: 12,
        color: 'white',
    },
});

export default Splash;