import { setRequestLocale } from "next-intl/server";
import NewHomePage from "../../components/new-layout/NewHomePage";

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <NewHomePage locale={params.locale} />;
}
