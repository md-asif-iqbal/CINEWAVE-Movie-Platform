import Link from 'next/link';
import { Play, Film, Tv, Star, ChevronRight, Check } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen bg-cw-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cw-bg via-cw-bg/80 to-cw-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.15),_transparent_60%)]" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 tracking-tight">
            <span className="text-cw-red">Cine</span>Wave
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-cw-text-secondary mb-3 max-w-2xl mx-auto">
            Unlimited Movie & Series Streaming
          </p>
          <p className="text-sm sm:text-base text-cw-text-muted mb-8 max-w-xl mx-auto">
            Thousands of movies, series & documentaries — anytime, anywhere.
            2 months free trial!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto bg-cw-red hover:bg-cw-red-hover text-white font-semibold px-8 py-3.5 rounded-md transition-colors text-base sm:text-lg flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Play size={20} /> Start Free
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto border-2 border-[#555] hover:border-white text-white font-medium px-8 py-3.5 rounded-md transition-colors text-base flex items-center justify-center min-h-[48px]"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight size={24} className="text-cw-text-muted rotate-90" />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16">
            Why <span className="text-cw-red">CineWave</span>?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={<Film className="text-cw-red" size={32} />}
              title="Huge Content Library"
              description="Thousands of movies, series & documentaries in one place. New content added every day."
            />
            <FeatureCard
              icon={<Tv className="text-cw-red" size={32} />}
              title="Watch on Any Device"
              description="Mobile, tablet, laptop or desktop — seamless streaming on any device."
            />
            <FeatureCard
              icon={<Star className="text-cw-red" size={32} />}
              title="2 Months Free"
              description="No credit card required! Sign up and get a 2-month (60-day) free trial."
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-cw-bg-secondary">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Affordable Subscription Plans
          </h2>
          <p className="text-cw-text-secondary mb-10 sm:mb-14 max-w-lg mx-auto">
            Choose your preferred plan after the free trial ends
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            <PlanPreview
              plan="Monthly"
              price="৳20"
              period="/month"
              benefits={[
                'Unlimited Movies & Series',
                'HD Quality Streaming',
                'Watch on 1 Device',
                'Cancel Anytime',
                'New Releases Every Week',
              ]}
            />
            <PlanPreview
              plan="6 Months"
              price="৳100"
              period="/6 months"
              popular
              savings="Save ৳20"
              perMonth="৳16.67/mo"
              benefits={[
                'Unlimited Movies & Series',
                'Full HD Quality Streaming',
                'Watch on 2 Devices',
                'Download for Offline',
                'New Releases Every Week',
                'Priority Support',
              ]}
            />
            <PlanPreview
              plan="Yearly"
              price="৳200"
              period="/year"
              savings="Save ৳40"
              perMonth="৳16.67/mo"
              benefits={[
                'Unlimited Movies & Series',
                '4K Ultra HD Streaming',
                'Watch on 4 Devices',
                'Download for Offline',
                'New Releases Every Week',
                'Priority Support',
                'Exclusive Early Access',
                'Ad-Free Experience',
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Get Started Now
          </h2>
          <p className="text-cw-text-secondary mb-8 max-w-lg mx-auto">
            Create an account and enjoy unlimited content free for 2 months.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-cw-red hover:bg-cw-red-hover text-white font-semibold px-10 py-4 rounded-md transition-colors text-lg min-h-[48px]"
          >
            Create Free Account <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cw-border py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-cw-text-muted">
          <p className="font-bold text-white mb-2">
            <span className="text-cw-red">Cine</span>Wave
          </p>
          <p>© {new Date().getFullYear()} CineWave. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-cw-bg-card border-2 border-cw-border rounded-xl p-6 sm:p-8 text-center hover:border-cw-red/50 transition-colors">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-cw-text-secondary">{description}</p>
    </div>
  );
}

function PlanPreview({ plan, price, period, popular, savings, perMonth, benefits = [] }) {
  return (
    <div className={`rounded-xl border-2 flex flex-col text-left relative ${
      popular
        ? 'border-cw-red bg-cw-red/5 shadow-lg shadow-cw-red/10 scale-[1.02]'
        : 'border-cw-border bg-cw-bg-card'
    }`}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cw-red text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          Popular
        </span>
      )}

      {/* Header */}
      <div className="p-6 pb-4 border-b border-cw-border">
        <p className="text-cw-text-muted text-sm font-medium mb-2">{plan}</p>
        <p className="text-3xl sm:text-4xl font-black text-white">
          {price}
          <span className="text-sm font-normal text-cw-text-muted">{period}</span>
        </p>
        {perMonth && (
          <p className="text-xs text-cw-text-muted mt-1">{perMonth}</p>
        )}
        {savings && (
          <p className="text-xs text-green-400 font-semibold mt-1">{savings}</p>
        )}
      </div>

      {/* Benefits */}
      <ul className="p-6 space-y-3 flex-1">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-cw-text-secondary">
            <Check size={15} className="text-green-400 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          href="/auth/register"
          className={`block w-full text-center py-2.5 rounded-md font-semibold text-sm transition-colors ${
            popular
              ? 'bg-cw-red hover:bg-cw-red-hover text-white'
              : 'border-2 border-[#555] hover:border-white text-white'
          }`}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
