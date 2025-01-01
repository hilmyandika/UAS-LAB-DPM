import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ImageBackground,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Portal, Dialog, Paragraph, Button as PaperButton } from "react-native-paper";
import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../services/api";
import { setAuthToken } from "../utils/auth";
import { AuthResponse, ApiError } from "../types/index";

type RootStackParamList = {
	MainTabs: undefined;
	Register: undefined;
};

const LoginScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");

	const handleLogin = async () => {
		if (!username || !password) {
			setDialogMessage("Please fill in all fields");
			setVisible(true);
			return;
		}

		setLoading(true);
		try {
			const response = (await login(username, password)) as AuthResponse;
			await setAuthToken(response.data.token);
			navigation.reset({
				index: 0,
				routes: [{ name: "MainTabs" }],
			});
		} catch (error: any) {
			const apiError = error as ApiError;
			const errorMessage = apiError.data?.message || "Something went wrong";
			const errors = apiError.data?.errors;
			console.log("Error details:", errors);
			const passwordError = errors?.password;
			const usernameError = errors?.username;
			setDialogMessage(
				passwordError
					? `${errorMessage}: ${passwordError}`
					: usernameError
					? `${errorMessage}: ${usernameError}`
					: errorMessage
			);
			setVisible(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ImageBackground
			source={require("../../assets/backgroundBuku.jpg")}
			style={styles.background}
		>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<View style={styles.content}>
					<Text style={styles.title}>Welcome Back!</Text>
					<Text style={styles.subtitle}>Please log in to your account</Text>
					<Input
						placeholder="Username"
						value={username}
						onChangeText={setUsername}
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
						title={loading ? "Logging in..." : "Login"}
						onPress={handleLogin}
						disabled={loading}
						style={styles.loginButton}
					/>
					<TouchableOpacity
						style={styles.registerLink}
						onPress={() => navigation.navigate("Register")}
					>
						<Text style={styles.registerText}>
							Don't have an account? <Text style={styles.bold}>Register</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
			<Portal>
				<Dialog visible={visible} onDismiss={() => setVisible(false)}>
					<Dialog.Title>Error</Dialog.Title>
					<Dialog.Content>
						<Paragraph>{dialogMessage}</Paragraph>
					</Dialog.Content>
					<Dialog.Actions>
						<PaperButton onPress={() => setVisible(false)}>OK</PaperButton>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	background: {
		flex: 1,
		resizeMode: "cover",
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparansi pada kontainer
	},
	content: {
		backgroundColor: "rgba(255, 255, 255, 0.9)", // Transparansi konten
		borderRadius: 20,
		padding: 20,
		width: "90%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		color: "#333",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		color: "#666",
		marginBottom: 20,
	},
	input: {
		marginBottom: 16,
	},
	loginButton: {
		marginVertical: 10,
		backgroundColor: "#007AFF",
		padding: 12,
		borderRadius: 8,
	},
	registerLink: {
		marginTop: 20,
		alignItems: "center",
	},
	registerText: {
		color: "#333",
		fontSize: 14,
	},
	bold: {
		fontWeight: "bold",
		color: "#007AFF",
	},
});

export default LoginScreen;
