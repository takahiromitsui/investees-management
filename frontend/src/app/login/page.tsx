import { Login } from '@/components/login';
import MaxWidthWrapper from '@/components/max-width-wrapper';

export default function LoginPage() {
	return (
		<MaxWidthWrapper>
			<div className='flex items-center justify-center min-h-screen bg-gray-100'>
				<Login />
			</div>
		</MaxWidthWrapper>
	);
}
