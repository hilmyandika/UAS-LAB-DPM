import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { Portal, Dialog, Paragraph, Button as PaperButton } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { register } from '../services/api';
import { RootStackParamList } from '../types';

const RegisterScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [dialogMessage, setDialogMessage] = useState('');

	const handleRegister = async () => {
		setLoading(true);
		try {
			await register(username, password, email);
			setDialogMessage('Registration successful!');
			setVisible(true);
		} catch (error: any) {
			console.error('Failed to register:', error.message);
			setDialogMessage('Registration failed. Please try again.');
			setVisible(true);
		} finally {
			setLoading(false);
		}
	};

	const handleDialogDismiss = () => {
		setVisible(false);
		if (dialogMessage.includes('successful')) {
			navigation.navigate('Login');
		}
	};

	return (
		<ImageBackground
			source={require('../../assets/backgroundBuku.jpg')}
			style={styles.background}
		>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<View style={styles.content}>
					<Text style={styles.title}>Create Your Account</Text>
					<Text style={styles.subtitle}>
						Join us today! It's quick and easy.
					</Text>
					<Input
						placeholder="Username"
						value={username}
						onChangeText={setUsername}
						style={styles.input}
					/>
					<Input
						placeholder="Email"
						value={email}
						onChangeText={setEmail}
						style={styles.input}
					/>
					<Input
						placeholder="Password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						style={styles.input}
					/>
					<Button
						title={loading ? 'Registering...' : 'Register'}
						onPress={handleRegister}
						disabled={loading}
						style={styles.registerButton}
					/>
				</View>
			</KeyboardAvoidingView>
			<Portal>
				<Dialog visible={visible} onDismiss={handleDialogDismiss}>
					<Dialog.Title>
						{dialogMessage.includes('successful') ? 'Success' : 'Error'}
					</Dialog.Title>
					<Dialog.Content>
						<Paragraph>{dialogMessage}</Paragraph>
					</Dialog.Content>
					<Dialog.Actions>
						<PaperButton onPress={handleDialogDismiss}>OK</PaperButton>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	background: {
		flex: 1,
		resizeMode: 'cover',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparansi kontainer
	},
	content: {
		backgroundColor: 'rgba(255, 255, 255, 0.9)', // Transparansi konten
		borderRadius: 20,
		padding: 20,
		width: '90%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#333',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center',
		color: '#666',
		marginBottom: 20,
	},
	input: {
		marginBottom: 16,
	},
	registerButton: {
		marginVertical: 10,
		backgroundColor: '#2ecc71',
		padding: 12,
		borderRadius: 8,
	},
});

export default RegisterScreen;
