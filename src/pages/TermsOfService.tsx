
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <h1 className="text-3xl font-bold text-white mb-6">
              Terms of <span className="text-steel">Service</span>
            </h1>
            
            <div className="bg-dark-200 rounded-lg border border-gray-800 p-6 md:p-8">
              <ScrollArea className="h-[60vh]">
                <div className="pr-4">
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
                    <p className="text-gray-400 mb-4">
                      These Terms of Service ("Terms") govern your use of the Siddi Vinayaka Steel website and services. 
                      By accessing our website or using our services, you agree to these Terms.
                    </p>
                    <p className="text-gray-400 mb-4">
                      Please read these Terms carefully before using our services. If you do not agree to these Terms, 
                      you may not use our website or services.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">2. Services</h2>
                    <p className="text-gray-400 mb-4">
                      Siddi Vinayaka Steel provides steel and glass fitting solutions for residential and commercial spaces. 
                      Our services include custom fabrication, installation, maintenance, and repair of steel structures 
                      and glass fittings.
                    </p>
                    <p className="text-gray-400 mb-4">
                      The specific services we provide will be agreed upon in a separate contract or work order.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">3. Pricing and Payment</h2>
                    <p className="text-gray-400 mb-4">
                      Prices for our services are provided upon request and will be specified in a quote or contract.
                      Payment terms will be outlined in your contract or invoice.
                    </p>
                    <p className="text-gray-400 mb-4">
                      Unless otherwise stated, all prices are in Indian Rupees (INR) and exclude any applicable taxes.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">4. Warranties and Guarantees</h2>
                    <p className="text-gray-400 mb-4">
                      Siddi Vinayaka Steel warrants that all services will be performed with professional care and skill.
                      All materials used will be of the quality specified in your contract or quote.
                    </p>
                    <p className="text-gray-400 mb-4">
                      Specific warranty periods for different products and services will be provided at the time of purchase.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
                    <p className="text-gray-400 mb-4">
                      To the extent permitted by law, Siddi Vinayaka Steel's liability for any claim relating to our services 
                      or these Terms is limited to the amount paid for the relevant services.
                    </p>
                    <p className="text-gray-400 mb-4">
                      We will not be liable for any indirect, incidental, special, or consequential damages.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">6. Changes to Terms</h2>
                    <p className="text-gray-400 mb-4">
                      We may modify these Terms at any time. We will post the revised Terms on our website with an updated 
                      effective date. Your continued use of our services after any changes indicates your acceptance of the new Terms.
                    </p>
                  </section>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">7. Contact Us</h2>
                    <p className="text-gray-400 mb-4">
                      If you have any questions about these Terms, please contact us at:
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
