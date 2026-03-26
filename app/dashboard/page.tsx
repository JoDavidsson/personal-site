import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <>
      <SiteHeader />
      <main>
        <div className="site-wrapper">
          <div className="dashboard">
            <div className="dashboard__header">
              <div>
                <p className="dashboard__welcome">Authenticated</p>
                <h1 className="dashboard__title">
                  {session.user?.name ?? "Member"}
                </h1>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--fg-muted)",
                    marginTop: "0.25rem",
                  }}
                >
                  {session.user?.email}
                </p>
              </div>

              <SignOutButton />
            </div>

            <pre
              style={{
                fontSize: "0.7rem",
                color: "var(--fg-muted)",
                border: "1px solid var(--border)",
                padding: "1rem",
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: "var(--accent)" }}>&gt; </span>
              SYSTEM STATUS: MEMBERS_ONLY_SECTION_ACTIVE
              {"\n"}
              <span style={{ color: "var(--accent)" }}>&gt; </span>
              ACCESS LEVEL: AUTHORIZED
              {"\n"}
              <span style={{ color: "var(--accent)" }}>&gt; </span>
              CONTENT: EARLY_DRAFTS | WORK_IN_PROGRESS
              {"\n"}
              <span style={{ color: "var(--accent)" }}>&gt; </span>
              THIS AREA IS UNDER CONSTRUCTION.
            </pre>

            <div
              style={{
                border: "1px solid var(--border)",
                padding: "1.5rem",
                fontSize: "0.85rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--fg-muted)",
                  marginBottom: "1rem",
                }}
              >
                // PRIVATE_POSTS
              </p>
              <p style={{ color: "var(--fg-muted)", fontStyle: "italic" }}>
                This section is under construction. Posts, collections, and
                early drafts will appear here once the content pipeline is
                ready.
              </p>
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "0.8rem",
                  color: "var(--fg-muted)",
                }}
              >
                In the meantime, head back to the{" "}
                <Link href="/blog" style={{ color: "var(--accent)" }}>
                  public blog
                </Link>{" "}
                for published posts.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
