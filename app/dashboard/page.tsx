import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const sessionToken = (await cookies()).get('sessionToken');

  if (!sessionToken?.value) {
    redirect('/');
  }

  return <div>Dashboard</div>;
}
