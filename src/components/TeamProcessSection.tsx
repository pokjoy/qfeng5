// src/components/TeamProcessSection.tsx
'use client'

export default function TeamProcessSection({
  team,
  process,
  timeline,
}: {
  team: string[]
  process: string[]
  timeline?: string
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 className="font-semibold mb-2">Team</h4>
        <ul className="list-disc list-inside space-y-1">
          {team.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Process</h4>
        <ul className="list-disc list-inside space-y-1">
          {process.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>
      {timeline && (
        <div>
          <h4 className="font-semibold mb-2">Timeline</h4>
          <p>{timeline}</p>
        </div>
      )}
    </div>
  )
}
