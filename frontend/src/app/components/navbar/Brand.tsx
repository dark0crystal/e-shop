
// import { getTranslations } from "next-intl/server";
import { Link } from "../../../i18n/routing";
import { Lalezar } from "next/font/google";
import { useTranslations } from "next-intl";
// import { getLocale } from "next-intl/server";

const lalezarFont = Lalezar({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
  });

export default  function Brand(){
    const t =useTranslations("navbar")
    // const locale = (await getLocale()).substring(0,2)
    // const t = await getTranslations("HomePage")
    return(
        <div className="mx-6 text-black text-[42px] ">
            <Link   className={lalezarFont.className} href='/'><p className=" text-slate-800">{t("brand")} </p></Link>
        </div>
    )
}