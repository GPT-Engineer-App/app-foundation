import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Index() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Bare-Bones Web Application</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a minimal web application with a simple structure that you can modify and build upon.</p>
          <Button variant="outline" className="mt-4">Get Started</Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default Index;