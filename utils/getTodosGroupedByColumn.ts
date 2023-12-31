import { database } from "@/appwrite";

export const getTodosGroupedByColumn = async () => {
    const data = await database.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
    );
    const todos = data.documents;
    const columns = todos.reduce((acc, todo) => {
        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: [],
            });
        }
        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.createdAt,
            title: todo.title,
            status: todo.status,
            ...(todo.image && { image: JSON.parse(todo.image) }),
        });
        return acc;
    }, new Map<TypedColumn, Column>());

    // If colunms are empty, add empty columns
    const columnTypes: TypedColumn[] = ["todo", "progress", "done"];
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: [],
            });
        }
    }
    // sort columns by column type
    const sortedColumns = new Map<TypedColumn, Column>(
        Array.from(columns.entries()).sort(
            (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    );
    const board: Board = {
        columns: sortedColumns,
    };
    console.log(board);
    return board;
};
