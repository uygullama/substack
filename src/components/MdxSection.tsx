import { promises as fs } from "node:fs";
import path from "node:path";
import { MDXRemote } from "next-mdx-remote/rsc";
import type React from "react";

interface MdxSectionProps {
  id: string;
  filename: string;
  className?: string;
}

const components = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h2 className="text-3xl font-bold tracking-tight mb-6" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h3
      className="text-2xl font-semibold tracking-tight mt-8 mb-4"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p
      className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="text-muted-foreground" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
};

export default async function MdxSection({
  id,
  filename,
  className = "",
}: MdxSectionProps) {
  const filePath = path.join(process.cwd(), "src/content", filename);
  const fileContent = await fs.readFile(filePath, "utf8");

  return (
    <section
      id={id}
      className={`container mx-auto px-4 py-16 md:py-24 ${className}`}
    >
      <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
        <MDXRemote source={fileContent} components={components} />
      </div>
    </section>
  );
}
