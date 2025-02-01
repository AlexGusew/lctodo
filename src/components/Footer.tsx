import { Button } from "@/components/ui/button";

export const Footer = () => (
  <footer className="px-8 sm:px-20 my-2">
    <div className="max-w-2xl mx-auto">
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
          className="opacity-60 hover:opacity-100 text-xs"
        >
          <a href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        </Button>
      ))}
    </div>
  </footer>
);
