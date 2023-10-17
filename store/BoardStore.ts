import { create } from "zustand";
import { getTodosGroupedByColumn } from "@/utils/getTodosGroupedByColumn";
import { ID, database, storage } from "@/appwrite";
import uploadImage from "@/utils/uploadImage";

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateToDoInDb: (totodo: Todo, columnId: TypedColumn) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
    newTaskInput: string;
    setNewTaskInput: (input: string) => void;
    newTaskType: TypedColumn;
    setNewTaskType: (type: TypedColumn) => void;
    image: File | null;
    setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>(),
    },
    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board });
    },
    setBoardState: (board) => set({ board }),
    updateToDoInDb: async (todo, columnId) => {
        await database.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId,
            }
        );
    },
    searchString: "",
    setSearchString: (searchString) => set({ searchString }),
    deleteTask: async (teskIndex: number, todo: Todo, id: TypedColumn) => {
        const newColumns = new Map(get().board.columns);
        //delete todoId from newColumns
        newColumns.get(id)?.todos.splice(teskIndex, 1);
        set({ board: { columns: newColumns } });
        if (todo.image) {
            console.log("TODO IMAGE>>", todo.image);
            let image: ImageType | null = null;

            try {
                image = JSON.parse(todo.image);
            } catch (error) {
                console.error("Error parsing todo.image:", error);
            }

            if (image) {
                await storage.deleteFile(image.bucketId, image.fileId);
            }
        }
        await database.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        );
    },
    newTaskInput: "",
    setNewTaskInput: (input: string) => set({ newTaskInput: input }),
    newTaskType: "todo",
    setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
    image: null,
    setImage: (image: File | null) => set({ image }),
    addTask: async (
        todo: string,
        columnId: TypedColumn,
        image?: File | null
    ) => {
        let file: ImageType | undefined;
        let imageString: string | undefined;
        if (image) {
            const fileUploaded = await uploadImage(image);
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id,
                };
                imageString = JSON.stringify(file);
            }
        }

        await database.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                ...(file && { image: JSON.stringify(file) }),
            }
        );

        set({ newTaskInput: "" });
        set((state) => {
            const newColumns = new Map(state.board.columns);
            const newTodo: Todo = {
                $id: ID.unique(),
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                image: imageString,
            };
            const column = newColumns.get(columnId);
            if (!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo],
                });
            } else {
                newColumns.get(columnId)?.todos.push(newTodo);
            }
            return {
                board: {
                    columns: newColumns,
                },
            };
        });
    },
}));
