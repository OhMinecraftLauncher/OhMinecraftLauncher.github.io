const showArraysBtn = document.getElementById('showArraysBtn');
        const arrayDisplayModal = document.getElementById('arrayDisplayModal');
        const modalBackdrop = document.getElementById('modalBackdrop');
        const orFilterTableBody = document.querySelector('#orFilterTable tbody');
        const andFilterTableBody = document.querySelector('#andFilterTable tbody');
        const editModal = document.getElementById('editModal');
        const editForm = document.getElementById('editForm');
        const cancelEditBtn = document.getElementById('cancelEdit');
        const groupField = document.getElementById('groupField');
        const andField = document.getElementById('andField');
		const addOrFilterBtn = document.getElementById('addOrFilterBtn');
		const addAndFilterBtn = document.getElementById('addAndFilterBtn');
        
        // 当前编辑的项信息
        let currentEditItem = {
            index: -1,
            type: '' // 'or' 或 'and'
        };
        
        // 显示数组按钮点击事件
        showArraysBtn.addEventListener('click', function() {
            // 填充表格数据
            populateTables();
            
            // 显示模态框和背景
            arrayDisplayModal.style.display = 'block';
            modalBackdrop.style.display = 'block';
        });
        
        // 点击背景关闭模态框
        modalBackdrop.addEventListener('click', function() {
			loadFilters();
            arrayDisplayModal.style.display = 'none';
            modalBackdrop.style.display = 'none';
            editModal.style.display = 'none';
        });
        
        // 取消编辑
        cancelEditBtn.addEventListener('click', function() {
            editModal.style.display = 'none';
        });
		
		// 添加orFilter
addOrFilterBtn.addEventListener('click', function() {
    openAddModal('or');
});

function isStringInteger(str) {
    // 先使用 parseInt 转换，然后检查是否为整数
    const num = parseInt(str, 10);
    return !isNaN(num) && Number.isInteger(num) && num.toString() === str.trim();
}

// 添加andFilter
addAndFilterBtn.addEventListener('click', function() {
    openAddModal('and');
});
        
        // 提交编辑表单
        // 修改原有的editForm提交事件处理
editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(editForm);
	var s_value = formData.get('value');
	if (isStringInteger(s_value))
	{
		s_value = parseInt(s_value,10);
	}
    const editedItem = {
        path: formData.get('path'),
        value: s_value,
        contain: formData.get('contain') === 'true',
        no: formData.get('no') === 'true',
    };
    
    // 如果是orFilter，添加group属性
    if (currentEditItem.type === 'or') {
        editedItem.group = formData.get('group');
		try
		{
			editedItem.and = JSON.parse(formData.get('and'));
		}
		catch
		{
			editedItem.and = undefined;
		}
    }
    
    // 更新或添加数组项
    if (currentEditItem.index === -1) {
        // 新增项
        if (currentEditItem.type === 'or') {
            orFilters.push(editedItem);
        } else {
            andFilters.push(editedItem);
        }
    } else {
        // 修改现有项
        if (currentEditItem.type === 'or') {
            orFilters[currentEditItem.index] = editedItem;
        } else {
            andFilters[currentEditItem.index] = editedItem;
        }
    }
    
    // 重新填充表格
    populateTables();
    
    // 关闭编辑模态框
    editModal.style.display = 'none';
});
        
        // 填充表格数据的函数
        function populateTables() {
            // 清空表格
            orFilterTableBody.innerHTML = '';
            andFilterTableBody.innerHTML = '';
            
            // 填充orFilter数据
            orFilters.forEach((item, index) => {
                const row = document.createElement('tr');
                
                // 添加数据单元格
                ['group', 'path', 'value', 'contain', 'no','and'].forEach(column => {
                    const cell = document.createElement('td');
					if (column === 'and')
					{
						cell.textContent = item[column] !== undefined ? JSON.stringify(item[column]) : '';
					}
					else
					{
						cell.textContent = item[column] !== undefined ? item[column].toString() : '';
					}
                    row.appendChild(cell);
                });
                
                // 添加操作按钮
                const actionCell = document.createElement('td');
                
                const editBtn = document.createElement('button');
                editBtn.className = 'action-btn edit-btn';
                editBtn.textContent = '修改';
                editBtn.addEventListener('click', () => openEditModal(index, 'or', item));
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'action-btn delete-btn';
                deleteBtn.textContent = '删除';
                deleteBtn.addEventListener('click', () => deleteItem(index, 'or'));
                
                actionCell.appendChild(editBtn);
                actionCell.appendChild(deleteBtn);
                row.appendChild(actionCell);
                
                orFilterTableBody.appendChild(row);
            });
            
            // 填充andFilter数据
            andFilters.forEach((item, index) => {
                const row = document.createElement('tr');
                
                // 添加数据单元格
                ['path', 'value', 'contain', 'no'].forEach(column => {
                    const cell = document.createElement('td');
                    cell.textContent = item[column] !== undefined ? item[column].toString() : '';
                    row.appendChild(cell);
                });
                
                // 添加操作按钮
                const actionCell = document.createElement('td');
                
                const editBtn = document.createElement('button');
                editBtn.className = 'action-btn edit-btn';
                editBtn.textContent = '修改';
                editBtn.addEventListener('click', () => openEditModal(index, 'and', item));
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'action-btn delete-btn';
                deleteBtn.textContent = '删除';
                deleteBtn.addEventListener('click', () => deleteItem(index, 'and'));
                
                actionCell.appendChild(editBtn);
                actionCell.appendChild(deleteBtn);
                row.appendChild(actionCell);
                
                andFilterTableBody.appendChild(row);
            });
        }
        
        // 打开编辑模态框
        function openEditModal(index, type, item) {
            currentEditItem.index = index;
            currentEditItem.type = type;
            
            // 根据类型显示/隐藏group字段
            if (type === 'or') {
                groupField.style.display = 'block';
                document.getElementById('editGroup').value = item.group || '';
                andField.style.display = 'block';
                document.getElementById('editAnd').value = JSON.stringify(item.and);
            } else {
                groupField.style.display = 'none';
                andField.style.display = 'none';
            }
            
            // 填充表单数据
            document.getElementById('editPath').value = item.path;
            document.getElementById('editValue').value = item.value;
            document.getElementById('editContain').value = item.contain.toString();
            document.getElementById('editNo').value = item.no.toString();
            
            // 显示编辑模态框
            editModal.style.display = 'block';
        }
        
        // 删除项
        function deleteItem(index, type) {
            if (confirm('确定要删除此项吗？')) {
                if (type === 'or') {
                    orFilters.splice(index, 1);
                } else {
                    andFilters.splice(index, 1);
                }
                populateTables();
            }
        }
		
		// 打开添加模态框
function openAddModal(type) {
    currentEditItem.index = -1; // -1表示新增
    currentEditItem.type = type;
    
    // 根据类型显示/隐藏group字段
    if (type === 'or') {
        groupField.style.display = 'block';
        document.getElementById('editGroup').value = '';
        andField.style.display = 'block';
        document.getElementById('editAnd').value = '';
    } else {
        groupField.style.display = 'none';
        andField.style.display = 'none';
    }
    
    // 清空表单数据
    document.getElementById('editPath').value = '';
    document.getElementById('editValue').value = '';
    document.getElementById('editContain').value = 'false';
    document.getElementById('editNo').value = 'false';
    
    // 修改模态框标题
    document.querySelector('#editModal h3').textContent = "添加 " + (type === "or" ? "或筛选器" : "与筛选器") + " 项";
    
    // 显示编辑模态框
    editModal.style.display = 'block';
}