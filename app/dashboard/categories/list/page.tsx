import CategoryListTable from '@/components/CategoryComponents/CategoryListTable';
import { GetCategories } from '@/lib/db/CategoryCrud';
import { ProductCategory } from '@prisma/client';

async function CategoryList() {
  const categoriesList: ProductCategory[] = await GetCategories();

  return (
    <div>
      <CategoryListTable categories={categoriesList} />
    </div>
  );
}

export default CategoryList;
