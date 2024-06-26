import { useState } from "react";
import { useDropzone } from 'react-dropzone';
import { useAnimals, useUpdateAnimal, useDeleteAnimal, supabase } from "../integrations/supabase/index.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";

const InteractiveTable = () => {
  const { data: animals, isLoading, error } = useAnimals();
  const updateAnimal = useUpdateAnimal();
  const deleteAnimal = useDeleteAnimal();
  const { session } = useSupabaseAuth();
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
    try {
      if (selectedAnimal.imageFile) {
        const { data, error } = await supabase.storage
          .from('animals')
          .upload(`${session.user.id}/${selectedAnimal.id}/${selectedAnimal.imageFile.name}`, selectedAnimal.imageFile);

        if (error) {
          console.log("Image upload error:", error);
          toast.error("Failed to upload image");
          return;
        }

        selectedAnimal.image_url = `https://gzebeizzqadyipfhvkuo.supabase.co/storage/v1/object/public/animals/${data.path}`;
        delete selectedAnimal.imageFile; // Ensure imageFile is not saved in the database
      }

      await updateAnimal.mutateAsync(selectedAnimal);
      setIsEditing(false);
      toast.success("Animal updated successfully!");
    } catch (error) {
      console.log("Error during save:", error);
    }
  };

  const onDrop = (acceptedFiles) => {
    setSelectedAnimal({ ...selectedAnimal, imageFile: acceptedFiles[0] });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
            <TableHead>Image</TableHead> {/* New Image Column */}
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
              <TableCell>
                {animal.image_url ? (
                  <img src={`${supabase.storage.from('animals').getPublicUrl(animal.image_url).publicURL}`} alt={animal.name} className="h-12 w-12 object-cover" />
                ) : (
                  "No Image"
                )}
              </TableCell>
              <TableCell>{animal.name}</TableCell>
              <TableCell>{animal.species}</TableCell>
              <TableCell>{new Date(animal.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <MoreHorizontal className="h-4 w-4 cursor-pointer" />
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
              <div {...getRootProps()} className="border-dashed border-2 p-4">
                <input {...getInputProps()} />
                {selectedAnimal.imageFile ? (
                  <p>{selectedAnimal.imageFile.name}</p>
                ) : (
                  <p>Drag 'n' drop an image here, or click to select one</p>
                )}
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