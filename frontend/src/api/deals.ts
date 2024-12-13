import { Company, Deal } from '@/app/(companies)/columns';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCompanyDeals(companyId: string) {
	const response = await fetch(`${BASE_URL}/companies/${companyId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Failed to fetch company data');
	}
	return response.json();
}

export async function updateCompany(companyId: string, data: Partial<Company>) {
	const response = await fetch(`${BASE_URL}/companies/${companyId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Failed to update company');
	}
	return response.json();
}

export async function updateDeal(dealId: string, data: Partial<Deal>) {
	const response = await fetch(`${BASE_URL}/deals/${dealId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Failed to update deal');
	}
	return response.json();
}

export async function createDeal(companyId: string, data: Omit<Deal, 'id'>) {
	const response = await fetch(`${BASE_URL}/companies/${companyId}/deals`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Failed to create deal');
	}
	return response.json();
}

export async function deleteDeal(id: string) {
	const response = await fetch(`${BASE_URL}/deals/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Failed to delete deal');
	}
	return response.json();
}
