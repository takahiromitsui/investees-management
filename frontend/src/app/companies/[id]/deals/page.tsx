'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyInfo } from '@/components/company-info';
import { DealsList } from '@/components/deals-list';
import { Company, Deal } from '@/app/(companies)/columns';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCompanyDeals(companyId: string) {
	const response = await fetch(`${BASE_URL}/companies/${companyId}`);
	if (!response.ok) {
		throw new Error('Failed to fetch company data');
	}
	return response.json();
}

async function updateCompany(companyId: string, data: Partial<Company>) {
	const response = await fetch(`${BASE_URL}/companies/${companyId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error('Failed to update company');
	}
	return response.json();
}

async function updateDeal(dealId: string, data: Partial<Deal>) {
	const response = await fetch(`${BASE_URL}/deals/${dealId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error('Failed to update deal');
	}
	return response.json();
}

export default function CompanyDealsPage() {
	const params = useParams<{ id: string }>();
	const queryClient = useQueryClient();

	const { data, isPending, isError } = useQuery({
		queryKey: ['company', params.id],
		queryFn: () => getCompanyDeals(params.id),
	});

	const updateCompanyMutation = useMutation({
		mutationFn: (updatedData: Partial<Company>) =>
			updateCompany(params.id, updatedData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['company', params.id] });
		},
	});

	const updateDealMutation = useMutation({
		mutationFn: ({ dealId, data }: { dealId: string; data: Partial<Deal> }) =>
			updateDeal(dealId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['company', params.id] });
		},
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error loading data</div>;
	}

	const { body: company } = data;

	return (
		<div className='container mx-auto py-10 space-y-8'>
			<CompanyInfo
				company={company}
				onUpdate={updatedCompany =>
					updateCompanyMutation.mutate(updatedCompany)
				}
			/>
			<DealsList
				deals={company.deals}
				onUpdate={updatedDeal =>
					updateDealMutation.mutate({
						dealId: String(updatedDeal.id!),
						data: updatedDeal,
					})
				}
			/>
		</div>
	);
}
