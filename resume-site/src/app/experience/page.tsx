export const metadata = { title: 'Experience - Bilal Ahamad' };
export default function Experience() {
  const jobs = [
    {
      title: 'Senior Test Lead, Samsara Inc',
      period: 'Dec 2023 - Present',
      desc:
        'Spearheading system tests and automation for IoT Dash Cam products focused on AI/ML driver safety.',
    },
    {
      title: 'Test Automation Lead, Cruise LLC',
      period: 'Oct 2022 - Jun 2023',
      desc:
        'Managed firmware releases and developed a CPU/GPU integration framework ensuring vehicle reliability.',
    },
    {
      title: 'Infotainment Test Lead, Rivian Automotive LLC',
      period: 'Jun 2021 - Sep 2022',
      desc:
        'Directed end-to-end testing for R1T, R1S and Fleet infotainment systems with OTA updates and connectivity.',
    },
    {
      title: 'Senior QA Engineer II & Technical Lead, Amazon Lab126',
      period: 'Jun 2018 - Jun 2021',
      desc:
        'Led QA for Alexa-enabled IoT products including Echo Buds and Echo Auto, building automation to reduce manual effort by 80%.',
    },
    {
      title: 'Software Test Engineer, Tech Mahindra / Google',
      period: 'Jan 2016 - Jun 2018',
      desc:
        'Drove system testing for Google’s VR Controller, contributing to successful Daydream launches.',
    },
    {
      title: 'Test Engineer, Cognizant Technology / Cisco',
      period: 'Sep 2015 - Jan 2016',
      desc:
        'Created Python automation for Set‑top‑Box streaming, expanding scope by 40% and halving execution time.',
    },
    {
      title: 'Radio Validation Engineer, Wistron Mobile Solutions',
      period: 'Dec 2014 - Sep 2015',
      desc: 'Led Wi-Fi Alliance compliance testing on Android and BlackBerry handsets.',
    },
    {
      title: 'Senior Software Engineer in Test, L&T Tech Services / Motorola Mobility',
      period: 'Oct 2009 - Dec 2014',
      desc:
        'Developed Bluetooth qualification automation, reducing certification cycle time and improving reusability.',
    },
    {
      title: 'Test Engineer, Luminous Infoways',
      period: 'Oct 2008 - Sep 2009',
      desc: 'Led functional and integration testing for web portal applications.',
    },
  ];
  return (
    <main id="maincontent" className="max-w-4xl mx-auto p-8 reveal">
      <h1 className="text-3xl font-semibold mb-6">Work Experience</h1>
      <div className="relative border-l-2 border-gray-300 dark:border-gray-600 ml-4">
        {jobs.map(job => (
          <div key={job.title} className="relative mb-8 pl-8">
            <span className="absolute -left-4 top-2 w-3 h-3 bg-blue-600 rounded-full"></span>
            <h3 className="font-semibold">{job.title}</h3>
            <span className="text-sm text-gray-500">{job.period}</span>
            <p className="mt-2">{job.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
