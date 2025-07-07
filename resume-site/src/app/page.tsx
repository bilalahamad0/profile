export default function Home() {
  return (
    <main id="maincontent" className="max-w-5xl mx-auto p-8 space-y-16">
      <section className="flex flex-col-reverse md:flex-row items-center gap-10 reveal">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold mb-4">Bilal Ahamad</h1>
          <p className="text-xl mb-6">
            Accomplished Technical QA Lead and Manager with over 16 years of
            experience delivering high-quality automotive, IoT and wearable products.
          </p>
          <div className="space-x-4">
            <a href="/Bilal_Ahamad_Resume.pdf" className="px-6 py-3 rounded bg-blue-600 text-white" download>Download Resume</a>
            <a href="/contact" className="px-6 py-3 rounded bg-gray-200 dark:bg-gray-700">Get in Touch</a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop" alt="Professional headshot of Bilal Ahamad" className="rounded-full w-64 h-64 object-cover" />
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 reveal">
        <div className="glass p-6 text-center">
          <p className="text-3xl font-bold">50%+</p>
          <p className="mt-2">Regression cycle reduction</p>
        </div>
        <div className="glass p-6 text-center">
          <p className="text-3xl font-bold">30%</p>
          <p className="mt-2">Fewer post-launch issues</p>
        </div>
        <div className="glass p-6 text-center">
          <p className="text-3xl font-bold">80%</p>
          <p className="mt-2">Manual effort saved</p>
        </div>
      </section>
    </main>
  );
}
