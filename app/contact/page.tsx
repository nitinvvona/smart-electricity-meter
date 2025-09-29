import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">Contact Support</h1>
      </header>
      <ContactForm />
    </div>
  )
}
