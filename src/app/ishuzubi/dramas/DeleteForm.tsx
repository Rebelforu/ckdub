"use client";

import { useTransition } from "react";

export default function DeleteForm({ action, idName, idValue, confirmMessage, buttonText, buttonClass }: { action: (formData: FormData) => Promise<void>, idName: string, idValue: string, confirmMessage: string, buttonText: string, buttonClass: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form action={(formData) => {
      if (confirm(confirmMessage)) {
        startTransition(async () => {
          await action(formData);
        });
      }
    }}>
      <input type="hidden" name={idName} value={idValue} />
      <button type="submit" disabled={isPending} className={buttonClass}>
        {isPending ? "Deleting..." : buttonText}
      </button>
    </form>
  );
}
