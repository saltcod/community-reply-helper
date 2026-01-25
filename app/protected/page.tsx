import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div>
        <h2 className="font-bold text-2xl mb-4">Getting Started</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
