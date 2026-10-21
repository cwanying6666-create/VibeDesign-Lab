export function ExperienceGroup({ title, items }: { title: string; items: string[] }) {
  return <section className="experience-group" aria-label={title}><h3>{title}</h3><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></section>;
}
