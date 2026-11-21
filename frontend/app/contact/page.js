import ContactForm from "../../components/contact/ContactForm";

export const metadata = { title: "Contact | Podcast Academy" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-display text-4xl font-bold">Contact us</h1>
      <p className="mt-3 text-muted">
        Questions about courses or enrolment? Send us a message and we will get back to you.
      </p>
      <div className="mt-8 rounded-xl border border-ink/10 bg-white p-6">
        <ContactForm />
      </div>
    </div>
  );
}