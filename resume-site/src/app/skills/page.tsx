export const metadata = { title: 'Skills - Bilal Ahamad' };
export default function Skills() {
  const skills = ['Technical Leadership', 'Strategic Planning', 'Test Automation', 'Automotive + Infotainment', 'IoT, Wearables, AR/VR', 'CI/CD'];
  const tools = [
    'Python',
    'JavaScript',
    'Shell',
    'Selenium',
    'Appium',
    'Jenkins',
    'Git',
    'Bazel',
    'JIRA',
    'Wireshark',
    'CAN Analyzers',
    'Raspberry Pi',
    'Arduino',
  ];
  const systems = ['Android', 'iOS', 'QNX', 'Linux', 'Unix', 'RTOS'];
  return (
    <main id="maincontent" className="max-w-4xl mx-auto p-8 space-y-8 reveal">
      <h1 className="text-3xl font-semibold">Skills & Core Competencies</h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 list-disc list-inside">
        {skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Languages & Tools</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-disc list-inside">
          {tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Systems</h2>
        <ul className="flex flex-wrap gap-3 list-disc list-inside">
          {systems.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
