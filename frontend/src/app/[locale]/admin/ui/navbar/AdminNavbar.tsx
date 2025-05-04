import Brand from "@/app/components/navbar/Brand";
import NavLinks from "./NavLinks";

export default function AdminNavbar(){
    return(
        <div className="h-[100vh] bg-amber-200 w-[24%]">
            <div>
                <div>
                    <Brand/>
                </div>
            </div>
            <NavLinks/>
        </div>
    )
}


// orders
// customers
// products
// manage-ads
