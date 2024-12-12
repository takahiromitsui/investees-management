import MaxWidthWrapper from '@/components/max-width-wrapper';
import { SignUp } from '@/components/sign-up';

export default function SignUpPage() {
	return (
		<MaxWidthWrapper>
			<div className='flex items-center justify-center min-h-screen bg-gray-100'>
				<SignUp />
			</div>
		</MaxWidthWrapper>
	);
}
