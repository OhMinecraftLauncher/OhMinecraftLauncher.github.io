let messageTimeout = null;
        let isMessageShowing = false;
        
        /**
         * 在屏幕中央显示临时消息（防时序错乱版）
         * @param {string} message - 要显示的消息内容
         * @param {string} [type='success'] - 消息类型，可以是 'success', 'warning', 'error'
         */
        function showTemporaryMessage(message, type = 'success') {
            const messageElement = document.getElementById('temporary-message');
            
            // 如果已经有消息正在显示，先清除之前的定时器
            if (messageTimeout) {
                clearTimeout(messageTimeout);
                messageTimeout = null;
            }
            
            // 重置消息状态
            messageElement.className = '';
            messageElement.style.display = 'block';
            
            // 设置消息内容和样式
            messageElement.textContent = message;
            messageElement.classList.add('show');
            
            // 根据类型添加不同样式类
            switch(type) {
                case 'warning':
                    messageElement.classList.add('message-warning');
                    break;
                case 'error':
                    messageElement.classList.add('message-error');
                    break;
                default:
                    messageElement.classList.add('message-success');
            }
            
            // 2秒后自动隐藏
            messageTimeout = setTimeout(() => {
                messageElement.classList.remove('show');
                // 等待淡出动画完成后再隐藏元素
                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 300);
            }, 2000);
        }