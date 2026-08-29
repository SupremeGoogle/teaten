import AdminApp from "@/components/admin/AdminApp";
import { content } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminApp fallback={content} />;
}
