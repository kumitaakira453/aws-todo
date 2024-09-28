import { Todo } from "./models/todo.js";
import { Card } from "./component/card.js";
import { Modal } from "./component/modal.js";
import { TodoService } from "./api/todo_service.js";
import { Message } from "./component/message.js";
import { CardToglle } from "./component/card_toggle.js";

document.addEventListener("DOMContentLoaded", () => {
    const indexManager = new IndexManager();
    const card_toggle = new CardToglle();
});

class IndexManager {
    constructor() {
        // this.modalMask = document.querySelector(".modal_mask");
        // this.modal = document.querySelector(".modal");
        // this.modalCloseBtn = document.querySelector(".modal__close-btn");
        // this.cardContainer = document.querySelector(".card-container");
        this.floatingBtn = document.querySelector(".floating-btn");
        // this.modalSubmit = document.querySelector(".modal__submit");
        // todoをリストで管理(インデックスもそのまま利用)
        this.todos = [];
        this.setEvents();
        // todo_serviceをインスタンス化
        this.todo_service = new TodoService(
            "http://127.0.0.1:8000/default/todo"
        );
        // cardを描画
        this.getTodos();
    }
    setEvents() {
        this.floatingBtn.addEventListener("click", () => {
            // this.openModal();
            // モーダルインスタンスの作成処理をかく
            const newTodo = new Todo();
            console.log(newTodo);
            const newCard = new Card(newTodo);
            Modal.new(newCard);
            console.log(newCard);
        });
        // this.modalCloseBtn.addEventListener("click", () => {
        //     this.closeModal();
        // });
        // this.modalSubmit.addEventListener("click", async () => {
        //     await this.modalOnSave();
        // });
    }
    /* モーダルの表示 */
    // openModal() {
    //     // モーダルの中身を更新する

    //     this.modalMask.style.display = "block";
    //     this.modal.style.display = "flex";
    // }
    /* モーダルの非表示 */
    // closeModal() {
    //     this.modalMask.style.display = "none";
    //     this.modal.style.display = "none";
    // }
    /* モーダルの保存・作成ボタンを押した時の処理 */
    async modalOnSave() {
        const formId = document.querySelector(".modal").id;
        const formTitle = document.querySelector(".modal__title").value;
        const formDetail = document.querySelector(".modal__detail").value;
        const formDeadLine = document.querySelector(".modal__deadline").value;
        const is_new = document.querySelector(".modal__is_new").value;
        let post_type = "";
        if (is_new) {
            post_type = "create_new";
        } else {
            post_type = "update_content";
        }
        const data = {
            post_type: post_type,
            id: formId,
            title: formTitle,
            detail: formDetail,
            deadline: formDeadLine,
            is_done: null,
            is_deleted: null,
        };
        is_success = await this.todo_service.update(data);
        if (!is_success) {
            alert("更新に失敗しました");
        }
        // 再度データを取得して再描画
    }
    /* todoを取得しtodosに追加 */
    async getTodos() {
        this.todos = await this.todo_service.getAll();
        console.log(this.todos);
        // リストを返す
        const cards = this.todos.map((todo) => new Card(todo));
        const sortedCards = cards.sort((a, b) => {
            const dateA = new Date(a.todo.deadLine);
            const dateB = new Date(b.todo.deadLine);
            // 過去の日付を優先するため、dateAがdateBよりも早い場合（過去の日付の場合）
            return dateA < dateB ? -1 : 1;
        });
        sortedCards.forEach((card) => card.create());
        // toggleの反映(コンストラクタを非同期にできないので)
        CardToglle.resetShowCard();
    }
}
