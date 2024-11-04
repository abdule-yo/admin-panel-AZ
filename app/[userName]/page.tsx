import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function UserDashboard({ params }: { params: { userName: string } }) {
  const { userName } = await params;

  const sessionToken = (await cookies()).get('sessionToken');

  if (!sessionToken?.value) {
    redirect('/');
  }

  return <div>UserDashboard of {userName}</div>;
}

export default UserDashboard;
