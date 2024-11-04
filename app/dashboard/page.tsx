import BarChartComp from '@/components/DashboardComponents/BarChart';
import LineChartComp from '@/components/DashboardComponents/LineChart';
import PieChartComp from '@/components/DashboardComponents/PieChart';
import { GetUser } from '@/lib/db/UserCrud';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function Page() {
  try {
    const userInfo: User = await GetUser();
    if (!userInfo.isAdmin) {
      redirect('/');
    }
  } catch (error) {
    redirect('/');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-6">
      <div className="col-span-2">
        <BarChartComp />
      </div>
      <div className="col-span-1">
        <LineChartComp />
      </div>
      <div className="col-span-1">
        <PieChartComp />
      </div>
      <div className="col-span-1"></div>
    </div>
  );
}
