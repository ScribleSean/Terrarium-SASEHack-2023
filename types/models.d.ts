interface Opportunity {
  id: string;
  name: string;
  imageUrl: string;
  date: string;
  description: string;
  location: string;
  organizationId: string;
  organizationName: string;
}

interface User {
  name: string;
  email: string;
  imageUrl: string;
  role: "user" | "org" | "admin";
}
