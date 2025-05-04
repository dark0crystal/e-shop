import { Link } from "@/i18n/routing";

export default function OrderCard() {
    interface Order {
      id:string;
      userName: string;
      totalPrice: number;
      status: string;
      shippingAddress: string;
    }
  
    const orders: Order[] = [
      {
        id:"54423kljjsds",
        userName: "Ali Ahmed",
        totalPrice: 150,
        status: "Pending",
        shippingAddress: "Riyadh, Saudi Arabia",
      },
      {
        id:"544423kljkkjsds",
        userName: "Fatima Khalid",
        totalPrice: 320,
        status: "Shipped",
        shippingAddress: "Jeddah, Saudi Arabia",
      },
      {
        id:"54423fdsgjbjsds",
        userName: "Omar Al-Fayez",
        totalPrice: 220,
        status: "Delivered",
        shippingAddress: "Dammam, Saudi Arabia",
      },
      {
        id:"54423fdsgbbbjjsds",
        userName: "Omar Al-Fayez",
        totalPrice: 220,
        status: "Delivered",
        shippingAddress: "Dammam, Saudi Arabia",
      },
      {
        id:"54423fdsgvvvjjsds",
        userName: "Omar Al-Fayez",
        totalPrice: 220,
        status: "Delivered",
        shippingAddress: "Dammam, Saudi Arabia",
      },
      {
        id:"54423fdsgppsjsds",
        userName: "Omar Al-Fayez",
        totalPrice: 220,
        status: "Delivered",
        shippingAddress: "Dammam, Saudi Arabia",
      },
      {
        id:"54423ppppggfds",
        userName: "Ali Ahmed",
        totalPrice: 150,
        status: "Pending",
        shippingAddress: "Riyadh, Saudi Arabia",
      },
      {
        id:"544423kkjsds",
        userName: "Fatima Khalid",
        totalPrice: 320,
        status: "Shipped",
        shippingAddress: "Jeddah, Saudi Arabia",
      },
      {
        id:"54423fdjjkbjsds",
        userName: "Omar Al-Fayez",
        totalPrice: 220,
        status: "Delivered",
        shippingAddress: "Dammam, Saudi Arabia",
      },
      {
        id:"54423fhhhbbjjsds",
        userName: "Omar Al-Fayez",
        totalPrice: 220,
        status: "Delivered",
        shippingAddress: "Dammam, Saudi Arabia",
      },
      {
        id:"5442bbbgvvvjjsds",
        userName: "Omar Al-Fayez",
        totalPrice: 220,
        status: "Delivered",
        shippingAddress: "Dammam, Saudi Arabia",
      },
      {
        id:"54423fffgjtttjsds",
        userName: "Omar Al-Fayez",
        totalPrice: 220,
        status: "Delivered",
        shippingAddress: "Dammam, Saudi Arabia",
      },
    ];
  
    const statusColors: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-700",
      Shipped: "bg-blue-100 text-blue-700",
      Delivered: "bg-green-100 text-green-700",
    };
  
    return (
        <div className="p-6">
          {orders.map((order, index) => (
            <Link
              key={index}
              href={`/admin/orders/${order.id}`}
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition"
            >
              <div>
                <h2 className="text-xl font-semibold">{order.userName}</h2>
                <p className="text-sm text-gray-500">{order.shippingAddress}</p>
              </div>
              <div className="text-gray-700 font-medium">SAR {order.totalPrice}</div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
              >
                {order.status}
              </div>
            </Link>
          ))}
        </div>
      );
  }
  