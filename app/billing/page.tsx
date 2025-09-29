import { BillingSummary } from "@/components/billing-summary"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">Billing</h1>
      </header>
      <BillingSummary />
    </div>
  )
}
