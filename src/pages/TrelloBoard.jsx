import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTasks, useAddTask, useUpdateTask, useDeleteTask, useUsers } from "../integrations/supabase/index.js";
import { toast } from "sonner";
import Select from 'react-select';

const TrelloBoard = () => {
  const { data: tasksData, isLoading: isLoadingTasks, error: errorTasks } = useTasks();
  const { data: usersData, isLoading: isLoadingUsers, error: errorUsers } = useUsers(); // Fetch users
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [tasks, setTasks] = useState({ planned: [], doing: [], done: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Add state for selected user

  useEffect(() => {
    if (tasksData) {
      const planned = tasksData.filter(task => task.status === 'planned');
      const doing = tasksData.filter(task => task.status === 'doing');
      const done = tasksData.filter(task => task.status === 'done');
      setTasks({ planned, doing, done });
    }
  }, [tasksData]);

  useEffect(() => {
    if (selectedTask && usersData) {
      const assignedUser = usersData.find(user => user.id === selectedTask.assigned_user_id);
      setSelectedUser(assignedUser ? { value: assignedUser.id, label: assignedUser.username } : null);
    }
  }, [selectedTask, usersData]);

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
    const sourceItems = Array.from(sourceColumn);
    const destItems = source.droppableId === destination.droppableId ? sourceItems : Array.from(destColumn);
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setTasks({
        ...tasks,
        [source.droppableId]: sourceItems,
      });
    } else {
      destItems.splice(destination.index, 0, removed);
      setTasks({
        ...tasks,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });
    }

    // Update task status in Supabase
    await updateTask.mutateAsync({ ...removed, status: destination.droppableId });
    toast.success(`Task status updated to ${destination.droppableId}`);
  };

  const handleAddTask = async () => {
    const newTask = { content: newTaskContent, status: 'planned', created_at: new Date().toISOString(), user_id: selectedUser?.value || null };
    await addTask.mutateAsync(newTask);
    setNewTaskContent("");
    setSelectedUser(null); // Reset selected user
    setIsModalOpen(false);
    toast.success("Task added successfully!");
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setSelectedUser(usersData.find(user => user.id === task.user_id) || null); // Set selected user when editing a task
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask.mutateAsync(taskId);
    toast.success("Task deleted successfully!");
  };

  const handleSaveTask = async () => {
    await updateTask.mutateAsync({ ...selectedTask, user_id: selectedUser?.value || null });
    setIsModalOpen(false);
    toast.success("Task updated successfully!");
  };

  if (isLoadingTasks || isLoadingUsers) {
    return <div>Loading...</div>;
  }

  if (errorTasks || errorUsers) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Task Board</h1>
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
                          className="bg-white p-2 mb-2 rounded-md shadow-md flex flex-col justify-between relative"
                          onClick={() => handleEditTask(task)}
                        >
                          <div className="flex items-center">
                            {task.content}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-gray-500">
                              {new Date(task.created_at).toLocaleDateString()}
                            </div>
                            {task.user_id && (
                              <Avatar className="h-8 w-8"> {/* Adjusted size to 2/3 */}
                                <AvatarImage src={usersData.find(user => user.id === task.user_id)?.avatar_url} alt="User Avatar" />
                                <AvatarFallback>{usersData.find(user => user.id === task.user_id)?.username[0]}</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
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
            <Select
              value={selectedUser}
              onChange={setSelectedUser}
              options={usersData?.map(user => ({ value: user.id, label: user.username })) || []}
              placeholder="Assign to user"
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