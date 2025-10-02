
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <h1 className="text-3xl font-bold text-white mb-6">
              Privacy <span className="text-steel">Policy</span>
            </h1>
            
            <div className="bg-dark-200 rounded-lg border border-gray-800 p-6 md:p-8">
              <ScrollArea className="h-[60vh]">
                <div className="pr-4">
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
                    <p className="text-gray-400 mb-4">
                      This Privacy Policy explains how Ganesh Steel collects, uses, and protects your personal information 
                      when you use our website and services.
                    </p>
                    <p className="text-gray-400 mb-4">
                      We respect your privacy and are committed to protecting your personal data. 
                      Please read this policy carefully to understand our practices regarding your personal data.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
                    <p className="text-gray-400 mb-4">
                      We may collect the following information:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mb-4 space-y-2">
                      <li>Your name, contact information, and address</li>
                      <li>Details of products or services you're interested in</li>
                      <li>Information required to provide you with an estimate or quote</li>
                      <li>Information about your visit to our website through cookies and analytics tools</li>
                    </ul>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                    <p className="text-gray-400 mb-4">
                      We use your information for the following purposes:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mb-4 space-y-2">
                      <li>To provide and improve our services</li>
                      <li>To respond to your inquiries and provide customer support</li>
                      <li>To process payments and maintain business records</li>
                      <li>To send you important updates about our services</li>
                      <li>To notify you about changes to our terms or privacy policy</li>
                      <li>To send marketing communications (if you have opted in)</li>
                    </ul>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">4. How We Protect Your Information</h2>
                    <p className="text-gray-400 mb-4">
                      We implement appropriate security measures to protect your personal information from unauthorized access, 
                      alteration, disclosure, or destruction.
                    </p>
                    <p className="text-gray-400 mb-4">
                      Your personal information is kept confidential and is only accessible to authorized personnel who need it 
                      to perform their duties.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">5. Your Privacy Rights</h2>
                    <p className="text-gray-400 mb-4">
                      You have the right to:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mb-4 space-y-2">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate personal data</li>
                      <li>Request deletion of your personal data</li>
                      <li>Object to processing of your personal data</li>
                      <li>Request restriction of processing your personal data</li>
                      <li>Request transfer of your personal data</li>
                    </ul>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">6. Contact Us</h2>
                    <p className="text-gray-400 mb-4">
                      If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <p className="text-gray-400 mb-4">
                      Email: omprkashbishnoi2000@gmail.com<br />
                      Phone: +91 9326698359<br />
                      Phone: +91 8080482079<br />
                      Address: Chengicherla X Road, Peerzadiguda, Hyderabad
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
