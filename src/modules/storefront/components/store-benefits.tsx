import { StoreIcon } from "@/components/ui/store-icon";

const benefits = [
  { icon: "support" as const, title: "Te asesoramos", text: "Consulta antes de elegir" },
  { icon: "home" as const, title: "Retiro en tienda", text: "Coordina con el equipo" },
  { icon: "star" as const, title: "Promociones activas", text: "Precios de demostración" },
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
