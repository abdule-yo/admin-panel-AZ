import LoginForm from '@/components/LoginForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const sessionToken = (await cookies()).get('sessionToken');

  if (sessionToken?.value) {
    redirect('/dashboard');
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
}
