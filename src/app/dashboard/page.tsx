import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const [{ data: uploads }, { data: scripts }] = await Promise.all([
    supabase.from("uploads").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase
      .from("generated_scripts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/stage1" className="rounded-lg bg-teal-400 px-4 py-2 font-semibold text-slate-950">
          Start new upload
        </Link>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold">Uploads</h2>
        <div className="mt-3 space-y-3">
          {(uploads ?? []).map((upload) => (
            <div key={upload.id} className="rounded border border-slate-800 p-3">
              <p className="font-medium">{upload.file_name}</p>
              <p className="text-sm text-slate-400">Status: {upload.status}</p>
            </div>
          ))}
          {uploads?.length === 0 && <p className="text-sm text-slate-400">No uploads yet.</p>}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold">Generated scripts</h2>
        <div className="mt-3 space-y-3">
          {(scripts ?? []).map((script) => (
            <div key={script.id} className="rounded border border-slate-800 p-3">
              <p className="font-medium">
                {script.language.toUpperCase()} · {script.framework}
              </p>
              <p className="text-sm text-slate-400">Created: {new Date(script.created_at).toLocaleString()}</p>
            </div>
          ))}
          {scripts?.length === 0 && <p className="text-sm text-slate-400">No generated scripts yet.</p>}
        </div>
      </section>
    </main>
  );
}
