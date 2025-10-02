
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <h1 className="text-3xl font-bold text-white mb-6">
              Cookie <span className="text-steel">Policy</span>
            </h1>
            
            <div className="bg-dark-200 rounded-lg border border-gray-800 p-6 md:p-8">
              <ScrollArea className="h-[60vh]">
                <div className="pr-4">
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">1. What Are Cookies?</h2>
                    <p className="text-gray-400 mb-4">
                      Cookies are small text files that are placed on your device when you visit our website. 
                      They help our website remember information about your visit, like your preferred language and other settings.
                    </p>
                    <p className="text-gray-400 mb-4">
                      Cookies are widely used to make websites work more efficiently and to provide information to the website owners.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">2. Types of Cookies We Use</h2>
                    <p className="text-gray-400 mb-4">
                      Our website uses the following types of cookies:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mb-4 space-y-2">
                      <li><span className="text-white">Essential Cookies:</span> These are necessary for the website to function properly.</li>
                      <li><span className="text-white">Preference Cookies:</span> These remember your preferences and settings.</li>
                      <li><span className="text-white">Analytics Cookies:</span> These help us understand how visitors interact with our website.</li>
                      <li><span className="text-white">Marketing Cookies:</span> These are used to track visitors across websites.</li>
                    </ul>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">3. How to Manage Cookies</h2>
                    <p className="text-gray-400 mb-4">
                      Most web browsers allow you to control cookies through their settings. You can:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mb-4 space-y-2">
                      <li>View cookies stored on your computer</li>
                      <li>Allow, block, or delete cookies</li>
                      <li>Set preferences for certain websites</li>
                    </ul>
                    <p className="text-gray-400 mb-4">
                      Please note that if you choose to block certain cookies, some features of our website may not function properly.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">4. Changes to Our Cookie Policy</h2>
                    <p className="text-gray-400 mb-4">
                      We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">5. Contact Us</h2>
                    <p className="text-gray-400 mb-4">
                      If you have any questions about our Cookie Policy, please contact us at:
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
