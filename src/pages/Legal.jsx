const Legal = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About & Legal</h1>

      <div className="space-y-8">
        <section className="card">
          <h2 className="text-2xl font-bold mb-4">About PIQ Labs</h2>
          <p className="text-gray-700 leading-relaxed">
            PIQ is a sophisticated financial analysis tool designed to provide retail investors with AI-powered insights into their portfolios. 
            By leveraging a suite of asynchronous analysis tools—including Macro, Market, Mathematical, Sentiment, and Optimization—our application 
            offers a progressive and in-depth look at your financial holdings. Our mission is to empower you with data-driven intelligence to help 
            you better understand your investments and make more informed decisions.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Disclaimer: Not Financial Advice</h2>
          <p className="text-gray-700 leading-relaxed">
            The content, data, analysis, visualizations, and tools provided within the PIQ application are for informational and educational purposes only. 
            They do not constitute, and should not be interpreted as, financial, investment, trading, tax, legal, or any other form of professional advice. 
            PIQ is not a registered investment advisor, broker-dealer, or financial planner. All investment decisions based on information from the app are 
            your own, and you assume full responsibility for the outcomes.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Terms of Use</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            By using the PIQ application, you agree to our terms of use. This includes understanding our subscription model, your responsibilities as a user, 
            and the limitations of our liability. You agree not to hold PIQ Labs or its affiliates responsible for any investment losses or financial decisions. 
            We reserve the right to modify these terms at any time and will post updates to this page.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Subscription Terms & Billing</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            PIQ Labs offers auto-renewable subscriptions that unlock higher usage limits and advanced analytics. Current plan options are:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>
              <strong>Free Plan:</strong> No charge. Includes up to 5 holdings per analysis, 5 analyses per month, and our agentic AI portfolio lab.
            </li>
            <li>
              <strong>Basic Plan:</strong> $2.99 per month or $29.99 per year. Includes up to 20 holdings per analysis, 10 analyses per month.
            </li>
            <li>
              <strong>Plus Plan:</strong> $5.99 per month or $59.99 per year. Includes up to 40 holdings per analysis, 20 analyses per month.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Subscriptions renew automatically unless cancelled at least 24 hours before the current period ends. Payment is charged to your Apple ID account 
            at confirmation of purchase and on renewal.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. We collect account and portfolio data to provide and improve our service. This data is encrypted in transit 
            and at rest. We use industry-standard security practices to protect your data and do not sell your personally identifiable information to third parties. 
            For full details on data collection, usage, and your rights, please consult our official{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Legal;
