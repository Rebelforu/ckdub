export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">Contact Us</h1>
      <div className="bg-surface p-8 rounded-3xl border border-white/5 shadow-xl">
        <p className="text-textMuted mb-8 text-lg">
          Have a question, feedback, or need help? Send us a message and we'll get back to you as soon as possible.
        </p>
        
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">Name</label>
              <input type="text" className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">Email</label>
              <input type="email" className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Subject</label>
            <input type="text" className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all" placeholder="How can we help?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Message</label>
            <textarea className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all h-40 resize-none" placeholder="Your message here..."></textarea>
          </div>
          <button type="button" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-4 rounded-xl transition-opacity shadow-lg shadow-primary/20">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
