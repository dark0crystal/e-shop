import { Link } from "@/i18n/routing";
import ProductCard from "../ui/cards/ProductCard";
import { getLocale } from "next-intl/server";

export default async function Products(){

    const locale = (await getLocale()).substring(0, 2);
    return(
        <div>
            <h1>Products</h1>
            <div>
                <div>
                    <Link href="/admin/products/new" locale={locale} className="">
                        <h1>New Product</h1>
                    </Link>
                </div>
                <div>
                    <ProductCard/>
                </div>
            </div>
            
           
        </div>
    )
}