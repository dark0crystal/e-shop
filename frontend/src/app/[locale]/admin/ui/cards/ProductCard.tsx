export default function ProductCard() {
    interface Product {
      id: string;
      name: string;
      price: number;
      stock_quantity: number;
      image_url: string;
    }
  
    const products: Product[] = [
      {
        id: "p1",
        name: "Wireless Headphones",
        price: 299,
        stock_quantity: 34,
        image_url: "https://via.placeholder.com/100",
      },
      {
        id: "p2",
        name: "Smartphone Case",
        price: 79,
        stock_quantity: 112,
        image_url: "https://via.placeholder.com/100",
      },
      {
        id: "p3",
        name: "Bluetooth Speaker",
        price: 189,
        stock_quantity: 18,
        image_url: "https://via.placeholder.com/100",
      },
    ];
  
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-start gap-4 hover:shadow-lg transition"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500">Price: SAR {product.price}</p>
              <p
                className={`text-sm mt-1 ${
                  product.stock_quantity > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                Stock: {product.stock_quantity}
              </p>
              <button className="mt-3 px-4 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  