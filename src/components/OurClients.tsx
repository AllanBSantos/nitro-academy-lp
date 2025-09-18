import { fetchSchoolsWithLogo } from "@/lib/strapi";
import OurClientsContent from "./OurClientsContent";

export default async function OurClients() {
  const schools = await fetchSchoolsWithLogo();
  return <OurClientsContent schools={schools || []} />;
}
