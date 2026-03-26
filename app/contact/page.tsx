import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="site-wrapper">
          <div className="page-header">
            <h1>&gt; CONTACT</h1>
          </div>

          <article className="post__content">
            <p>
              Reach me at:{" "}
              <a href="mailto:johannes@example.com">johannes@example.com</a>
            </p>

            <p>
              I&apos;m also available on:
            </p>

            <ul>
              <li><a href="#">GitHub</a> &mdash; code and projects</li>
              <li><a href="#">LinkedIn</a> &mdash; professional context</li>
              <li><a href="#">X / Twitter</a> &mdash; occasional shitposting</li>
            </ul>

            <hr />

            <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)" }}>
              Response time varies. I read everything but can&apos;t always reply.
            </p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
