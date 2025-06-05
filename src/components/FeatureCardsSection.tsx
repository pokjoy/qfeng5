// src/components/FeatureCardsSection.tsx
'use client'

export default function FeatureCardsSection({
  features,
}: {
  features: { icon: string; title: string; desc: string }[]
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((f, i) => (
        <div
          key={i}
          className="p-6 bg-white rounded-xl shadow text-center flex flex-col items-center"
        >
          <div className="text-5xl">{f.icon}</div>
          <h4 className="mt-4 font-semibold">{f.title}</h4>
          <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
        </div>
      ))}
    </section>
  )
}
