export const metadata = { title: 'Projects - Bilal Ahamad' };
const projects = [
  { name: 'Automation Pipelines', desc: 'Reduced regression cycle by 50% via intelligent pipelines.', link: '#' },
  { name: 'Infotainment Framework', desc: 'Developed frameworks for QNX and Android platforms.', link: '#' },
  { name: 'CI/CD Release Optimization', desc: 'Achieved 30% fewer post-launch issues with continuous testing.', link: '#' }
];
export default function Projects() {
  return (
    <main className="max-w-4xl mx-auto p-8 space-y-6 reveal">
      <h1 className="text-3xl font-semibold mb-6">Projects</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map(p => (
          <a key={p.name} href={p.link} className="glass p-6 rounded-lg hover:shadow-2xl transition block">
            <h3 className="font-semibold text-xl mb-2">{p.name}</h3>
            <p>{p.desc}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
