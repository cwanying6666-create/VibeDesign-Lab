import type { ArticleEntry } from '../content';
export type OrbitPoint = { x: number; y: number; z: number; radius: number; id: string; index: number };
export function categoriesFor(entries: ArticleEntry[]) {
  return [...new Set(entries.map(e => e.category?.trim()).filter((c): c is string => !!c))];
}
export function filterArticles(entries: ArticleEntry[], category: string | null) {
  return category === null ? entries : entries.filter(e => e.category?.trim() === category);
}
export function orbitPosition(phase: number, plane: number, yaw: number, pitch: number, width: number, height: number) {
  const x = Math.cos(phase), y = Math.sin(phase) * Math.cos(plane), z = Math.sin(phase) * Math.sin(plane);
  const rx = x * Math.cos(yaw) + z * Math.sin(yaw), rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
  const ry = y * Math.cos(pitch) - rz * Math.sin(pitch), depth = y * Math.sin(pitch) + rz * Math.cos(pitch);
  const scale = 1 + depth * 0.12;
  const orbitRadius = Math.min(width, height) * 0.34;
  return { x: width / 2 + rx * orbitRadius * scale, y: height / 2 + ry * orbitRadius * scale, z: depth };
}
export function projectArticles(entries: ArticleEntry[], yaw: number, pitch: number, width: number, height: number, radius: number): OrbitPoint[] {
  return entries.map((entry, index) => {
    const phase = index * Math.PI * 2 / Math.max(1, entries.length) + 0.3;
    const point = orbitPosition(phase, (index % 4) * 0.65 + 0.35, yaw, pitch, width, height);
    return { ...point, id: entry.id, index, radius: radius * (1 + point.z * 0.22) };
  }).sort((a, b) => a.z - b.z);
}
export function hitArticle(points: OrbitPoint[], x: number, y: number) {
  return [...points].reverse().find(point => Math.hypot(point.x - x, point.y - y) <= point.radius);
}
