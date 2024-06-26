import { useState, useEffect } from "react";
import { useDropzone } from 'react-dropzone';
import { useAnimals, useUpdateAnimal, useDeleteAnimal, useAddAnimal, supabase } from "../integrations/supabase/index.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const IMAGE_URL_PREFIX = "https://gzebeizzqadyipfhvkuo.supabase.co/storage/v1/object/public/";

const InteractiveTable = () => {
  const { data: animals, isLoading, error } = useAnimals();
  const updateAnimal = useUpdateAnimal();
  const deleteAnimal = useDeleteAnimal();
  const addAnimal = useAddAnimal();
  const { session } = useSupabaseAuth();
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [animalList, setAnimalList] = useState([]);

  useEffect(() => {
    if (animals) {
      setAnimalList(animals.sort((a, b) => a.id - b.id));
    }
  }, [animals]);

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

        selectedAnimal.image_url = `${IMAGE_URL_PREFIX}${data.path}`;
        delete selectedAnimal.imageFile; // Ensure imageFile is not saved in the database
      }

      await updateAnimal.mutateAsync(selectedAnimal);
      setIsEditing(false);
      toast.success("Animal updated successfully!");
    } catch (error) {
      console.log("Error during save:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const createdAnimal = { name: selectedAnimal.name, species: selectedAnimal.species, image_url: "", created_at: new Date().toISOString() };
      await addAnimal.mutateAsync(createdAnimal);

      // Fetch the newly created animal from the database
      const { data: fetchedAnimal, error: fetchError } = await supabase
        .from('animals')
        .select('*')
        .eq('name', selectedAnimal.name)
        .eq('species', selectedAnimal.species)
        .single();

      if (fetchError || !fetchedAnimal) {
        console.log("Error fetching created animal:", fetchError);
        toast.error("Failed to fetch created animal");
        return;
      }

      if (selectedAnimal.imageFile) {
        const { data: imageData, error: imageError } = await supabase.storage
          .from('animals')
          .upload(`${session.user.id}/${fetchedAnimal.id}/${selectedAnimal.imageFile.name}`, selectedAnimal.imageFile);

        if (imageError || !imageData) {
          console.log("Image upload error:", imageError);
          toast.error("Failed to upload image");
        } else {
          await updateAnimal.mutateAsync({ ...fetchedAnimal, image_url: `${IMAGE_URL_PREFIX}${imageData.path}` });
        }
      }

      setSelectedAnimal(null);
      setIsCreating(false);
      toast.success("Animal created successfully!");
    } catch (error) {
      console.log("Error during creation:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const onDrop = (acceptedFiles) => {
    setSelectedAnimal({ ...selectedAnimal, imageFile: acceptedFiles[0] });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(animalList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setAnimalList(items);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="p-4">
      <Button onClick={() => setIsCreating(true)} className="mb-4">Create Animal</Button>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="animals">
          {(provided) => (
            <Table {...provided.droppableProps} ref={provided.innerRef}>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Species</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animalList.map((animal, index) => (
                  <Draggable key={animal.id} draggableId={animal.id.toString()} index={index}>
                    {(provided) => (
                      <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TableCell>{animal.id}</TableCell>
                        <TableCell>
                          {animal.image_url ? (
                            <img src={`${IMAGE_URL_PREFIX}${animal.image_url}`} alt={animal.name} className="h-12 w-12 object-cover" />
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>

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
              {selectedAnimal.image_url && (
                <div className="flex justify-center">
                  <img src={`${IMAGE_URL_PREFIX}${selectedAnimal.image_url}`} alt={selectedAnimal.name} className="h-24 w-24 object-cover" />
                </div>
              )}
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

      {isCreating && (
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Animal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="name">Name</label>
                <Input
                  id="name"
                  value={selectedAnimal?.name || ""}
                  onChange={(e) => setSelectedAnimal({ ...selectedAnimal, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="species">Species</label>
                <Input
                  id="species"
                  value={selectedAnimal?.species || ""}
                  onChange={(e) => setSelectedAnimal({ ...selectedAnimal, species: e.target.value })}
                />
              </div>
              <div {...getRootProps()} className="border-dashed border-2 p-4">
                <input {...getInputProps()} />
                {selectedAnimal?.imageFile ? (
                  <p>{selectedAnimal.imageFile.name}</p>
                ) : (
                  <p>Drag 'n' drop an image here, or click to select one</p>
                )}
              </div>
              <Button onClick={handleCreate}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InteractiveTable;