'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Leaf, Star } from 'lucide-react'

const values = [
  {
    icon: Leaf,
    title: 'Farm Fresh',
    desc: 'We hand-pick every mango at the exact moment of peak ripeness. No early picking, no artificial ripening. What you receive is exactly what you\'d pick from the tree — fragrant, sweet, and full of flavour.',
    story: 'Our farmers have spent decades learning to read a mango. They know by touch and color when a Chaunsa is ready to leave the branch. That instinct takes years to develop — and it\'s what makes all the difference.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'From tree to your doorstep in the shortest time possible. Your mangoes are packed within hours of harvest and shipped the same day.',
    story: 'Most store-bought mangoes are picked green and ripened in cold storage during transit. Ours never touch a cold chain. That\'s why they taste the way mangoes should.',
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    desc: 'Every single box is checked before it leaves our packing house. If anything isn\'t right, we make it right — no quibbling, no fine print.',
    story: 'We\'ve been doing this long enough to know what can go wrong. That\'s why we inspect every order personally. If a mango arrives bruised or underripe, we replace it. Simple as that.',
  },
  {
    icon: Star,
    title: 'Genuine Variety',
    desc: 'We work only with verified growers and sell true-to-type Chaunsa, Sindhri, Dusehri, and Langra — not imitation varieties from other regions.',
    story: 'Pakistan\'s mango reputation has suffered from counterfeit exports. When you order Malir Mangoes, you\'re getting the real thing — verified provenance from orchards we know by name.',
  },
]

const team = [
  {
    name: 'Malir Orchards Collective',
    role: 'Farm Partners',
    desc: 'A cooperative of family-owned farms across Multan and Sindh, cultivating mangoes for generations.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/hero.jpg"
            alt="Mango orchard"
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold rounded-full mb-6">
            <Leaf className="w-3 h-3" />
            Our Story
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            From Our Orchards to<br />
            <span className="text-mango">Your Doorstep</span>
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
            We started Malir Mangoes to bring the authentic taste of Pakistan&apos;s finest mangoes directly to your table — no middlemen, no compromises.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 h-12 px-8 bg-mango hover:bg-mango-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-mango/20"
          >
            Shop Mangoes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-mango uppercase tracking-wider">Who We Are</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            A Passion for Perfect Mangoes
          </h2>
        </div>

        <div className="prose prose-slate max-w-none space-y-5 text-slate-600 text-base sm:text-lg leading-relaxed">
          <p>
            Pakistan produces some of the world&apos;s finest mangoes — Chaunsa, Sindhri, Anwar Ratol, Langra — varieties that are celebrated globally for their sweetness, aroma, and texture. Yet most of what reaches consumers in cities is picked early, artificially ripened, and stripped of flavor.
          </p>
          <p>
            Malir Mangoes was born from a simple belief: you deserve to taste a mango the way it was meant to be. We work directly with a network of family farms in Multan and Sindh — farms that have been cultivating mangoes for three, four, sometimes five generations.
          </p>
          <p>
            When you order from us, your mangoes are hand-picked at peak ripeness, packed the same day, and shipped with care. We use temperature-controlled packaging so they arrive fresh, fragrant, and exactly as nature intended.
          </p>
          <p>
            Whether you&apos;re treating yourself or sending a gift box to someone special, every Malir Mangoes order is a promise: premium quality, honest sourcing, and mangoes you can truly taste.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-mango uppercase tracking-wider">What We Stand For</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">Our Values</h2>
          </div>

          <div className="space-y-8">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 flex gap-5 items-start"
              >
                <div className="w-12 h-12 bg-mango-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-mango" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{value.desc}</p>
                  <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-mango/20 pl-3">{value.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Partners */}
      <section className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-mango uppercase tracking-wider">Our People</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">The Farmers Behind Every Box</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {team.map(member => (
            <div key={member.name} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-mango rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-900 text-center mb-1">{member.name}</h3>
              <p className="text-xs font-semibold text-mango uppercase tracking-wider text-center mb-3">{member.role}</p>
              <p className="text-sm text-slate-500 leading-relaxed text-center">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mango overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Ready to taste the difference?
          </h2>
          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md mx-auto">
            Browse our selection of premium Pakistani mangoes and order your box today.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 h-12 px-8 bg-white text-mango hover:bg-slate-50 font-semibold rounded-xl transition-colors"
          >
            Shop Mangoes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
