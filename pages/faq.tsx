import { useState } from 'react';
import Header from '../components/Header';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I create a blog post?",
      answer: "To create a blog post, you need to sign in with your GitHub account. Once logged in, navigate to the blog creation page where you can add your title, content, category, and images. Your posts will be saved to Sanity CMS."
    },
    {
      question: "Can I edit or delete my posts?",
      answer: "Yes! When viewing one of your blog posts, you'll see Edit and Delete buttons. Click Edit to modify your post or Delete to remove it permanently. Please note that deleted posts cannot be recovered."
    },
    {
      question: "How do I add images to my blog posts?",
      answer: "You can add images through the image upload feature in the blog creation form. Images are stored securely and will be displayed in your blog posts. Supported formats include JPG, PNG, and GIF."
    },
    {
      question: "What categories can I use?",
      answer: "We support several categories: Tech, Health, Food, Education, and Places. Choose the category that best fits your content when creating or editing a post."
    },
    {
      question: "How do comments work?",
      answer: "Comments are enabled by default on all blog posts. Readers can leave comments with ratings (1-5 stars), their name, email, and comment text. You can disable comments for specific posts if needed."
    },
    {
      question: "Can I customize my author profile?",
      answer: "Your author profile is automatically created when you sign in with GitHub. It displays your GitHub profile picture, name, join date, and the number of posts you've published. Profiles are viewable by all visitors."
    },
    {
      question: "Is there a character limit for blog posts?",
      answer: "There's no strict character limit for blog posts. However, we recommend keeping your content readable and engaging. The rich text editor supports formatting, headings, lists, and more."
    },
    {
      question: "How do I enable dark mode?",
      answer: "Click the theme toggle button in the header (moon/sun icon) to switch between light and dark modes. Your preference will be saved for future visits."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find answers to common questions about our platform
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

