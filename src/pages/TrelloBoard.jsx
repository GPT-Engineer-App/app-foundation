import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTasks, useAddTask, useUpdateTask, useDeleteTask } from "../integrations/supabase/index.js";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const TrelloBoard = () => {
  const { data: tasksData, isLoading, error } = useTasks();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [tasks, setTasks] = useState({ planned: [], doing: [], done: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (tasksData) {
      const planned = tasksData.filter(task => task.status === 'planned');
      const doing = tasksData.filter(task => task.status === 'doing');
      const done = tasksData.filter(task => task.status === 'done');
      setTasks({ planned, doing, done });
    }
  }, [tasksData]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];
    const sourceItems = [...sourceColumn];
    const destItems = [...destColumn];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    });

    // Update task status in Supabase
    await updateTask.mutateAsync({ ...removed, status: destination.droppableId });
  };

  const handleAddTask = async () => {
    const newTask = { content: newTaskContent, status: 'planned', created_at: new Date().toISOString() };
    await addTask.mutateAsync(newTask);
    setNewTaskContent("");
    setIsModalOpen(false);
    toast.success("Task added successfully!");
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask.mutateAsync(taskId);
    toast.success("Task deleted successfully!");
  };

  const handleSaveTask = async () => {
    await updateTask.mutateAsync(selectedTask);
    setIsModalOpen(false);
    toast.success("Task updated successfully!");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tasks</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Board</h1>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Add Task</Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {Object.keys(tasks).map((columnId) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-4 rounded-md"
                >
                  <h2 className="text-xl font-semibold mb-2">{columnId.charAt(0).toUpperCase() + columnId.slice(1)}</h2>
                  {tasks[columnId].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 mb-2 rounded-md shadow-md flex justify-between items-center"
                        >
                          {task.content}
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleEditTask(task)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask ? "Edit Task" : "Add New Task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={selectedTask ? selectedTask.content : newTaskContent}
              onChange={(e) => selectedTask ? setSelectedTask({ ...selectedTask, content: e.target.value }) : setNewTaskContent(e.target.value)}
              placeholder="Task content"
            />
            <Button onClick={selectedTask ? handleSaveTask : handleAddTask}>
              {selectedTask ? "Save Task" : "Add Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrelloBoard;