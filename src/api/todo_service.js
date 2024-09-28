import { Todo } from "../models/todo.js";
export class TodoService {
    static baseUrl = "http://127.0.0.1:8000/default/todo";
    static async getAll() {
        const url = `${TodoService.baseUrl}/`;

        return fetch(url)
            .then((res) => {
                if (!res.ok) {
                    // レスポンスがエラーの場合はエラーをスロー
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                // レスポンスをJSONに変換
                return res.json();
            })
            .then((data) => {
                const todoItems = data.Items;

                // Todoオブジェクトに変換してリストに格納
                const _todos = todoItems.map(
                    (todoItem) =>
                        new Todo(
                            todoItem.id,
                            todoItem.title,
                            todoItem.detail,
                            todoItem.deadLine,
                            todoItem.is_done,
                            todoItem.is_deleted
                        )
                );
                return _todos; // _todosを返す
            })
            .catch((error) => {
                // エラーハンドリング
                console.error("Error fetching todos:", error);
                throw error; // エラーを再スローする（必要に応じて）
            });
    }

    static async update(formData) {
        const url = `${TodoService.baseUrl}/update_todo/`;
        const data = {
            post_type: formData.post_type,
            id: formData.id,
            title: formData.title,
            detail: formData.detail,
            deadLine: formData.deadLine,
            is_done: formData.is_done,
            is_deleted: formData.is_deleted,
        };
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("http error is occured!");
                }
                return res.json();
            })
            .then((data) => {
                console.log("success!");
                return true;
            })
            .catch((err) => {
                console.log("error has occured!");
                return false;
            });
    }
}
