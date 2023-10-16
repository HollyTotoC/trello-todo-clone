import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { useEffect } from "react";

type Props = {
    id: TypedColumn;
    todos: Todo[];
    index: number;
};

const idToColumnText: {
    [key in TypedColumn]: string;
} = {
    todo: "To Do",
    progress: "In Progress",
    done: "Done",
};

function Column({ id, todos, index }: Props) {
    useEffect(() => {
        console.log(
            "Column component rendering with id:",
            id,
            "and todos:",
            todos
        );
    });
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <Droppable droppableId={index.toString()} type="card">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`p-2 rounded-2xl shadow-sm ${
                                    snapshot.isDraggingOver
                                        ? "bg-green-200"
                                        : "bg-white/50"
                                }`}
                            >
                                <h2 className="flex justify-between font-bold text-xl p-2">
                                    {idToColumnText[id]}
                                    <span className="text-gray-500 bg-gray-200 px-2 py-1 rounded-full text-sm">
                                        {todos.length}
                                    </span>
                                </h2>

                                <div className="space-x-2">
                                    {todos.map((todo, index) => (
                                        <Draggable
                                            key={todo.$id}
                                            draggableId={todo.$id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <TodoCard
                                                    todo={todo}
                                                    index={index}
                                                    id={id}
                                                    innerRef={provided.innerRef}
                                                    draggableProps={
                                                        provided.draggableProps
                                                    }
                                                    dragHandleProps={
                                                        provided.dragHandleProps
                                                    }
                                                />
                                            )}
                                        </Draggable>
                                    ))}

                                    {provided.placeholder}

                                    <div className="flex items-end justify-end">
                                        <button className="text-green-500 hover:text-green-600">
                                            <PlusCircleIcon className="h-10 w-10" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
}

export default Column;
