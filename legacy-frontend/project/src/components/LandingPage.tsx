import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import TOPOLOGY from "vanta/dist/vanta.topology.min";
import {
  Bitcoin,
  Shield,
  Zap,
  TrendingUp,
  Star,
  ArrowRight,
  Globe,
  Lock,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const [vantaEffect, setVantaEffect] = useState<any>(null);
const vantaRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!vantaEffect) {
    setVantaEffect(
      TOPOLOGY({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xffd700, // bitcoin gold
        backgroundColor: 0x000000, // black background
      }),
    );
  }
  return () => {
    if (vantaEffect) vantaEffect.destroy();
  };
}, [vantaEffect]);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <img
            src="/ICRoots logo, no background.png"
            alt="ICRoots Logo"
            className="h-10 w-10"
          />
          <span className="text-bitcoin-gold text-2xl font-bold drop-shadow-lg">
            ICRoots
          </span>
        </div>
        <div className="text-light-grey hidden space-x-8 md:flex">
          <a
            href="#how-it-works"
            className="hover:text-bitcoin-gold transition-colors"
          >
            How It Works
          </a>
          <a
            href="#why-icp"
            className="hover:text-bitcoin-gold transition-colors"
          >
            Why ICP
          </a>
          <a
            href="#testimonials"
            className="hover:text-bitcoin-gold transition-colors"
          >
            Reviews
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={vantaRef}
        className="relative mx-auto max-w-6xl overflow-hidden px-6 py-20 text-center text-white"
      >
        <div className="relative z-10">
          <h1 className="text-headline mb-6 leading-tight font-bold uppercase md:text-7xl">
            <span className="from-primary via-bitcoin-gold to-mint-green bg-gradient-to-r bg-clip-text text-transparent">
              Where Bitcoin
            </span>
            <br />
            <span className="text-white">Backs You</span>
          </h1>
          <p className="text-body text-light-grey/80 mx-auto mb-8 max-w-3xl md:text-xl">
            Powered by AI, Secured on ICP. The future of Bitcoin-backed lending
            is here.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 text-bitcoin-gold text-body shadow-soft hover:shadow-glow transform rounded-xl px-8 py-4 font-medium uppercase transition-all duration-300 hover:-translate-y-1"
            >
              Get Started <ArrowRight className="ml-2 inline" size={24} />
            </button>
            <button className="border-bitcoin-gold text-bitcoin-gold text-body hover:bg-bitcoin-gold hover:text-primary rounded-xl border-2 px-8 py-4 font-medium uppercase transition-all duration-300">
              Explore Platform
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-subheading mb-16 text-center font-medium text-white uppercase">
          How ICRoots Works
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Bitcoin className="text-bitcoin-gold h-12 w-12" />}
            title="Deposit Bitcoin"
            description="Securely deposit Bitcoin as collateral into your auto-generated ICP wallet"
          />
          <FeatureCard
            icon={<Zap className="text-trust-blue h-12 w-12" />}
            title="AI Assessment"
            description="Our AI evaluates your profile and provides instant loan pre-approval"
          />
          <FeatureCard
            icon={<TrendingUp className="text-mint-green h-12 w-12" />}
            title="Get Funded"
            description="Receive loans in fiat or USDT from our network of verified lenders"
          />
          <FeatureCard
            icon={<Shield className="text-primary h-12 w-12" />}
            title="Build Trust"
            description="Earn soulbound NFTs that grow your trust tier and unlock better rates"
          />
        </div>
      </section>

      {/* Why ICP & Bitcoin */}
      <section
        id="why-icp"
        className="bg-dark-charcoal/50 px-6 py-20 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-subheading mb-16 text-center font-medium text-white uppercase">
            Why ICP & Bitcoin?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <BenefitCard
              icon={<Lock className="text-trust-blue h-10 w-10" />}
              title="Secure"
              description="End-to-end encryption and decentralized architecture ensure your assets are always protected"
            />
            <BenefitCard
              icon={<Globe className="text-mint-green h-10 w-10" />}
              title="Transparent"
              description="All transactions are recorded on-chain with full auditability and transparency"
            />
            <BenefitCard
              icon={<Zap className="text-bitcoin-gold h-10 w-10" />}
              title="Borderless"
              description="Access global lending markets without geographic restrictions or traditional banking limits"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-subheading mb-16 text-center font-medium text-white uppercase">
          What Our Users Say
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <TestimonialCard
            quote="ICRoots made it incredibly easy to unlock the value of my Bitcoin without selling. The AI assessment was fair and fast."
            author="Sarah Chen"
            role="Borrower"
            rating={5}
          />
          <TestimonialCard
            quote="As a lender, I love the AI-powered borrower matching. It's helped me make informed decisions and earn consistent returns."
            author="Marcus Rivera"
            role="Lender"
            rating={5}
          />
          <TestimonialCard
            quote="The trust NFT system is genius. My rates improved as I built my reputation. It's lending gamified in the best way."
            author="Alex Petrov"
            role="Borrower"
            rating={5}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-light-grey px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <img
                src="/ICRoots logo, no background.png"
                alt="ICRoots Logo"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">ICRoots</span>
            </div>
            <p className="text-light-grey/70">Where Bitcoin Backs You</p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Platform</h3>
            <ul className="text-light-grey/70 space-y-2">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  For Borrowers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  For Lenders
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  AI Features
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <ul className="text-light-grey/70 space-y-2">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="text-light-grey/70 space-y-2">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Risk Disclosure
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-light-grey/20 text-light-grey/70 mt-8 border-t pt-8 text-center">
          <p className="text-caption">
            &copy; 2025 ICRoots. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-dark-charcoal/70 shadow-soft hover:shadow-glow transform rounded-2xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-2">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="mb-2 text-lg font-medium text-white">{title}</h3>
    <p className="text-body text-light-grey/70">{description}</p>
  </div>
);

const BenefitCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-dark-charcoal/70 shadow-soft rounded-2xl p-8 text-center backdrop-blur-sm">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="mb-4 text-lg font-medium text-white">{title}</h3>
    <p className="text-body text-light-grey/70">{description}</p>
  </div>
);

const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  role: string;
  rating: number;
}> = ({ quote, author, role, rating }) => (
  <div className="bg-dark-charcoal/70 shadow-soft rounded-2xl p-6 backdrop-blur-sm">
    <div className="mb-4 flex">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="text-bitcoin-gold h-5 w-5 fill-current" />
      ))}
    </div>
    <p className="text-light-grey/80 text-body mb-4 italic">"{quote}"</p>
    <div>
      <p className="font-medium text-white">{author}</p>
      <p className="text-caption text-light-grey/60">{role}</p>
    </div>
  </div>
);

export default LandingPage;
