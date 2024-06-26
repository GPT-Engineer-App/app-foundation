import { useState } from "react";
import { useAnimals, useUpdateAnimal, useDeleteAnimal } from "../integrations/supabase/index.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

const InteractiveTable = () => {
  const { data: animals, isLoading, error } = useAnimals();
  const updateAnimal = useUpdateAnimal();
  const deleteAnimal = useDeleteAnimal();
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (animal) => {
    setSelectedAnimal(animal);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await deleteAnimal.mutateAsync(id);
    toast.success("Animal deleted successfully!");
  };

  const handleSave = async () => {
    await updateAnimal.mutateAsync(selectedAnimal);
    setIsEditing(false);
    toast.success("Animal updated successfully!");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Species</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {animals.map((animal) => (
            <TableRow key={animal.id}>
              <TableCell>{animal.id}</TableCell>
              <TableCell>{animal.name}</TableCell>
              <TableCell>{animal.species}</TableCell>
              <TableCell>{new Date(animal.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEdit(animal)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(animal.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Animal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="name">Name</label>
                <Input
                  id="name"
                  value={selectedAnimal.name}
                  onChange={(e) => setSelectedAnimal({ ...selectedAnimal, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="species">Species</label>
                <Input
                  id="species"
                  value={selectedAnimal.species}
                  onChange={(e) => setSelectedAnimal({ ...selectedAnimal, species: e.target.value })}
                />
              </div>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InteractiveTable;