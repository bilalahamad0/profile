export const metadata = { title: 'Skills - Bilal Ahamad' };
export default function Skills() {
  const skills = ['Technical Leadership', 'Strategic Planning', 'Test Automation', 'Automotive + Infotainment', 'IoT, Wearables, AR/VR', 'CI/CD'];
  return (
    <main id="maincontent" className="max-w-4xl mx-auto p-8 space-y-6 reveal">
      <h1 className="text-3xl font-semibold mb-4">Skills & Core Competencies</h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 list-disc list-inside text-lg">
        {skills.map(s => <li key={s}>{s}</li>)}
      </ul>
    </main>
  );
}
