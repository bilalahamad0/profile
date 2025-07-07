export const metadata = { title: 'Experience - Bilal Ahamad' };
export default function Experience() {
  const jobs = [
    {
      role: 'Senior Test Lead',
      company: 'Samsara Inc',
      location: 'San Francisco, CA',
      dates: 'Dec 2023 - Present',
      bullets: [
        'Spearhead system tests and execution for IoT Dash Cam fleets within the AI/ML video-based safety ecosystem.',
        'Develop automation pipelines focusing on video quality, AI/ML accuracy, performance and connectivity.',
        'Cut regression cycles by 50% while improving release cadence.',
      ],
    },
    {
      role: 'Test Automation Lead',
      company: 'Cruise LLC',
      location: 'San Francisco, CA',
      dates: 'Oct 2022 - Jun 2023',
      bullets: [
        'Managed complete test delivery of vehicle computational systems with multiple firmware releases.',
        'Designed an automation framework for CPU/GPU integration, fault tolerance, networking, telematics and V2X.',
      ],
    },
    {
      role: 'Infotainment Test Lead',
      company: 'Rivian Automotive LLC',
      location: 'Palo Alto, CA',
      dates: 'Jun 2021 - Sep 2022',
      bullets: [
        'Directed testing strategy for R1T, R1S and Fleet infotainment systems.',
        'Built automation for QNX and Android platforms covering OTA updates, UI/UX, connectivity and navigation.',
        'Ensured integration testing and performance validation during continuous releases.',
      ],
    },
    {
      role: 'Senior QA Engineer II & Technical Lead',
      company: 'Amazon Lab126',
      location: 'Sunnyvale, CA',
      dates: 'Jun 2018 - Jun 2021',
      bullets: [
        'Led QA for Echo Buds, Echo Auto and Dash Button from concept to production.',
        'Built automation for voice accuracy, wake word, ANC, audio quality and connectivity reducing manual effort by 80%.',
        'Established CI/CD pipeline across 50+ Android/iOS devices cutting post-launch issues by 30%.',
      ],
    },
    {
      role: 'Software Test Engineer',
      company: 'Tech Mahindra / Google Inc',
      location: 'Mountain View, CA',
      dates: 'Jan 2016 - Jun 2018',
      bullets: [
        'Led system testing for Google VR Controllers enabling Daydream View headset success.',
        'Created comprehensive feature coverage, KPI benchmarking and commercialization readiness.',
      ],
    },
    {
      role: 'Test Engineer',
      company: 'Cognizant Technology / Cisco',
      location: 'Boston, MA',
      dates: 'Sep 2015 - Jan 2016',
      bullets: [
        'Created a Python-based automation framework for Set-top-Box video streaming applications.',
        'Expanded test scope by 40% and halved execution time.',
      ],
    },
    {
      role: 'Radio Validation Engineer',
      company: 'Wistron Mobile Solutions Corp',
      location: 'Rolling Meadows, IL',
      dates: 'Dec 2014 - Sep 2015',
      bullets: [
        'Led Wi-Fi Alliance pre-certification and interoperability testing for Android and BlackBerry handsets.',
      ],
    },
    {
      role: 'Senior Software Engineer in Test',
      company: 'L&T Tech Services / Motorola Mobility',
      location: 'Chicago, IL',
      dates: 'Oct 2009 - Dec 2014',
      bullets: [
        'Pioneered Bluetooth test automation for certification reducing LOE by 70% and cycle time drastically.',
        'Built a modular three-tier automation infrastructure to enhance code reuse.',
      ],
    },
    {
      role: 'Test Engineer',
      company: 'Luminous Infoways',
      location: 'Bhubaneswar, India',
      dates: 'Oct 2008 - Sep 2009',
      bullets: [
        'Led functional and integration testing for major web portal applications.',
      ],
    },
  ];
  return (
    <main id="maincontent" className="max-w-4xl mx-auto p-8 reveal">
      <h1 className="text-3xl font-semibold mb-6">Work Experience</h1>
      <div className="relative border-l-2 border-gray-300 dark:border-gray-600 ml-4">
        {jobs.map((job, i) => (
          <details
            key={job.role + i}
            className="relative mb-8 pl-8 group"
          >
            <summary className="cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between">
              <span className="font-semibold">
                {job.role}, {job.company}
              </span>
              <span className="text-sm text-gray-500">
                {job.location} – {job.dates}
              </span>
            </summary>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <span className="absolute -left-4 top-3 w-3 h-3 bg-blue-600 rounded-full"></span>
          </details>
        ))}
      </div>
    </main>
  );
}
