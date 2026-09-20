import { submitRequest } from "@/app/actions";

export const revalidate = 3600;

export default async function RequestDrama() {

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl pt-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Request a Drama</h1>
        <p className="text-textMuted">Can't find what you're looking for? Submit a request and we'll try our best to add it!</p>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Request Form */}
        <div className="bg-surface p-8 rounded-xl border border-surface/50 shadow-xl">
          <form action={submitRequest} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2" htmlFor="drama_name">Drama Name *</label>
              <input 
                id="drama_name"
                name="drama_name"
                type="text" 
                className="w-full bg-background border border-surface rounded-lg px-4 py-3 text-textMain focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. Goblin, Hidden Love"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2" htmlFor="language">Original Language</label>
              <select 
                id="language"
                name="language"
                className="w-full bg-background border border-surface rounded-lg px-4 py-3 text-textMain focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Korean">Korean (K-Drama)</option>
                <option value="Chinese">Chinese (C-Drama)</option>
                <option value="Japanese">Japanese (J-Drama)</option>
                <option value="Thai">Thai (Thai-Drama)</option>
                <option value="Other">Other / Don't Know</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2" htmlFor="dub_requested">Dub Requested *</label>
              <select 
                id="dub_requested"
                name="dub_requested"
                className="w-full bg-background border border-surface rounded-lg px-4 py-3 text-textMain focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Hindi Dub">Hindi Dub</option>
                <option value="English Dub">English Dub</option>
                <option value="Subtitles Only">Subtitles Only</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-lg transition-colors mt-6 text-lg"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
