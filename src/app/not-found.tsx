import { Container, Button, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <Eyebrow className="mb-3">404</Eyebrow>
      <h1 className="text-h1">This page doesn't exist</h1>
      <p className="mx-auto mt-4 max-w-md text-body-lg text-secondary">
        The page you're looking for may have moved. Try the homepage or search for what you need.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/tools/" variant="secondary">Browse free tools</Button>
      </div>
    </Container>
  );
}
