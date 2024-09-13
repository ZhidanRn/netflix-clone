'use client';

import { Button } from "@/components/ui/button"; // Gunakan komponen Button dari pustaka UI Anda
import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ShareButtonProps {
  title: string;
  text: string;
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const handleShare = async () => {
    
    const fallbackShare = (url: string) => {
        // copy URL to clipboard
        navigator.clipboard.writeText(url).then(
          () => alert('Link copied to clipboard!'),
          (err) => console.error('Failed copy to clipboard:', err)
        );
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
        console.log("Content shared successfully!");
      } catch (error) {
        console.error("Error sharing content: ", error);
      }
    } else {
        fallbackShare(url);
    }


  };

  return (
    <Button onClick={handleShare} variant="outline" size="icon">
      <Share2 className="w-4 h-4" />
    </Button>
  );
}
