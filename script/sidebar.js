// 获取DOM元素
        const sidebarTrigger = document.getElementById('sidebarTrigger');
        const modal = document.getElementById('modal');
        const closeBtn = document.getElementById('closeBtn');
        const sidebar = document.getElementById('sidebar');
		const sidebarBadge = document.getElementById('sidebarBadge');
		const modal_sidebar = document.getElementById('modal-sidebar');
		
		var count = 0;



// 更新角标
function updateBadge(c) {
	let displayCount = c;
	if (c > 99)
	{
		displayCount = "99+";
	}
    //const displayCount = Math.min(c, 9999); // 限制最多4位数
    sidebarBadge.setAttribute('data-count', displayCount);
    sidebarBadge.textContent = displayCount;
    sidebarBadge.style.display = c > 0 ? 'flex' : 'none';
}

// 初始化角标
updateBadge(count);
        
        // 点击箭头按钮显示模态框
        sidebarTrigger.addEventListener('click', function() {
            modal.style.display = 'block';
        });
        
        // 点击关闭按钮隐藏模态框
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // 点击模态框外部也隐藏模态框
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // 可选：监听窗口大小变化，如果从手机切换到桌面，确保模态框关闭
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1200) {
                modal.style.display = 'none';
            }
        });