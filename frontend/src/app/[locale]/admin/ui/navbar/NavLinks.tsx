import { Link } from "@/i18n/routing"
import { getLocale } from "next-intl/server";

export default async function NavLinks(){

    const NavLinks = [
        {name:"Customers" ,direction:"/admin/customers"},
        {name:"Orders" ,direction:"/admin/orders"},
        {name:"Products" ,direction:"/admin/products"},
        {name:"Manage Ads" ,direction:"/admin/manage-ads"},
    ]

    const locale = (await getLocale()).substring(0, 2); // This will give you "ar" or "en"


    return(
        <div>
            <div>
                {NavLinks.map((navLink,index)=>(
                    <div key={index}>
                        <Link locale={locale} href={navLink.direction}>
                        <h1>
                            {navLink.name}
                        </h1>
                        </Link>
                    </div>
                ))
                    
                }
            </div>
        </div>
    )
}

// orders
// customers
// products
// manage-ads
