'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@prisma/client';
import { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

type UserListTableProps = {
  users: User[];
};

function UserListTable({ users }: UserListTableProps) {
  const [search, setSearch] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredUsers = users.filter((user) => {
    return (
      search.toLowerCase() === '' || user.name.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <Card className="overflow-x-auto m-4 p-3">
        <div className="flex items-center justify-between">
          <div className="w-96 space-y-4 ">
            <h1>Users List</h1>

            <Input
              placeholder="Search category"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>
      </Card>
      <Card className="overflow-x-auto m-4 p-3">
        <Table className="min-w-full md:min-w-[600px]">
          <TableCaption>{users.length} users so far</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs md:text-sm">User Name</TableHead>
              <TableHead className="text-xs md:text-sm">Email</TableHead>
              <TableHead className="text-xs md:text-sm">Signed up at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.createdAt.toDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="flex items-center justify-center">
                    <p>No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default UserListTable;
