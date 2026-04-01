import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle, Send, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_p7f42q9';
const EMAILJS_TEMPLATE_ID = 'template_guz7i41';
const EMAILJS_PUBLIC_KEY = 'TOMlDE-2YNLLe-XzR';

const CONTACT_EMAIL = "connect@janjustice.com";
const CONTACT_PHONE = "+917023076680";
const WHATSAPP_NUMBER = "917023076680";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch {
      setError("Failed to send message. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Hi, I have a query regarding Jan Justice services.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Jan Justice - Get in Touch</title>
        <meta name="description" content="Have a question or need help? Contact Jan Justice via email or WhatsApp. We're here to assist you with legal jobs, courses, and career guidance." />
      </Helmet>

      <div className="bg-background min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero */}
          <div className="relative overflow-hidden border-b border-border/50">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="container py-12 md:py-16 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-5">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Get in Touch</h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                Have a question about legal jobs, law courses, or career guidance? Reach out to us — we're happy to help.
              </p>
            </div>
          </div>

          <div className="container py-10 md:py-14">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
              {/* Email Card */}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group rounded-2xl border border-border/60 bg-card p-6 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-blue-500/10 mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-3">We'll respond within 24 hours</p>
                <span className="text-sm font-medium text-primary">{CONTACT_EMAIL}</span>
              </a>

              {/* WhatsApp Card */}
              <button
                onClick={openWhatsApp}
                className="group rounded-2xl border border-border/60 bg-card p-6 text-center transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5"
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-green-500/10 mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1">WhatsApp</h3>
                <p className="text-sm text-muted-foreground mb-3">Chat with us instantly</p>
                <span className="text-sm font-medium text-green-600">Open WhatsApp</span>
              </button>

              {/* Phone Card */}
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="group rounded-2xl border border-border/60 bg-card p-6 text-center transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-amber-500/10 mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="h-7 w-7 text-amber-500" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-3">Mon-Sat, 10AM - 6PM IST</p>
                <span className="text-sm font-medium text-amber-600">+91 98765 43210</span>
              </a>
            </div>

            {/* Contact Form + Info */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
              {/* Form */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8 shadow-soft">
                  <h2 className="text-xl font-display font-bold mb-1">Send us a Message</h2>
                  <p className="text-sm text-muted-foreground mb-6">Fill out the form and we'll get back to you soon.</p>

                  {submitted ? (
                    <div className="text-center py-10">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 mb-4">
                        <Send className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-lg font-display font-bold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Thank you! We've received your message and will get back to you within 24 hours.
                      </p>
                      <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Your Name</label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Rahul Sharma"
                            className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Your Email</label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="rahul@example.com"
                            className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Subject</label>
                        <select
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        >
                          <option value="">Select a topic</option>
                          <option value="Job Inquiry">Job Inquiry</option>
                          <option value="Course Help">Course Help</option>
                          <option value="Appointment Issue">Appointment Issue</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Message</label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="Describe your query or issue..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                        />
                      </div>
                      <Button type="submit" disabled={sending} className="w-full h-12 gradient-primary border-0 shadow-glow hover:shadow-glow-lg transition-all gap-2">
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {sending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </div>
              </div>

              {/* Info Sidebar */}
              <div className="lg:col-span-2 space-y-5">
                {/* Quick WhatsApp */}
                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold">Prefer WhatsApp?</h3>
                      <p className="text-xs text-muted-foreground">Get instant replies</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    For quick queries, chat with us directly on WhatsApp. We usually respond within minutes.
                  </p>
                  <Button
                    onClick={openWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white border-0 gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </div>

                {/* Office Info */}
                <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
                  <h3 className="font-display font-bold mb-4">Office Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium mb-0.5">Address</p>
                        <p className="text-sm font-medium">Jaipur, Rajasthan, India</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium mb-0.5">Working Hours</p>
                        <p className="text-sm font-medium">Mon - Sat, 10:00 AM - 6:00 PM IST</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium mb-0.5">Email</p>
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-medium text-primary hover:underline">
                          {CONTACT_EMAIL}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium mb-0.5">Phone</p>
                        <a href={`tel:${CONTACT_PHONE}`} className="text-sm font-medium text-primary hover:underline">
                          +91 98765 43210
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
