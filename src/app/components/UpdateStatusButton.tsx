import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ParamsData {
  name: string;
}

export interface StatusButtonParams {
  data: ParamsData;
}

export function UpdateStatusButton(params: StatusButtonParams) {
  const [status, setStatus] = useState<"shortlisted" | "rejected" | null>(null);
  const handleShortlist = () => {
    setStatus("shortlisted");
  };

  const handleReject = () => {
    setStatus("rejected");
  };

  return (
    <>
      {status === null ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Update Status</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] text-center">
            <DialogHeader>
              <DialogTitle>Update Application Status</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-left">
              <p className="text-lg font-medium">
                Candidate: {params.data.name}
              </p>
            </div>
            <DialogFooter className="flex justify-start gap-4">
              <Button
                type="button"
                className="px-6 bg-green-600 text-white w-40 h-12"
                onClick={handleShortlist}
              >
                Shortlist
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="px-6 bg-red-600 text-white w-40 h-12"
                onClick={handleReject}
              >
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <p
          className={`text-sm font-small text-center p-0 w-20 absolute top-3 rounded-xl ${
            status === "rejected"
              ? "bg-red-500 text-white"
              : status === "shortlisted"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {status}
        </p>
      )}
    </>
  );
}
