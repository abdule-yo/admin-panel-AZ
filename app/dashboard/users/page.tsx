import UserListTable from '@/components/UserComponents/UserListTable';
import { GetUsers } from '@/lib/db/UserCrud';
import { User } from '@prisma/client';

async function UsersPage() {
  const users: User[] = await GetUsers();
  return (
    <div>
      <UserListTable users={users} />
    </div>
  );
}

export default UsersPage;
