"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');

// 投稿の送信
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    const params = {
        method: "POST",
        body: new URLSearchParams({ name, message }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    fetch("/post", params)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.json();
        })
        .then(() => {
            document.querySelector('#message').value = "";
        });
});

// 投稿のチェック（リアルタイム更新）
setInterval(() => {
    const params = {
        method: "POST",
        body: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    fetch(`${window.location.origin}/check`, params)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.json();
        })
        .then((response) => {
            if (number !== response.number) {
                fetchPosts();
            }
        });
}, 5000); // 5秒ごとに更新チェック

// 投稿の読み込み
function fetchPosts() {
    const params = {
        method: "POST",
        body: `start=${number}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    fetch("/read", params)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.json();
        })
        .then((response) => {
            number += response.messages.length;
            for (let mes of response.messages) {
                addPostToUI(mes);
            }
        });
}

// UIに投稿を追加
function addPostToUI(post) {
    let cover = document.createElement('div');
    cover.className = 'cover';
    cover.dataset.id = post.id;

    let nameArea = document.createElement('span');
    nameArea.className = 'name';
    nameArea.innerText = post.name;

    let messageArea = document.createElement('span');
    messageArea.className = 'mes';
    messageArea.innerText = post.message;

    let likeArea = document.createElement('div');
    likeArea.className = 'likes';
    likeArea.innerText = `いいね: ${post.likes || 0}`;

    let likeButton = document.createElement('button');
    likeButton.innerText = 'いいね';
    likeButton.addEventListener('click', () => {
        fetch(`/like/${post.id}`, { method: 'POST' })
            .then((response) => {
                if (!response.ok) throw new Error("エラー");
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    likeArea.innerText = `いいね: ${data.likes}`;
                }
            })
            .catch((err) => console.error(err));
    });

    let editButton = document.createElement('button');
    editButton.innerText = '編集';
    editButton.className = 'edit-button';
    editButton.addEventListener('click', () => {
        showEditForm(post.id, nameArea, messageArea);
    });

    let deleteButton = document.createElement('button');
    deleteButton.innerText = '削除';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => {
        fetch(`/post/${post.id}`, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then(() => {
                cover.remove(); // UIから削除
            })
            .catch((error) => console.error('Error:', error));
    });

    cover.appendChild(nameArea);
    cover.appendChild(messageArea);
    cover.appendChild(likeArea);
    cover.appendChild(likeButton);
    cover.appendChild(editButton);
    cover.appendChild(deleteButton);

    bbs.appendChild(cover);
}

// 編集フォームの表示
function showEditForm(id, nameArea, messageArea) {
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = nameArea.innerText;

    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.value = messageArea.innerText;

    const saveButton = document.createElement('button');
    saveButton.innerText = '保存';

    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'キャンセル';

    saveButton.addEventListener('click', () => {
        const updatedName = nameInput.value;
        const updatedMessage = messageInput.value;

        fetch(`/post/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ name: updatedName, message: updatedMessage })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then(() => {
                nameArea.innerText = updatedName;
                messageArea.innerText = updatedMessage;
                editForm.remove();
            })
            .catch((error) => console.error('Error:', error));
    });

    cancelButton.addEventListener('click', () => {
        editForm.remove();
    });

    editForm.appendChild(nameInput);
    editForm.appendChild(messageInput);
    editForm.appendChild(saveButton);
    editForm.appendChild(cancelButton);

    messageArea.parentElement.appendChild(editForm);
}

// 利用者向け：画面のレイアウト，ボタンの説明
// 管理者向け：サービスを立ち上げる手順
// 開発者向け：内部的な構造，変数の説明