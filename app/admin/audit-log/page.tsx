import { AuditLog } from "@/components/admin/AuditLog";
export default function AuditLogPage() { return <main className="page-top section-pad admin-products-page"><span className="eyebrow">SECURITY</span><h1 className="display-xl">Audit log.</h1><p className="lede page-intro">Recorded changes to locally managed products, site settings and content.</p><AuditLog/></main>; }
