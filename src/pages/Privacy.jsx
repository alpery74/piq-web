const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Last updated: October 13, 2024</p>

      <div className="space-y-8">
        <section className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Introduction</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            PIQ Labs (&ldquo;PIQ,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website, use the PIQ mobile application, or engage with any PIQ services (collectively, the &ldquo;Services&rdquo;).
            We follow a data-minimization approach and only collect the small set of details described in Section 2.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Information We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            We intentionally limit the information we collect to the minimum required to operate PIQ. Unless you voluntarily provide additional context,
            we only collect the following data points:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li><strong>User Identifiers:</strong> Your name, PIQ user ID, and contact email address.</li>
            <li><strong>Contact Number (Optional):</strong> A phone number if you choose to share it for account recovery.</li>
            <li><strong>Failure Diagnostics:</strong> Non-identifying error logs and crash diagnostics.</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            We do <strong>not</strong> collect or store brokerage credentials, trade execution data, or any other personal information beyond what is listed above.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. How We Use Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            We process the limited information we collect for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Verifying your identity and securing your account</li>
            <li>Providing customer support</li>
            <li>Monitoring reliability and improving code quality</li>
            <li>Complying with applicable laws</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            We do <strong>not</strong> sell, rent, or make your personal contact details available to advertisers or other third parties.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Data Security</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We implement technical and organizational safeguards designed to protect your information, including encryption in transit and at rest,
            access controls, monitoring, and regular security reviews. However, no security system is impenetrable, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Your Privacy Rights</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Depending on your jurisdiction, you may have rights to access, correct, delete, export, or object to the processing of your Personal Information.
            To exercise these rights, contact us using the details below.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            If you have any questions about this Privacy Policy or how PIQ handles your information, please contact us at:
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            <strong>Email:</strong> privacy@piqlabs.com<br />
            <strong>Mailing Address:</strong> PIQ Labs, 123 Innovation Way, San Francisco, CA 94105, USA
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
