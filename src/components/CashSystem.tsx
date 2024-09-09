import { createResource, type JSX } from "solid-js";

interface CashData {
  money: number;
}

const fetcher = async () => {
  const res = await fetch("/api/fetch-cash");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Error fetching cash data');
  }

  return data;
};

export function CashSystem() {
  const [data, { refetch }] = createResource(fetcher);

  const onUpdateCashHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const amount = formData.get("amount")?.toString();

    if (!amount) return;

    await fetch("/api/fetch-cash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: parseFloat(amount) }),
    });

    refetch(); // Ensure data is refetched after submission
    formElement.reset();
  };

  return (
    <div class="max-w-3xl w-full">
      <form
        onsubmit={onUpdateCashHandler}
        class="block border bg-blue-100 border-blue-300 rounded-md p-6 dark:bg-blue-950 dark:border-blue-800"
      >
        <div>
          <label class="block mb-1 font-medium dark:text-zinc-300 text-zinc-900 text-sm" for="amount">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            required
            name="amount"
            class="w-full block rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
          />
        </div>
        <button
          class="w-full dark:bg-zinc-100 bg-zinc-900 border-zinc-900 py-1.5 border dark:border-zinc-100 rounded-md mt-4 dark:text-zinc-900 text-zinc-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
        >
          Update Cash
        </button>
      </form>
      <section class="mt-6">
        <h2 class="text-xl font-bold">Cash Details</h2>
        <p>Amount: ${data()?.money ?? 'Loading...'}</p>
      </section>
    </div>
  );
}
