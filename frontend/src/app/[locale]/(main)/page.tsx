import {getTranslations} from 'next-intl/server';
import CategoryBar from '../../components/category/CategoryBar';
import ProductList from '../../components/product/ProductList';
import WideAd from '../../components/manage-ads-cards/WideAd';
// import SmallAd from '../components/manage-ads-cards/SmallAd';
import SmallAdContainer from '../../components/manage-ads-cards/SmallAdContainer';

 
export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return (
    <div>
      <WideAd imageUrl='/gaseem.jpeg'/>
      <SmallAdContainer/>
      <CategoryBar/>
      <h1>{t('title')}</h1>  

      <ProductList /> 

    </div>

  )
}