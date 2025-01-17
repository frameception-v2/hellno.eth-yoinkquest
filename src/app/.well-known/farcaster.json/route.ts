import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOiA4ODcyNDYsICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9",
      payload: "eyJkb21haW4iOiAiaGVsbG5vZXRoLXlvaW5rcXVlc3QudmVyY2VsLmFwcCJ9",
      signature: "MHg2ODY5MTJkZmNiY2UxOGRjNmIxZmIwMzlmYjMzMGVkMmI5YWJjYTViYTRmNzU3ODNlOWNjYzM2NjBkYTU0MDU3NWEyYzQ5OTI1MWJiMzIzODIzMGVlODgzMzVlZThkNThlZTlkN2Q0MzkyNTc0YWE0ZjA5ZmY5ZWM4YmE4ODNhMTFi"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
