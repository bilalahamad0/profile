export const metadata = { title: 'Contact - Bilal Ahamad' };
export default function Contact() {
  return (
    <main id="maincontent" className="max-w-4xl mx-auto p-8 reveal">
      <h1 className="text-3xl font-semibold mb-6">Contact</h1>
      <form className="grid grid-cols-1 gap-4 max-w-lg" method="get" action="mailto:bilal.ahamad@gmail.com" aria-label="Contact form">
        <input className="p-3 border rounded" name="name" type="text" placeholder="Your Name" required />
        <input className="p-3 border rounded" name="email" type="email" placeholder="Your Email" required />
        <textarea className="p-3 border rounded" name="message" placeholder="Message" required></textarea>
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded">Send</button>
      </form>
      <p className="mt-4">Email: <a className="text-blue-600 underline" href="mailto:bilal.ahamad@gmail.com">bilal.ahamad@gmail.com</a></p>
      <p>LinkedIn: <a className="text-blue-600 underline" href="https://linkedin.com/in/bilalahamad" target="_blank" rel="noopener noreferrer">bilalahamad</a></p>
    </main>
  );
}
