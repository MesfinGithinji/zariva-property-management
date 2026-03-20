export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Logo placeholder */}
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-gold-400/30">
            <div className="text-gold-400 text-6xl font-bold">ZARIVA</div>
            <div className="text-cream text-xl mt-2">AFRICA PROPERTIES LTD.</div>
          </div>
        </div>

        {/* Welcome text */}
        <div className="text-white">
          <h1 className="text-5xl font-bold mb-4">
            Property Management <span className="text-gold-400">Reimagined</span>
          </h1>
          <p className="text-xl text-cream/90 max-w-2xl mx-auto">
            Your trusted real estate partner for modern property management,
            tenant relations, and seamless operations.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/landlord"
            className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-primary-950 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Landlord Portal
          </a>
          <a
            href="/tenant"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-lg transition-all border border-gold-400/30"
          >
            Tenant Portal
          </a>
          <a
            href="/admin"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-lg transition-all border border-gold-400/30"
          >
            Admin
          </a>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold-400/20">
            <div className="text-gold-400 text-2xl mb-2">📊</div>
            <h3 className="text-white font-semibold mb-2">Real-time Insights</h3>
            <p className="text-cream/80 text-sm">Track payments, occupancy, and performance metrics instantly</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold-400/20">
            <div className="text-gold-400 text-2xl mb-2">🔧</div>
            <h3 className="text-white font-semibold mb-2">Easy Maintenance</h3>
            <p className="text-cream/80 text-sm">Submit and track maintenance requests with photos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold-400/20">
            <div className="text-gold-400 text-2xl mb-2">💰</div>
            <h3 className="text-white font-semibold mb-2">Seamless Payments</h3>
            <p className="text-cream/80 text-sm">M-Pesa integration for instant rent payments</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-cream/60 text-sm pt-8">
          <p>Nairobi, Kenya | info@zariafrica.com | +254 708 688 507</p>
          <p className="mt-2">© 2026 Zariva Africa Properties Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
