"use client";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

function Board() {
    const [board, getBoard, setBoardState, updateToDoInDb] = useBoardStore(
        (state) => [
            state.board,
            state.getBoard,
            state.setBoardState,
            state.updateToDoInDb,
        ]
    );

    const handleOnDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;
        console.log("result:", result);
        console.log(destination, source, type);

        //Handle drag outside context
        if (!destination) return;

        //Handle column drag
        if (type === "column") {
            const entries = Array.from(board.columns.entries());
            const [remoed] = entries.splice(source.index, 1);
            entries.splice(destination.index, 0, remoed);
            const rearangedColumns = new Map(entries);
            setBoardState({
                ...board,
                columns: rearangedColumns,
            });
        }

        //handle card drag
        const columns = Array.from(board.columns);
        const startColIndex = columns[Number(source.droppableId)];
        const finishColIndex = columns[Number(destination.droppableId)];
        const startCol: Column = {
            id: startColIndex[0],
            todos: startColIndex[1].todos,
        };
        const finishCol: Column = {
            id: finishColIndex[0],
            todos: finishColIndex[1].todos,
        };
        if (!startCol || !finishCol) return;
        if (source.index === destination.index && startCol.id === finishCol.id)
            return;

        const newTodos = startCol.todos;
        const [todoMoved] = newTodos.splice(source.index, 1);

        if (startCol.id === finishCol.id) {
            newTodos.splice(destination.index, 0, todoMoved);
            const newCol = {
                id: startCol.id,
                todos: newTodos,
            };
            const newColumns = new Map(board.columns);
            newColumns.set(startCol.id, newCol);
            setBoardState({ ...board, columns: newColumns });
        } else {
            const finishTodos = Array.from(finishCol.todos);
            finishTodos.splice(destination.index, 0, todoMoved);
            const newCol = {
                id: startCol.id,
                todos: newTodos,
            };
            const newColumns = new Map(board.columns);
            newColumns.set(startCol.id, newCol);
            newColumns.set(finishCol.id, {
                id: finishCol.id,
                todos: finishTodos,
            });
            updateToDoInDb(todoMoved, finishCol.id);
            setBoardState({ ...board, columns: newColumns });
        }
    };

    useEffect(() => {
        getBoard();
    }, [getBoard]);

    return (
        <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable
                    droppableId="boardId"
                    direction="horizontal"
                    type="column"
                >
                    {(provided) => (
                        <section
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto px-2"
                        >
                            {Array.from(board.columns.entries()).map(
                                ([id, column], index) => (
                                    <Column
                                        key={`column-${id}`}
                                        id={id}
                                        todos={column.todos}
                                        index={index}
                                    />
                                )
                            )}
                            {provided.placeholder}
                        </section>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
}

export default Board;
