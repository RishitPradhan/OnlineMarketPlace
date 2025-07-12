import React from 'react';
import { useNavigate } from 'react-router-dom';

const GettingStartedPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Complete Your Profile",
      description: "Add your photo, bio, and professional information to build trust with clients.",
      action: "Go to Profile",
      link: "/profile"
    },
    {
      title: "Create Your First Gig",
      description: "Set up your services with clear descriptions, pricing, and portfolio examples.",
      action: "Create Gig",
      link: "/services"
    },
    {
      title: "Add Portfolio Items",
      description: "Showcase your best work to attract high-quality clients and projects.",
      action: "Add Portfolio",
      link: "/portfolio"
    },
    {
      title: "Set Your Skills",
      description: "List your technical skills and expertise to improve your discoverability.",
      action: "Set Skills",
      link: "/skills"
    },
    {
      title: "Set Up Payment",
      description: "Configure your payment methods to start earning from your projects.",
      action: "Payment Setup",
      link: "/dashboard?tab=payments"
    }
  ];

  const proTips = [
    "Use high-quality images for your portfolio",
    "Write detailed, benefit-focused gig descriptions",
    "Set competitive but fair pricing",
    "Respond quickly to client messages",
    "Always deliver work on time or early"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to MyFreelanceHub! 🚀
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Let's get you started on your freelancing journey. Follow these steps to set up your profile and start earning.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Your Progress</h2>
            <span className="text-green-400 font-medium">2/5 Complete</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* Steps */}
        <div className="grid gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-green-500/30 transition-all duration-300 hover:scale-[1.01]">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      index < 2 ? 'bg-green-500 text-black' : 'bg-dark-600 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-300 mb-4">{step.description}</p>
                    <button
                      onClick={() => navigate(step.link)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                      {step.action}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                {index < 2 && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Pro Tips 💡</h2>
          <div className="grid gap-4">
            {proTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard?tab=profile')}
            className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Complete Profile First
          </button>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedPage; 