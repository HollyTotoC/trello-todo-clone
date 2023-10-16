import { useBoardStore } from "@/store/BoardStore";
import getUrl from "@/utils/getUrl";
import { XCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { type } from "os";
import React, { useEffect, useState } from "react";
import {
    DraggableProvidedDragHandleProps,
    DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (elemnt: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
    todo,
    index,
    id,
    innerRef,
    dragHandleProps,
    draggableProps,
}: Props) {
    const deleteTask = useBoardStore((state) => state.deleteTask);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        if (todo.image) {
            const fetchImage = async () => {
                const url = await getUrl(todo.image!);
                if (url) {
                    setImageUrl(url.toString());
                }
            };
            fetchImage();
        }
    }, [todo]);
    return (
        <div
            className="bg-white rounded-md my-2 !mx-0 drop-shadow-md"
            {...draggableProps}
            {...dragHandleProps}
            ref={innerRef}
        >
            <div className="flex justify-between items-center p-5">
                <p>{todo.title}</p>
                <button
                    onClick={() => deleteTask(index, todo, id)}
                    type="button"
                    className="text-red-500 hover:text-red-600"
                >
                    <span className="hidden">close</span>
                    <XCircleIcon className="h-5 w-5 ml-5 " />
                </button>
            </div>

            {/*  Add img url */}
            {imageUrl && (
                <div className="relative h-full w-full rounded-b-md">
                    <Image
                        src={imageUrl}
                        alt="Task Image"
                        width={400}
                        height={200}
                        className="w-full object-contain rounded-b-md"
                    />
                </div>
            )}
        </div>
    );
}

export default TodoCard;
