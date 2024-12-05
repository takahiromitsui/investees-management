const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TAKE = 10;

export async function getCompanies(page = 1, search = '') {
	const response = await fetch(
		`${BASE_URL}/companies?order=ASC&page=${page}&take=${TAKE}&search=${search}`
	);
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Failed to fetch companies');
	}
	return response.json();
}
