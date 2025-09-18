import { Escola } from "@/types/strapi";
import { fetchSchoolsWithLogo } from "@/lib/strapi";
import OurClientsContent from "./OurClientsContent";

interface OurClientsProps {
  locale: string;
}

export default async function OurClients({ locale }: OurClientsProps) {
  const schools = await fetchSchoolsWithLogo(locale);
  return <OurClientsContent schools={schools || []} />;
}
