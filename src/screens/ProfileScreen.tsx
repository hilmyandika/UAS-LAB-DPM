import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getAuthToken, removeAuthToken } from '../utils/auth';
import { fetchUserProfile } from '../services/api';
import { RootStackParamList, User } from '../types/index';
import LoadingSpinner from "../components/LoadingSpinner";

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = await getAuthToken();
      if (token) {
        try {
          const profileData = await fetchUserProfile() as User;
          setUser(profileData);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    await removeAuthToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>  
        <LoadingSpinner />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}> 
        <Text style={styles.noUserText}>No user data available.</Text>
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require('../../assets/backgroundBuku.jpg')} 
      style={styles.background}
    >
      <View style={styles.profileContainer}>
        <Image
          source={require('../../assets/favicon.png')}
          style={styles.avatar}
        />
        <Text style={styles.title}>Welcome, {user.username}!</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Logout" onPress={handleLogout} color="#1591ea" />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUserText: {
    fontSize: 18,
    color: 'gray',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  profileContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
});

export default ProfileScreen;
