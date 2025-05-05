import { Link } from "@/i18n/routing";
import ProductCard from "../ui/cards/ProductCard";
import { getLocale } from "next-intl/server";
import { Plus } from "lucide-react";

export default async function Products() {
    const locale = (await getLocale()).substring(0, 2);

    return (
        <div>
            <h1>Products</h1>
            <div>
                <div>
                    <Link href="/admin/products/new" locale={locale}>
                        <h1 className="bg-blue-500 p-3 rounded-3xl w-fit text-white font-bold flex items-center gap-2">
                            <Plus size={20} />
                            New Product
                        </h1>
                    </Link>
                </div>
                <div>
                    <ProductCard />
                </div>
            </div>
        </div>
    );
}
