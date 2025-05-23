import ProductCard from '../../../../components/product/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  active: boolean;
  brand?: string;
}

interface ApiResponse {
  products: Product[];
  categoryName: string;
  categoryId: string;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="p-6 text-center text-red-600">
        <h1 className="text-2xl font-semibold mb-2">Invalid Route</h1>
        <p>No category slug was provided in the URL.</p>
      </div>
    );
  }

  let data: ApiResponse | null = null;
  let error: string | null = null;

  try {
    console.log(`Attempting fetch for slug: ${slug} at ${new Date().toISOString()} from Next.js server`);
    const res = await fetch(`http://localhost:8383/api/product/by-slug/${slug}`, {
      cache: 'no-store',
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Fetch response status:', res.status);
    console.log('Fetch response headers:', Object.fromEntries(res.headers));

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.log('Raw response text:', text);
      throw new Error(`Expected JSON response, but received: ${text.slice(0, 50)}...`);
    }

    if (!res.ok) {
      const errorData = await res.json();
      console.log('Error data from response:', errorData);
      if (res.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error(errorData.message || `Failed to fetch products: ${res.status} ${res.statusText}`);
    }

    data = await res.json();
    console.log('API response data:', data);
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('Fetch error details:', error);
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error === 'Category not found' ? (
          <>
            <h1 className="text-2xl font-semibold mb-2">Category Not Found</h1>
            <p>The category you are looking for does not exist.</p>
          </>
        ) : error.includes('Failed to fetch') ? (
          <>
            <h1 className="text-2xl font-semibold mb-2">Server Unavailable</h1>
            <p>Unable to connect to the server. Please ensure the server is running and try again.</p>
          </>
        ) : (
          error
        )}
      </div>
    );
  }

  const products = data?.products || [];
  const categoryName = data?.categoryName || null;

  if (products.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        No products found for {categoryName || 'this category'}.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{categoryName || 'Category'} Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.name}
            price={product.price}
            image={product.image_url}
            brand={product.brand || 'Unknown'}
            stock_quantity={product.stock_quantity}
          />
        ))}
      </div>
    </div>
  );
}