'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Customer } from '@prisma/client';
import { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

type CustomerListTableProps = {
  customers: Customer[];
};

export default function CustomerListTable({
  customers,
}: CustomerListTableProps) {
  const [search, setSearch] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredCustomer = customers.filter((customer) => {
    const firstNameWithLastName =
      customer.first_name + ' ' + customer.last_name;
    return (
      search.toLowerCase() === '' ||
      firstNameWithLastName.toLowerCase().includes(search)
    );
  });
  return (
    <div>
      <Card className="overflow-x-auto m-4 p-3">
        <div className="flex items-center justify-between">
          <div className="w-96 space-y-4">
            <h1>Customer List</h1>
            <Input
              placeholder="Search customer"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>
      </Card>
      <Card className="overflow-x-auto m-4 p-3">
        <Table className="min-w-full md:min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs md:text-sm">Name</TableHead>
              <TableHead className="text-xs md:text-sm">Email</TableHead>
              <TableHead className="text-xs md:text-sm">Phone Number</TableHead>
              <TableHead className="text-xs md:text-sm">Message</TableHead>
              <TableHead className="text-xs md:text-sm">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomer && filteredCustomer.length > 0 ? (
              filteredCustomer.map((customer) => (
                <TableRow key={customer.customer_id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <p>{customer.first_name}</p>
                      <p>{customer.last_name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>{customer.message}</TableCell>
                  <TableCell>{customer.createdAt.toDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex items-center justify-center">
                    <p>No customers yet</p>
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
