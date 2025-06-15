import HeroSection from '../components/home/hero-section'
import FeaturesSection from '../components/home/features-section'
import HowItWorksSection from '../components/home/how-it-works-section'
import VisualPreviewSection from '../components/home/visual-preview-section'
import TestimonialsSection from '../components/home/testimonials-section'
import CTASection from '../components/home/cta-section'
import FAQSection from '../components/home/faq-section'

export default function HomePage() {
	return (
		<div>
			<HeroSection />
			<VisualPreviewSection />
			<FeaturesSection />
			<HowItWorksSection />
			<TestimonialsSection />
			<CTASection />
			<FAQSection />
		</div>
	)
}