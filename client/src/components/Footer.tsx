import { useState } from "react"
import { Link } from "react-router-dom"

/* ------------------------------------------------------------------ */
/*  Static link data                                                    */
/* ------------------------------------------------------------------ */

const shopLinks = [
  { label: "All Products", to: "/" },
  { label: "Men", to: "/" },
  { label: "Women", to: "/" },
  { label: "Accessories", to: "/" },
  { label: "New Arrivals", to: "/" },
  { label: "Offers", to: "/" },
]

const careLinks = [
  { label: "Contact Us", to: "/" },
  { label: "FAQ", to: "/" },
  { label: "Shipping & Delivery", to: "/" },
  { label: "Returns & Refunds", to: "/" },
  { label: "Size Guide", to: "/" },
  { label: "Track Order", to: "/" },
]

const aboutLinks = [
  { label: "About Us", to: "/" },
  { label: "Our Story", to: "/" },
  { label: "Privacy Policy", to: "/" },
  { label: "Terms & Conditions", to: "/" },
  { label: "Blogs", to: "/" },
  { label: "Careers", to: "/" },
]

/* ------------------------------------------------------------------ */
/*  Small reusable column                                              */
/* ------------------------------------------------------------------ */

interface FooterColumnProps {
  heading: string
  links: { label: string; to: string }[]
}

const FooterColumn = ({ heading, links }: FooterColumnProps) => (
  <div className="flex flex-col gap-2">
    <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white">
      {heading}
    </h3>
    <ul className="flex flex-col gap-[9px]">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.to}
            className="text-[13px] text-[#9a9a9a] transition-colors duration-150 hover:text-white"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

/* ------------------------------------------------------------------ */
/*  Payment badge                                                       */
/* ------------------------------------------------------------------ */

const PaymentBadge = ({ label }: { label: string }) => (
  <span className="inline-flex h-7 min-w-[44px] items-center justify-center rounded border border-[#3a3a3a] bg-[#1a1a1a] px-2 text-[11px] font-bold tracking-wide text-white">
    {label}
  </span>
)

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

const Footer = () => {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail("")
  }

  return (
    <footer className="w-full bg-[#111111]">
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">

          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-3 md:col-span-3 lg:col-span-1">
            <span className="text-xl font-extrabold tracking-tight text-white">
              NEXORA
            </span>
            <p className="text-[13px] leading-relaxed text-[#9a9a9a]">
              Elevate your style with Nexora.
              <br />
              Premium quality. Timeless fashion.
            </p>
          </div>

          {/* Shop */}
          <FooterColumn heading="Shop" links={shopLinks} />

          {/* Customer Care */}
          <FooterColumn heading="Customer Care" links={careLinks} />

          {/* About */}
          <FooterColumn heading="About" links={aboutLinks} />

          {/* Newsletter */}
          <div className="col-span-2 flex flex-col gap-3 md:col-span-3 lg:col-span-1">
            <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white">
              Newsletter
            </h3>
            <p className="text-[13px] leading-relaxed text-[#9a9a9a]">
              Subscribe to get special offers, free giveaways, and deals.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mt-1 flex items-center overflow-hidden"
              aria-label="Newsletter subscription form"
            >
              <input
                id="footer-newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
                className="flex-1 min-w-0 rounded-l border border-[#2e2e2e] border-r-0 bg-[#1e1e1e] px-3 py-2 text-[13px] text-white placeholder-[#5a5a5a] outline-none transition-colors focus:border-[#ff5a1f]"
              />
              <button
                type="submit"
                id="footer-newsletter-subscribe"
                className="shrink-0 rounded-r bg-[#ff5a1f] px-3 py-2 text-[12px] font-semibold text-white transition-colors duration-150 hover:bg-[#e04e18] active:bg-[#c94212]"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2a2a2a]" />

      {/* Bottom bar */}
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-16">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[#6a6a6a]">
            © 2025 Nexora. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-[11px] text-[#6a6a6a]">We Accept</span>
            <PaymentBadge label="VISA" />
            <PaymentBadge label="UPI" />
            <PaymentBadge label="R" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
