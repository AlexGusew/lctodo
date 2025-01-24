import { Button } from "@/components/ui/button";

export const Footer = () => (
  <footer className="px-8 sm:px-20">
    <div className="max-w-2xl mx-auto">
      <Button variant="link" className="opacity-60 hover:opacity-100 text-xs">
        <a
          href="https://github.com/AlexGusew/lctodo"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Github
        </a>
      </Button>
      <Button variant="link" className="opacity-60 hover:opacity-100 text-xs">
        <a
          href="https://github.com/AlexGusew/lctodo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Roadmap
        </a>
      </Button>
    </div>
  </footer>
);
