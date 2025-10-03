import { redirect } from "next/navigation";
import { generateUUID } from "@/lib/utils";
import { auth } from "../(auth)/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest?redirectUrl=" + encodeURIComponent("/"));
  }

  const id = generateUUID();

  // Redirect to the specific chat URL
  redirect(`/chat/${id}`);
}
