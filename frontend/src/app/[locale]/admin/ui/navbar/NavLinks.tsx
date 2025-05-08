import { Link } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import {
  Users,
  ShoppingCart,
  Package,
  MonitorPlay,
} from "lucide-react";

export default async function NavLinks() {
  const locale = (await getLocale()).substring(0, 2);

  const navLinks = [
    { name: "Customers", direction: "/admin/customers", icon: <Users size={20} /> },
    { name: "Orders", direction: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { name: "Products", direction: "/admin/products", icon: <Package size={20} /> },
    { name: "Manage Ads", direction: "/admin/manage-ads", icon: <MonitorPlay size={20} /> },
    { name: "Manage Categories", direction: "/admin/manage-categories", icon: <MonitorPlay size={20} /> },
  ];

  return (
    <div className="mt-4">
      {navLinks.map((navLink, index) => (
        <div
          key={index}
          className="bg-white text-black text-base font-medium rounded-xl mx-4 my-2 hover:bg-gray-100 transition-colors duration-200"
        >
          <Link
            locale={locale}
            href={navLink.direction}
            className="flex items-center gap-3 px-4 py-3"
          >
            {navLink.icon}
            <span>{navLink.name}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
