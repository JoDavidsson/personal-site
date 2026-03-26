import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="site-wrapper">
          <div className="page-header">
            <h1>&gt; ABOUT</h1>
          </div>

          <article className="post__content">
            <p>
              I&apos;m Johannes Davidsson. I spend my days thinking about how
              computers see, how machines move, and how retail adapts to a world
              where the line between physical and digital keeps dissolving.
            </p>

            <p>
              My work sits at the intersection of computer vision, robotics,
              and the evolving landscape of spatial computing. I&apos;ve spent years
              building and studying systems that operate in the real world &mdash;
              from warehouse robots to shelf-scanning cameras &mdash; and I write
              about what I find interesting, confusing, or worth sharing.
            </p>

            <p>
              This site is where I think out loud. The blog covers five main areas:
            </p>

            <ul>
              <li><strong>Retail</strong> &mdash; the changing face of brick-and-mortar, supply chain tech, POS systems, and shopper experience.</li>
              <li><strong>Robotics</strong> &mdash; autonomous systems, manipulation, navigation, and the messy reality of robots outside labs.</li>
              <li><strong>AI</strong> &mdash; machine learning developments, foundation models, and what they mean for physical-world applications.</li>
              <li><strong>Spatial Computing</strong> &mdash; AR/MR/VR, wearable interfaces, and the slow shift toward ambient computation.</li>
              <li><strong>Computer Vision in Retail</strong> &mdash; shelf monitoring, loss prevention, customer analytics, and the cameras watching everything.</li>
            </ul>

            <p>
              The private section of this site is accessible via Google OAuth.
              That&apos;s where I keep work-in-progress thoughts, early drafts,
              and things I&apos;m not ready to publish publicly yet.
            </p>

            <hr />

            <p>
              Find me elsewhere or get in touch via the{" "}
              <a href="/contact">contact page</a>.
            </p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
