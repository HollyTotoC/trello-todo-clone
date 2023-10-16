import { XCircleIcon } from "@heroicons/react/20/solid";
import { type } from "os";
import React from "react";

type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (elemnt: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDraggableHandleProps | null | undefined;
};

function TodoCard({
    todo,
    index,
    id,
    innerRef,
    dragHandleProps,
    draggableProps,
}: Props) {
    return (
        <div
            className="bg-white rounded-md my-2 !mx-0 drop-shadow-md"
            {...draggableProps}
            {...dragHandleProps}
            ref={innerRef}
        >
            <div className="flex justify-between items-center p-5">
                <p>{todo.title}</p>
                <button className="text-red-500 hover:text-red-600">
                    <XCircleIcon className="h-5 w-5 ml-5 " />
                </button>
            </div>

            {/*  Add img url */}
        </div>
    );
}

export default TodoCard;
