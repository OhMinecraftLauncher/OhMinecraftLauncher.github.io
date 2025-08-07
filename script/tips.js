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
		
/**
 * 在指定元素附近显示固定位置的气泡信息（带关闭按钮）
 * @param {HTMLElement} targetElement - 需要显示气泡的目标元素
 * @param {string} message - 要显示的气泡信息
 * @param {Object} [options] - 配置选项
 * @param {string} [options.position='top'] - 气泡位置 (top, bottom, left, right)
 * @param {number} [options.duration=3000] - 气泡显示时长(毫秒)，0表示不自动消失
 * @param {string} [options.backgroundColor='#333'] - 气泡背景色
 * @param {string} [options.textColor='#fff'] - 气泡文字颜色
 * @param {string} [options.closeButtonColor='#fff'] - 关闭按钮颜色
 */
function showTooltip(targetElement, message, options = {}) {
    // 默认配置
    const config = {
        position: 'top',
        duration: 3000,
        backgroundColor: '#333',
        textColor: '#fff',
        closeButtonColor: '#fff',
        ...options
    };

    // 创建气泡容器
    const tooltip = document.createElement('div');
    tooltip.style.position = 'fixed'; // 改为fixed定位
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '14px';
    tooltip.style.color = config.textColor;
    tooltip.style.backgroundColor = config.backgroundColor;
    tooltip.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    tooltip.style.zIndex = '1000';
    tooltip.style.width = '200px';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.3s';
    tooltip.style.display = 'flex';
    tooltip.style.flexDirection = 'column';

    // 创建内容区域（包含关闭按钮和消息）
    const contentWrapper = document.createElement('div');
    contentWrapper.style.position = 'relative';
    contentWrapper.style.padding = '8px 12px';
    contentWrapper.style.wordBreak = 'break-word';

    // 创建关闭按钮
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '4px';
    closeButton.style.right = '8px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '16px';
    closeButton.style.color = config.closeButtonColor;
    closeButton.style.userSelect = 'none';
    
    // 创建消息内容
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.paddingRight = '16px'; // 为关闭按钮留出空间

    // 组装元素
    contentWrapper.appendChild(closeButton);
    contentWrapper.appendChild(messageElement);
    tooltip.appendChild(contentWrapper);
    document.body.appendChild(tooltip);

    // 计算位置
    function updatePosition() {
        const targetRect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top, left;
        
        switch (config.position) {
            case 'top':
                top = targetRect.top - tooltipRect.height - 8;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + 8;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.right + 8;
                break;
            default:
                top = targetRect.top - tooltipRect.height - 8;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        }
        
        // 边界检查
        left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 24));
        top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8));
        
        tooltip.style.top = `${top}px`; // 不需要加scrollY
        tooltip.style.left = `${left}px`; // 不需要加scrollX
    }

    // 初始定位
    updatePosition();
    
    // 添加事件监听器
    const resizeHandler = () => updatePosition();
    const scrollHandler = () => updatePosition();
    
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('scroll', scrollHandler);
    
    // 显示气泡
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);

    // 隐藏气泡的函数
    function hideTooltip() {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip.parentNode) {
                document.body.removeChild(tooltip);
            }
            window.removeEventListener('resize', resizeHandler);
            window.removeEventListener('scroll', scrollHandler);
        }, 300);
    }

    // 点击关闭按钮时隐藏
    closeButton.addEventListener('click', hideTooltip);

    // 自动消失
    if (config.duration > 0) {
        setTimeout(hideTooltip, config.duration);
    }

    // 返回隐藏函数以便手动控制
    return hideTooltip;
}