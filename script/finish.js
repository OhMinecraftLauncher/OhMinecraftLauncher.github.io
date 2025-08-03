        // 获取DOM元素
        //const showModalBtn = document.getElementById('showModalBtn');
        const exim_modal = document.getElementById('exim-modal');
        const export_modal = document.getElementById('export-modal');
        const closeBtn2 = document.getElementById('closeBtn2');
        const copyBtn = document.getElementById('copyBtn');
        const copyText = document.getElementById('copyText');
        //const tempMessage = document.getElementById('temporary-message');


        // 点击模态框外部关闭
        window.addEventListener('click', (event) => {
            if (event.target === exim_modal) {
                exim_modal.style.display = 'none';
            }
        });

        // 复制功能
        copyBtn.addEventListener('click', () => {
            copyText.select();
            document.execCommand('copy');
            
            // 显示复制成功的提示
            showTemporaryMessage('已复制到剪贴板');
        });
		        // 关闭模态框
        closeBtn2.addEventListener('click', () => {
            exim_modal.style.display = 'none';
        });