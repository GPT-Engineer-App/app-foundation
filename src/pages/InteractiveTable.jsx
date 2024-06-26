import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const InteractiveTable = () => {
  return (
    <div className="p-4">
      <Table>
        <TableCaption>Placeholder Data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>john.doe@example.com</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane.smith@example.com</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell>Sam Wilson</TableCell>
            <TableCell>sam.wilson@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default InteractiveTable;