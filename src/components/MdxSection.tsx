import { MDXRemote } from "next-mdx-remote/rsc";
import { promises as fs } from "fs";
import path from "path";

interface MdxSectionProps {
  id: string;
  filename: string;
  className?: string;
}

const components = {
  h1: (props: any) => <h2 className="text-3xl font-bold tracking-tight mb-6" {...props} />,
  h2: (props: any) => <h3 className="text-2xl font-semibold tracking-tight mt-8 mb-4" {...props} />,
  p: (props: any) => <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground" {...props} />,
  ul: (props: any) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
  li: (props: any) => <li className="text-muted-foreground" {...props} />,
  strong: (props: any) => <strong className="font-semibold text-foreground" {...props} />,
};

export default async function MdxSection({ id, filename, className = "" }: MdxSectionProps) {
  const filePath = path.join(process.cwd(), "src/content", filename);
  const fileContent = await fs.readFile(filePath, "utf8");

  return (
    <section id={id} className={`container mx-auto px-4 py-16 md:py-24 ${className}`}>
      <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
        <MDXRemote source={fileContent} components={components} />
      </div>
    </section>
  );
}
