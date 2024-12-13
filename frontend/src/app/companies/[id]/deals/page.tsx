'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyInfo } from '@/components/company-info';
import { DealsList } from '@/components/deals-list';
import { Company, Deal } from '@/app/(companies)/columns';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import {
	createDeal,
	deleteDeal,
	getCompanyDeals,
	updateCompany,
	updateDeal,
} from '@/api/deals';
import { toast } from 'sonner';

export default function CompanyDealsPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
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
			toast.success('Company updated successfully');
		},
		onError: () => {
			toast.error('Failed to update Company');
		},
	});

	const updateDealMutation = useMutation({
		mutationFn: ({ dealId, data }: { dealId: string; data: Partial<Deal> }) =>
			updateDeal(dealId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['company', params.id] });
			toast.success('Deal updated successfully');
		},
		onError: () => {
			toast.error('Failed to update Company');
		},
	});

	const createDealMutation = useMutation({
		mutationFn: (data: Omit<Deal, 'id'>) => createDeal(params.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['company', params.id] });
			toast.success('New deal created successfully');
		},
		onError: () => {
			toast.error('Failed to update Deal');
		},
	});

	const deleteDealMutation = useMutation({
		mutationFn: (id: string) => deleteDeal(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['company', params.id] });
			toast.success('Deal deleted successfully');
		},
		onError: () => {
			toast.error('Failed to delete Deal');
		},
	});

	if (isPending) {
		return <></>;
	}

	if (isError) {
		return <div>Error loading data</div>;
	}

	const { body: company } = data;

	return (
		<MaxWidthWrapper className='py-10 space-y-8'>
			<CompanyInfo
				company={company}
				onUpdate={updatedCompany =>
					updateCompanyMutation.mutate(updatedCompany)
				}
			/>
			<DealsList
				deals={company.deals}
				onCreate={newDeal =>
					createDealMutation.mutate(newDeal as Omit<Deal, 'id'>)
				}
				onDelete={id => deleteDealMutation.mutate(String(id))}
				onUpdate={updatedDeal =>
					updateDealMutation.mutate({
						dealId: String(updatedDeal.id!),
						data: updatedDeal,
					})
				}
			/>
			<Button onClick={() => router.back()}>Back to Dashboard</Button>
		</MaxWidthWrapper>
	);
}
