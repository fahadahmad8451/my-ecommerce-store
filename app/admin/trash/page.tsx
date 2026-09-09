import { ProductTrash } from "@/components/admin/ProductTrash";
export default function TrashPage() { return <main className="page-top section-pad admin-products-page"><span className="eyebrow">DATA SAFETY</span><h1 className="display-xl">Trash.</h1><p className="lede page-intro">Deleted locally managed products remain recoverable until manually removed from storage.</p><ProductTrash/></main>; }
