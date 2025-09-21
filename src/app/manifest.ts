import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Banko",
    short_name: "Banko",
    description: "Banko",
    start_url: "/",
    display: "standalone",
    theme_color: "#000",
    icons: [
      {
        src: "icon-square.png",
        type: "image/jpg",
        sizes: "any",
      },
    ],
  };
}
