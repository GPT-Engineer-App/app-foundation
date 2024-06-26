import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Index() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>This is a GPT Engineer Demo app</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You will be able to play around with different demo apps.</p>
          <Button variant="outline" className="mt-4">Get Started</Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default Index;