import ProductListTable from '@/components/ProductComponents/ProductListTable';
import { GetPrdoducts } from '@/lib/db/ProductCrud';
import { Product, ProductCategory } from '@prisma/client';

type ProductWithCategory = Product & {
  category: ProductCategory;
};

async function ProductList() {
  const productsData: ProductWithCategory[] = await GetPrdoducts();

  return (
    <div>
      <ProductListTable products={productsData} />
    </div>
  );
}

export default ProductList;
