import { NextResponse } from "next/server";
import openai from "@/openai";

export async function POST(request: Request) {
    const requestBody = await request.json();
    const todos = requestBody.todos;
    console.log("API todos", todos);

    //open AI com
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [
            {
                role: "system",
                content:
                    "When repsonding, welcome the user and say welcome to the Troto App ! Limit respond to 200 characters",
            },
            {
                role: "user",
                content: `Hi there, provide a summar of the following todos. Cound How many todos are in each categrory such as Todo, in progress and done, then tell the user to have a productive day! Here's the data : ${JSON.stringify(
                    todos
                )}`,
            },
        ],
    });
    const data = response;
    console.log("DATA IS:", data);
    console.log("MESSAGE IS :", data.choices[0].message);
    return NextResponse.json(data.choices[0].message);
}
