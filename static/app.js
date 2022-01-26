class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbot__button"),
      chatBox: document.querySelector(".chatbot__support"),
      sendButton: document.querySelector(".send__button"),
    };

    this.state = false;
    this.message = [];
  }

  display() {
    const { openButton, chatBox, sendButton } = this.args;

    openButton.addEventListener("click", () => this.toggleState(chatBox));

    sendButton.addEventListener("click", () => this.onSendButton(chatBox));

    const node = chatBox.querySelector("input");
    node.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        this.onSendButton(chatBox);
      }
    });
  }

  toggleState(chatBox) {
    this.state = !this.state;

    if (this.state) {
      chatbox.classList.add("chatbox--active");
    } else {
      chatbox.classList.remove("chatbox--active");
    }
  }

  onSendButton(chatbox) {
    var texField = chatbox.querySelector("input");
    let text1 = texField.value;
    if (text1 === "") {
      return;
    }

    let msg1 = { name: "User", message: text1 };
    this.message.push(msg1);

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: JSON.stringify({ message: text1 }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        let msg2 = { name: "Genee", message: r.answer };
        this.message.push(msg2);
        this.updateChatText(chatBox);
        texField.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        this.updateChatText(chatBox);
        texField.value = "";
      });
  }

  updateChatText(chatBox) {
    var html = "";
    this.message
      .slice()
      .reverse()
      .forEach(function (item, index) {
        if (item.name === "Genee") {
          html +=
            '<div class="message__item message__item--visitor">' +
            item.message +
            "</div>";
        } else {
          html +=
            '<div class="message__item message__item--operator">' +
            item.message +
            "</div>";
        }
      });

    const chatmessage = chatbox.querySelector(".chatbox__message");
    chatmessage.innerHTML = html;
  }
}

const chatbox = new Chatbox();
chatbox.display();
