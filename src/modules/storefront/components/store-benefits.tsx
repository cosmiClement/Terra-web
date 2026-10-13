import { StoreIcon } from "@/components/ui/store-icon";

const benefits = [
  { icon: "support" as const, title: "Te asesoramos", text: "Consulta antes de elegir" },
  { icon: "home" as const, title: "Retiro o entrega", text: "Modalidad sujeta a confirmación" },
  { icon: "star" as const, title: "Ofertas destacadas", text: "Consulta condiciones en tienda" },
  { icon: "heart" as const, title: "Compra segura", text: "Protección en cada transacción" },
];

export function StoreBenefits() {
  return (
    <section className="store-benefits" aria-label="Beneficios del autoservicio">
      {benefits.map((benefit) => (
        <div className="store-benefit" key={benefit.title}>
          <span className="store-benefit-icon"><StoreIcon name={benefit.icon} /></span>
          <span>
            <strong>{benefit.title}</strong>
            <small>{benefit.text}</small>
          </span>
        </div>
      ))}
    </section>
  );
}
