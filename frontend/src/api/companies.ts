const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TAKE = 10;

export async function getCompanies(page = 1, search = '') {
	const response = await fetch(
		`${BASE_URL}/companies?order=ASC&page=${page}&take=${TAKE}&search=${search}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}
	);

	return response.json();
}
