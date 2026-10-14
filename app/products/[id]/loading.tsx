import { StoreHeader } from "@/components/layout";

export default function ProductLoading() {
  return (
    <>
      <StoreHeader />
      <main aria-busy="true" aria-label="Cargando producto" className="detail-page animate-pulse">
        <div className="h-4 w-48 rounded bg-slate-200" />
        <div className="product-detail-layout">
          <div className="aspect-[1.15] w-full rounded-2xl bg-slate-200 lg:w-[56%]" />
          <div className="grid content-start gap-5 lg:w-[44%]">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-10 w-full rounded bg-slate-200" />
            <div className="h-8 w-1/2 rounded bg-slate-200" />
            <div className="h-20 w-full rounded bg-slate-200" />
            <div className="h-12 w-full rounded bg-slate-200" />
            <div className="h-14 w-full rounded bg-slate-200" />
          </div>
        </div>
      </main>
    </>
  );
}
