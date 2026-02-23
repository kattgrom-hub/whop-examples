import { CheckCircle } from "lucide-react";

const signals = [
  {
    title: "100% Verified Authentic",
    description: "Every sock is authenticated by our experts",
  },
  {
    title: "Every Pair Inspected",
    description: "Multi-point quality inspection on all items",
  },
  {
    title: "Safe Payments",
    description: "Secure transactions with buyer protection",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-sockx-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signals.map((signal) => (
            <div
              key={signal.title}
              className="flex items-center gap-4 text-white"
            >
              <CheckCircle className="h-10 w-10 flex-shrink-0 text-sockx-cta" />
              <div>
                <h3 className="font-heading text-lg">{signal.title}</h3>
                <p className="font-body text-sm text-purple-200">
                  {signal.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
