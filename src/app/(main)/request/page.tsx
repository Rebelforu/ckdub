import RequestForm from "@/components/RequestForm";

export const revalidate = 3600;

export default async function RequestDrama() {

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl pt-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Request a Drama</h1>
        <p className="text-textMuted">Can't find what you're looking for? Submit a request and we'll try our best to add it!</p>
      </div>

      <div className="max-w-lg mx-auto">
        <RequestForm />
      </div>
    </div>
  );
}
