import {getTranslations} from 'next-intl/server';
import CategoryBar from '../components/category/CategoryBar';
import ProductList from '../components/product/ProductList';
 
export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return (
    <div>
      <CategoryBar/>
      <h1>{t('title')}</h1>  

      <ProductList /> 
    </div>

  )
}