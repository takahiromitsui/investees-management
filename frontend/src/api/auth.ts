import { LoginData } from '@/components/login';
import { SignUpData } from '@/components/sign-up';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postSignUp(data: SignUpData) {
	return await fetch(`${BASE_URL}/auth/sign-up`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
}

export async function postLogin(data: LoginData) {
	return await fetch(`${BASE_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: data.email,
			password: data.password,
		}),
		credentials: 'include',
	});
}

export async function deleteLogout() {
	return await fetch(`${BASE_URL}/auth/logout`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	});
}

export async function getMe() {
	return await fetch(`${BASE_URL}/auth/me`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	});
}
