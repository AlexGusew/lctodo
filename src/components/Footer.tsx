import { ModeToggle } from "@/components/ModeToggle";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";

export const Footer = () => (
  <ResponsiveLayout>
    <footer className="px-8 py-1 my-2 max-sm:p-4 flex gap-x-8 flex-wrap justify-center">
      <ModeToggle />
      {[
        ["alexcoders.com", "https://alexcoders.com"],
        ["View on Github", "https://github.com/AlexGusew/lctodo"],
        ["Backlog", "https://github.com/users/AlexGusew/projects/2"],
        [
          "Report bug / Request feature",
          "https://github.com/AlexGusew/lctodo/issues/new?template=feature_request.md",
        ],
      ].map(([label, href]) => (
        <Button
          key={label + href}
          variant="link"
          className="opacity-60 hover:opacity-100 text-xs px-0"
        >
          <a href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        </Button>
      ))}
    </footer>
  </ResponsiveLayout>
);
