import Header from '../components/Header';

export default function Affiliates() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Affiliate Program
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Earn commissions by promoting our platform
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Join Our Affiliate Program
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Our affiliate program offers generous commissions for promoting our blogging platform. 
              Share our platform with your audience and earn rewards for every new user you refer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">30%</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Commission Rate</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Earn 30% commission on every referral
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">$50</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Minimum Payout</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Low minimum threshold for easy payouts
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">90</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Day Cookie</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Extended tracking period for referrals
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Sign Up</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Register for our affiliate program and get your unique referral link
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Share Your Link</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Promote our platform using your referral link on your blog, social media, or website
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Earn Commissions</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get paid when users sign up through your referral link
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Earning?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join our affiliate program today and start earning commissions
            </p>
            <button className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium">
              Join Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

