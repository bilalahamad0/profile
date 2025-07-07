export const metadata = { title: 'Skills - Bilal Ahamad' };
export default function Skills() {
  const skills = ['Technical Leadership', 'Strategic Planning', 'Test Automation', 'Automotive + Infotainment', 'IoT, Wearables, AR/VR', 'CI/CD'];
  const languagesTools = [
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
  const methodologies = ['Agile', 'Waterfall', 'Scrum', 'CI/CD'];
  const dataViz = ['Splunk', 'Datadog', 'Databricks', 'Grafana', 'Kibana', 'GraphQL'];
  const systems = ['Android', 'iOS', 'QNX', 'Linux', 'Unix', 'RTOS'];
  return (
    <main id="maincontent" className="max-w-4xl mx-auto p-8 space-y-8 reveal">
      <h1 className="text-3xl font-semibold">Skills &amp; Core Competencies</h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 list-disc list-inside">
        {skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Technical Proficiencies</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x">
        <div className="space-y-2 sm:pr-6">
          <h3 className="font-semibold">Languages &amp; Tools</h3>
          <ul className="ml-4 list-disc space-y-1">
            {languagesTools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 sm:px-6">
          <h3 className="font-semibold">Methodologies</h3>
          <ul className="ml-4 list-disc space-y-1">
            {methodologies.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 sm:px-6">
          <h3 className="font-semibold">Data Visualization</h3>
          <ul className="ml-4 list-disc space-y-1">
            {dataViz.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 sm:pl-6">
          <h3 className="font-semibold">Systems</h3>
          <ul className="ml-4 list-disc space-y-1">
            {systems.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
