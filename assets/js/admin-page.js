(function(wp) {
    var el = wp.element.createElement;
    var container = document.getElementById('supbotai-admin-page');
    if(!container) {
        return;
    }
    
    content = JSON.parse(supbotai.postJson);
    supbotai.content = content;

    function getNodeContainer() {
        var cards = [];
        var nodes = content['nodes'];

        for (let i = 0; i < nodes.length; i++) {

            let node = nodes[i];

            var responses = [];
            for(let j = 0; j < node['responses'].length; j++) {

                let response = node['responses'][j];

                var btns = [];
                if(j > 0) {
                    btns.push(el('div', {
                        className: 'supbotai-admin-node-response-control-btn dashicons dashicons-arrow-up-alt2',
                        onClick: function() { moveResponseUp(i, j); }
                    }));
                }
                btns.push(el('div', {
                    className: 'supbotai-admin-node-response-control-btn dashicons dashicons-no',
                    onClick: function() { removeResponse(i, j); }
                }));

                let actionText = '-';
                if (response.action >= 0 && response.action < nodes.length){
                    actionText = (response.action + 1) + '. ' + nodes[response.action].name;
                }

                let row = el('div', {
                    className: 'supbotai-admin-node-response-row' + (j == 0 ? ' first-row' : '')
                },
                    el('div', {className: 'supbotai-admin-node-response-control-btns'}, btns),
                    el('div', {
                        className: 'supbotai-admin-node-response-caption',
                        onClick: function(event) {
                            var el = event.target;
                            var isEditing = true;
                            el.contentEditable = true;
                            el.classList.add('edit-mode');
                            el.focus();
    
                            function exitEditMode() {
                                if (!isEditing) return;
                                isEditing = false;
                                el.contentEditable = false;
                                el.classList.remove('edit-mode');
                                el.removeEventListener('blur', exitEditMode);
                                el.removeEventListener('keydown', onKeyDown);
                                document.body.focus();
                                response.caption = el.innerText || el.textContent;
                                updateDatabase();
                            }
                        
                            function onKeyDown(e) {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    el.blur();
                                }
                            }
                        
                            el.addEventListener('blur', exitEditMode);
                            el.addEventListener('keydown', onKeyDown);
                        }
                    }, response.caption),
                    el('div', {
                        className: 'supbotai-admin-node-response-action',
                        onClick: function(event) {
                            renderResponseActionMenu(event.target, response);
                        }
                    }, actionText),
                );
                responses.push(row);
            }

            var btns = [];
            if(i > 0) {
                btns.push(el('div', {
                    className: 'supbotai-admin-node-control-btn dashicons dashicons-arrow-left-alt2',
                    onClick: function() { moveNodeUp(i); }
                }));
            }
            if(i < nodes.length - 1) {
                btns.push(el('div', {
                    className: 'supbotai-admin-node-control-btn dashicons dashicons-arrow-right-alt2',
                    onClick: function() { moveNodeDown(i); }
                }));
            }
            btns.push(el('div', {
                className: 'supbotai-admin-node-control-btn dashicons dashicons-no',
                onClick: function() { removeNode(i); }
            }));

            var card = el('div', { key: i, className: 'supbotai-admin-node-card'},
                el('div', {className: 'supbotai-admin-node-control-btns'}, btns),
                el('div', {className: 'supbotai-admin-supbotai-admin-node-name-row'}, 
                    el('div', {className: 'supbotai-admin-node-index'}, (i + 1) + '.'),
                    el('div', {
                        className: 'supbotai-admin-node-name',
                        onClick: function(event) {
                            var el = event.target;
                            var isEditing = true;
                            el.contentEditable = true;
                            el.classList.add('edit-mode');
                            el.focus();
    
                            function exitEditMode() {
                                if (!isEditing) return;
                                isEditing = false;
                                el.contentEditable = false;
                                el.classList.remove('edit-mode');
                                el.removeEventListener('blur', exitEditMode);
                                el.removeEventListener('keydown', onKeyDown);
                                document.body.focus();
                                node.name = el.innerText || el.textContent;
                                updateDatabase();
                            }
                        
                            function onKeyDown(e) {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    el.blur();
                                }
                            }
                        
                            el.addEventListener('blur', exitEditMode);
                            el.addEventListener('keydown', onKeyDown);
                        }
                    }, node.name)
                    ),
                el('div', {className: 'supbotai-admin-node-label'}, 'Message:'),
                el('div', {
                    className: 'supbotai-admin-node-message',
                    onClick: function(event) {
                        var el = event.target;
                        var isEditing = true;
                        el.contentEditable = true;
                        el.classList.add('edit-mode');
                        el.focus();

                        function exitEditMode() {
                            if (!isEditing) return;
                            isEditing = false;
                            el.contentEditable = false;
                            el.classList.remove('edit-mode');
                            el.removeEventListener('blur', exitEditMode);
                            el.removeEventListener('keydown', onKeyDown);
                            document.body.focus();
                            node.message = el.innerText || el.textContent;
                            updateDatabase();
                        }
                    
                        function onKeyDown(e) {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                el.blur();
                            }
                        }
                    
                        el.addEventListener('blur', exitEditMode);
                        el.addEventListener('keydown', onKeyDown);
                    }
                }, node.message),
                el('div', {className: 'supbotai-admin-node-label'}, 'Responses:'),
                responses,
                el('div', {
                    className: 'supbotai-admin-node-add-response-btn',
                    onClick: function() { addResponse(i); }
                }, '+ Add Response')
            );
    
            cards.push(card);
        }

        return el('div', {className: 'supbotai-admin-node-container'}, 
            cards,
            el('div', {
                className: 'supbotai-admin-node-add-node-btn',
                onClick: function() { addNode(); }
            }, '+ Add Node'));
    };

    function addNode() {
        var newNode = JSON.parse('{"name": "New Node","message": "-", "responses": []}');
        content['nodes'].push(newNode);
        render();
        updateDatabase();
    }

    function removeNode(nodeIndex) {
        content['nodes'].splice(nodeIndex, 1);
        content['nodes'].forEach(function(node) {
            node.responses.forEach(function(response) {
                if (response.action == nodeIndex) {
                    response.action = -1;
                } else if (response.action > nodeIndex) {
                    response.action -= 1;
                }
            });
        });
        render();
        updateDatabase();
    }

    function moveNodeUp(nodeIndex) {
        if(nodeIndex <= 0 || nodeIndex >= content['nodes'].length){
            return;
        }
        var temp = content['nodes'][nodeIndex];
        content['nodes'][nodeIndex] = content['nodes'][nodeIndex - 1];
        content['nodes'][nodeIndex - 1] = temp;
        content['nodes'].forEach(function(node, index) {
            node.responses.forEach(function(response) {
                if (response.action === nodeIndex) {
                    response.action = nodeIndex - 1;
                } else if (response.action === nodeIndex - 1) {
                    response.action = nodeIndex;
                }
            });
        });
        render();
        updateDatabase();
    }

    function moveNodeDown(nodeIndex) {
        moveNodeUp(nodeIndex + 1);
    }

    function addResponse(nodeIndex) {
        var newResponse = JSON.parse('{"caption": "-", "action": -1}');
        content['nodes'][nodeIndex].responses.push(newResponse);
        render();
        updateDatabase();
    }

    function removeResponse(nodeIndex, responseIndex) {
        content['nodes'][nodeIndex].responses.splice(responseIndex, 1);
        render();
        updateDatabase();
    }

    function moveResponseUp(nodeIndex, responseIndex) {
        if(responseIndex <= 0 || responseIndex >= content['nodes'][nodeIndex].responses.length){
            return;
        }
        var temp = content['nodes'][nodeIndex].responses[responseIndex];
        content['nodes'][nodeIndex].responses[responseIndex] = content['nodes'][nodeIndex].responses[responseIndex - 1];
        content['nodes'][nodeIndex].responses[responseIndex - 1] = temp;
        render();
        updateDatabase();
    }

    function renderResponseActionMenu(currentResponseElement, currentResponse) {
        const existingMenu = document.querySelector('.supbotai-node-action-menu');
        if (existingMenu) {
            existingMenu.parentNode.removeChild(existingMenu);
            document.removeEventListener('mousedown', handleClickOutside);
        }
    
        const menu = document.createElement('div');
        menu.className = 'supbotai-node-action-menu';
        document.body.appendChild(menu);
    
        content['nodes'].forEach((node, index) => {
            const option = document.createElement('div');
            option.textContent = `${index + 1}. ${node.name}`;
            option.className = 'supbotai-admin-response-action-menu-option';
            option.onclick = function() {
                currentResponse.action = index;
                render();
                updateDatabase();
                menu.parentNode.removeChild(menu);
                document.removeEventListener('mousedown', handleClickOutside);
            };
    
            if (currentResponse.action === index) {
                option.classList.add('current');
            }
    
            menu.appendChild(option);
        });
    
        const rect = currentResponseElement.getBoundingClientRect();
        menu.style.position = 'absolute';
        menu.style.top = `${window.scrollY - 24 * (currentResponse.action == -1 ? 0 : currentResponse.action) + rect.top}px`;
        menu.style.left = `${window.scrollX + 24 + rect.left}px`;
    
        const currentOption = menu.querySelector('.current');
        if (currentOption) {
            menu.scrollTop = currentOption.offsetTop - menu.offsetTop;
        }

        function handleClickOutside(event) {
            if (menu != null && !menu.contains(event.target) && event.target !== currentResponseElement) {
                menu.parentNode.removeChild(menu);
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
    }    

    function render() {
        if (container) {
            var nodeCardsContainer = getNodeContainer();
            wp.element.render(nodeCardsContainer, container);
        }
    }

    function updateDatabase() {
        jQuery.post(supbotaiAjax.ajaxurl, {
            action: 'supbotai_save_json',
            post_id: supbotai.postId,
            json_content: JSON.stringify(content),
            nonce: supbotaiAjax.nonce
        }, function(res) {
            console.log('Post updated successfully!');
        });
    }

    document.addEventListener('DOMContentLoaded', render());
})(window.wp);