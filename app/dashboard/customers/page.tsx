import CustomerListTable from '@/components/CustomerComponents/CustomerListTable';
import { GetCustomers } from '@/lib/db/CustomerCrud';
import { Customer } from '@prisma/client';

async function Customers() {
  const customerData: Customer[] = await GetCustomers();
  return (
    <div>
      <CustomerListTable customers={customerData} />
    </div>
  );
}

export default Customers;
