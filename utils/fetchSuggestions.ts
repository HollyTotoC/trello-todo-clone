import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestions = async (board: Board) => {
    const todos = formatTodosForAI(board);
    console.log("FORMATED TODOS before send >>", todos);

    const res = await fetch("/api/generateSummary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ todos }),
    });

    const GPTdata = await res.json();
    const { content } = GPTdata;
    return content;
};

export default fetchSuggestions;
