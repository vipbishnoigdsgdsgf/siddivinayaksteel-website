import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  User,
  Globe,
} from "lucide-react";

export default function AboutDeveloper() {
  return (
    <div className="min-h-screen bg-dark-100 text-white">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            {/* Profile Image */}
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-steel shadow-xl">
              <img
                alt="Vip Bishnoi"
                className="w-full h-full object-cover"
                src="/lovable-uploads/4f1272b1-4905-4b0f-952e-9122790f0363.jpg"
              />
            </div>

            {/* Bio Section */}
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold mb-4 text-steel">
                Vip Bishnoi
              </h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-steel/10 text-steel rounded-full text-sm">
                  Web Developer
                </span>
                <span className="px-3 py-1 bg-steel/10 text-steel rounded-full text-sm">
                  UI/UX Designer
                </span>
                <span className="px-3 py-1 bg-steel/10 text-steel rounded-full text-sm">
                  Project Manager
                </span>
              </div>

              <p className="text-gray-400 mb-4 leading-relaxed">
                I am <strong>Vip Bishnoi</strong>, a passionate and detail-oriented full-stack developer with a focus on clean code, seamless user experience, and cutting-edge web technologies. With a strong foundation in both frontend and backend development, I transform complex problems into elegant solutions.
              </p>

              <p className="text-gray-400 mb-8">
                This page is my personal portfolio — a space where creativity meets technical excellence. The UI/UX here is crafted with intent, ensuring a visually appealing and intuitive experience.
              </p>

              {/* Contact Icons Section */}
              <div className="flex flex-wrap gap-4 mb-8">
                <a
                  href="https://github.com/VIPHACKE"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Button
                    variant="outline"
                    className="border-steel text-steel hover:bg-steel/10 flex items-center gap-2 rounded-full"
                  >
                    <Github size={18} /> GitHub
                  </Button>
                </a>
                <a
                  href="https://linkedin.com/in/vikas-thed4x-4aa223312"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Button
                    variant="outline"
                    className="border-steel text-steel hover:bg-steel/10 flex items-center gap-2 rounded-full"
                  >
                    <Linkedin size={18} /> LinkedIn
                  </Button>
                </a>
                <a
                  href="https://twitter.com/VIP__BISHNOI"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Button
                    variant="outline"
                    className="border-steel text-steel hover:bg-steel/10 flex items-center gap-2 rounded-full"
                  >
                    <Twitter size={18} /> Twitter
                  </Button>
                </a>
                <a href="mailto:vipbishnoi47@gmail.com" aria-label="Email">
                  <Button
                    variant="outline"
                    className="border-steel text-steel hover:bg-steel/10 flex items-center gap-2 rounded-full"
                  >
                    <Mail size={18} /> Email
                  </Button>
                </a>
              </div>

              {/* Redesigned Contact Info Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Phone size={18} />,
                    label: "MOBAIL NUMBER",
                    href: "tel:+916378941259",
                    aria: "Phone number",
                  },
                  {
                    icon: <Mail size={18} />,
                    label: "GMAIL",
                    href: "mailto:vipbishnoi47@gmail.com",
                    aria: "Email address",
                  },
                  {
                    icon: <User size={18} />,
                    label: "TELEGRAM",
                    href: "https://t.me/thed4x",
                    aria: "Telegram profile",
                  },
                  {
                    icon: <User size={18} />,
                    label: "DISCORD",
                    href: "https://discord.com/users/vipbishnoi.29",
                    aria: "Discord profile",
                  },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.aria}
                  >
                    <Button
                      variant="outline"
                      className="border-steel text-steel hover:bg-steel/10 flex items-center gap-2 rounded-full w-full justify-start"
                    >
                      {item.icon} {item.label}
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-steel pl-4">
              Key Skills
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Web Development",
                  desc: "Expertise in HTML, CSS, JavaScript, and React to create interactive web applications.",
                },
                {
                  title: "UI/UX Design",
                  desc: "Designing user-friendly interfaces with a focus on accessibility and modern design trends.",
                },
                {
                  title: "Backend Development",
                  desc: "Developing scalable APIs and server-side logic using Node.js and Express.",
                },
                {
                  title: "Project Management",
                  desc: "Managing development workflows using Agile methodologies and team collaboration.",
                },
                {
                  title: "Cybersecurity",
                  desc: "Strong understanding of digital security principles, network defense, and penetration testing.",
                },
                {
                  title: "Ethical Hacking",
                  desc: "Skilled in vulnerability analysis, system exploitation, and ethical penetration techniques.",
                },
                {
                  title: "Discord Bot Development",
                  desc: "Creating custom bots to automate server tasks, manage users, and enhance interactivity.",
                },
                {
                  title: "App Development",
                  desc: "Building modern mobile and desktop applications using frameworks like React Native and Electron.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-dark-200 p-6 rounded-lg border border-gray-800 hover:border-steel transition-all shadow-sm hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <p className="text-gray-400">
              Interested in building something great together?
            </p>
            <a href="https://twitter.com/VIP__BISHNOI">
              <Button className="mt-4 bg-dark-300 hover:bg-dark-400 text-white">
                Contact Me
              </Button>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
