document.addEventListener("DOMContentLoaded", function() {

    var content;
    var chatBtn;
    var restartBtn;
    var chatBody;
    var messageContainer;
    var isChatOpened = false;
    var isChatStarted = false;


    function init() {
        content = get_content();
        var chatHtml = '<div id="supbotai-chat-btn" class="closed"><div class="supbotai-chat-icon-wrapper"></div></div>' +
            '<div id="supbotai-chat-body"><div id="supbotai-chat-message-container"></div></div>' +
            '<div id="supbotai-chat-restart-btn"></div>';
        document.body.insertAdjacentHTML('beforeend', chatHtml);
        chatBtn = document.getElementById('supbotai-chat-btn');
        chatBtn.addEventListener('click', open_chat);
        restartBtn = document.getElementById('supbotai-chat-restart-btn')
        restartBtn.addEventListener('click', chat_restart);
        chatBody = document.getElementById('supbotai-chat-body');
        messageContainer = document.getElementById('supbotai-chat-message-container');
    }


    function get_content() {
        if(supbotai.content === undefined)
            return JSON.parse(supbotai.postJson);
        return supbotai.content;
    }


    function open_chat() {
        chatBtn.style.transform = 'translateY(4px)';

        setTimeout(function() {
            chatBtn.style.transform = '';
        }, 100);

        setTimeout(function() {
            if (isChatOpened == false) {
                isChatOpened = true;
                chatBtn.classList.remove('closed');
                chatBtn.classList.add('open');
                chatBody.style.display = 'block';
                restartBtn.style.display = 'block';
                chat_start();
            } else {
                isChatOpened = false;
                chatBtn.classList.remove('open');
                chatBtn.classList.add('closed');
                chatBody.style.display = 'none';
                restartBtn.style.display = 'none';
            }
        }, 150);
    }


    function chat_start() {
        if(isChatStarted == true) {
            return;
        }
        isChatStarted = true;
        show_node(0);
    }


    function show_node(nodeIndex) {
        if (nodeIndex < 0 || nodeIndex >= content['nodes'].length)
            return;
        let node = content['nodes'][nodeIndex];

        var messageElement = document.createElement('div');
        messageElement.textContent = node.message;
        messageElement.classList.add('supbotai-chat-message');
        messageContainer.appendChild(messageElement);

        let responseContainer = document.createElement('div');
        responseContainer.classList.add('supbotai-chat-response-container');
        messageContainer.appendChild(responseContainer);
        chatBody.scrollTop = chatBody.scrollHeight;

        for(let i = 0; i < node.responses.length; i++) {
            var responseElement = document.createElement('div');
            responseElement.textContent = node.responses[i].caption;
            responseElement.classList.add('supbotai-chat-response-btn');
            responseContainer.appendChild(responseElement);
            chatBody.scrollTop = chatBody.scrollHeight;

            responseElement.addEventListener('click', callback = () => {
                if(node.responses[i].action < 0 || node.responses[i].action >= content['nodes'].length)
                    return;
                responseContainer.innerHTML = '';
                for(let j = 0; j < node.responses.length; j++) {
                    var responseElement = document.createElement('div');
                    responseElement.textContent = node.responses[j].caption;
                    responseElement.classList.add('supbotai-chat-response-btn');
                    responseElement.classList.add(j == i ? 'supbotai-chat-response-btn-selected' : 'supbotai-chat-response-btn-not-selected');
                    responseContainer.appendChild(responseElement);
                }
                show_node(node.responses[i].action);
            });
        }
    }


    function chat_restart() {
        content = get_content();
        messageContainer.innerHTML = '';
        isChatStarted = false;
        chat_start();
        restartBtn.classList.add('supbotai-chat-restart-btn-clicked');
        setTimeout(() => {
            restartBtn.classList.remove('supbotai-chat-restart-btn-clicked');
        }, 100);
    }


    init();
});

