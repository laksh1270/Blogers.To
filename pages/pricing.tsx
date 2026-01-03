import Header from '../components/Header';

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Unlimited blog posts",
        "Basic image uploads",
        "Comments system",
        "User profiles",
        "Category filtering",
        "Dark mode",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      features: [
        "Everything in Free",
        "Advanced analytics",
        "Priority support",
        "Custom domain",
        "Brand blog promotion",
        "Email newsletters",
        "SEO optimization",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "Custom integrations",
        "Advanced security",
        "Team collaboration",
        "API access",
        "White-label options",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose the perfect plan for your blogging needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 ${
                plan.highlighted
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400 transform scale-105'
                  : ''
              }`}
            >
              {plan.highlighted && (
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                {plan.period !== "pricing" && (
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    /{plan.period}
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-md font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </main>
    </div>
  );
}

