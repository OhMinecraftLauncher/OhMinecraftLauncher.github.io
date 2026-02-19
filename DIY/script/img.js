document.addEventListener("DOMContentLoaded", function() {
const container = document.getElementById('picture');
            const movableImg = document.getElementById('picture-img');   // 下层图片 (可替换)

            // 隐藏的文件输入 (用于点击上传)
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);  // 添加到body以便能触发

            // 变换状态
            let scale = 0.8;            
            let translateX = 0;
            let translateY = 0;

            // 当前图片原始尺寸 (默认与内置svg一致)
            let imgNaturalWidth = 800;
            let imgNaturalHeight = 600;

            // 容器尺寸
            let containerWidth = 800;
            let containerHeight = 600;

            // 拖拽与点击识别
            let isDragging = false;
            let startPointerX = 0;
            let startPointerY = 0;
            let startTranslateX = 0;
            let startTranslateY = 0;
            let dragThresholdPassed = false;      // 是否移动超过阈值（用于区分点击/拖拽）
            const CLICK_THRESHOLD = 5;             // 像素

            // 多点触摸缩放
            let pinchDistance = 0;
            let pinchScale = 1;

            // ---------- 辅助函数：更新变换 ----------
            function updateTransform() {
                movableImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            }

            // ---------- 居中函数 ----------
            function centerImage() {
                const scaledWidth = imgNaturalWidth * scale;
                const scaledHeight = imgNaturalHeight * scale;
                translateX = (containerWidth - scaledWidth) / 2;
                translateY = (containerHeight - scaledHeight) / 2;
                updateTransform();
            }

            // ---------- 图片加载后重置尺寸并居中 ----------
            function onImageLoad() {
                imgNaturalWidth = movableImg.naturalWidth || 800;
                imgNaturalHeight = movableImg.naturalHeight || 600;
                scale = 0.8;   // 重置缩放，确保可见
                centerImage();
            }

            // 绑定内置图片加载
            if (movableImg.complete) {
                onImageLoad();
            } else {
                movableImg.addEventListener('load', onImageLoad);
            }

            // ---------- 文件上传处理 ----------
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;

                // 创建对象URL
                const url = URL.createObjectURL(file);

                // 释放之前的对象URL (如果之前是通过上传设置的)
                if (movableImg.dataset.lastUploadUrl) {
                    URL.revokeObjectURL(movableImg.dataset.lastUploadUrl);
                }

                // 设置新图片源
                movableImg.src = url;
                movableImg.dataset.lastUploadUrl = url;

                // 如果图片已缓存，可能不会触发load，手动检查
                if (movableImg.complete) {
                    onImageLoad();
                } else {
                    movableImg.addEventListener('load', onImageLoad, { once: true });
                }
                movableImg.onerror = function() {
                    alert('图片加载失败，请重试。');
                };

                // 清空input，允许再次选择同一文件
                fileInput.value = '';
				
				movableImg.style.display = "block";
            });

            // ---------- 容器尺寸更新 (resize) ----------
            function updateContainerSize() {
                const rect = container.getBoundingClientRect();
                containerWidth = rect.width;
                containerHeight = rect.height;
                centerImage();
            }
            setTimeout(() => {
                updateContainerSize();
            }, 10);
            window.addEventListener('resize', updateContainerSize);

            // ---------- 滚轮缩放 ----------
            container.addEventListener('wheel', (e) => {
                e.preventDefault();

                const rect = container.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                const newScale = Math.min(Math.max(scale * delta, 0.2), 8);

                // 保持鼠标指向的图片点不变
                const newTranslateX = mouseX - (mouseX - translateX) * (newScale / scale);
                const newTranslateY = mouseY - (mouseY - translateY) * (newScale / scale);

                scale = newScale;
                translateX = newTranslateX;
                translateY = newTranslateY;

                updateTransform();
            }, { passive: false });

            // ---------- 指针事件：拖拽 + 点击上传 ----------
            function pointerDownHandler(e) {
                if (e.type === 'mousedown' && e.button !== 0) return;
                e.preventDefault();

                const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

                const rect = container.getBoundingClientRect();
                startPointerX = clientX - rect.left;
                startPointerY = clientY - rect.top;
                startTranslateX = translateX;
                startTranslateY = translateY;
                dragThresholdPassed = false;   // 重置移动标记

                // 双指触摸：初始化pinch，不进入单指拖拽
                if (e.type === 'touchstart' && e.touches.length === 2) {
                    const touch1 = e.touches[0];
                    const touch2 = e.touches[1];
                    const dx = touch2.clientX - touch1.clientX;
                    const dy = touch2.clientY - touch1.clientY;
                    pinchDistance = Math.hypot(dx, dy);
                    pinchScale = scale;
                    return;
                }

                isDragging = true;

                if (e.type === 'mousedown') {
                    window.addEventListener('mousemove', pointerMoveHandler);
                    window.addEventListener('mouseup', pointerUpHandler);
                } else if (e.type === 'touchstart' && e.touches.length === 1) {
                    window.addEventListener('touchmove', pointerMoveHandler, { passive: false });
                    window.addEventListener('touchend', pointerUpHandler);
                    window.addEventListener('touchcancel', pointerUpHandler);
                }
            }

            function pointerMoveHandler(e) {
                e.preventDefault();

                // 双指缩放处理
                if (e.type === 'touchmove' && e.touches.length === 2) {
                    const rect = container.getBoundingClientRect();
                    const touch1 = e.touches[0];
                    const touch2 = e.touches[1];

                    const dx = touch2.clientX - touch1.clientX;
                    const dy = touch2.clientY - touch1.clientY;
                    const newDistance = Math.hypot(dx, dy);

                    if (pinchDistance > 0) {
                        const factor = newDistance / pinchDistance;
                        let newScale = pinchScale * factor;
                        newScale = Math.min(Math.max(newScale, 0.2), 8);

                        const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
                        const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

                        const newTranslateX = centerX - (centerX - translateX) * (newScale / scale);
                        const newTranslateY = centerY - (centerY - translateY) * (newScale / scale);

                        scale = newScale;
                        translateX = newTranslateX;
                        translateY = newTranslateY;

                        updateTransform();

                        pinchDistance = newDistance;
                        pinchScale = scale;
                        dragThresholdPassed = true;  // 缩放动作视为已移动，避免触发点击
                    }
                    return;
                }

                if (!isDragging) return;

                const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

                const rect = container.getBoundingClientRect();
                const currentX = clientX - rect.left;
                const currentY = clientY - rect.top;

                // 计算从起始点移动的距离
                const dx = currentX - startPointerX;
                const dy = currentY - startPointerY;
                if (Math.hypot(dx, dy) > CLICK_THRESHOLD) {
                    dragThresholdPassed = true;
                }

                // 屏幕位移直接映射到图片位移 (不除scale，保证跟手)
                translateX = startTranslateX + dx;
                translateY = startTranslateY + dy;

                updateTransform();
            }

            function pointerUpHandler(e) {
                // 如果是触摸结束且还有手指（例如两指抬起一指），我们保持isDragging为false，但可能需要清理
                // 简单处理：如果是触摸结束且touches长度不为0，不重置拖拽标志？为了逻辑清晰，直接重置所有
                const isTouchEnd = e.type === 'touchend' || e.type === 'touchcancel';
                const anyTouchLeft = isTouchEnd && e.touches && e.touches.length > 0;

                // 如果还有触摸点，不重置拖拽状态 (例如双指缩放后抬起一指，仍可继续单指拖动)
                if (anyTouchLeft) {
                    // 但我们需要更新pinch状态，并且如果只剩一指，重新初始化拖拽？为了简化，直接结束所有监听，用户需重新触摸。
                    // 更严谨的做法是重新初始化，但为了代码清晰，我们直接结束，用户再触摸即可。
                }

                // 判断是否为有效的点击 (没有移动过，且不是双指操作)
                if (!dragThresholdPassed && pinchDistance === 0) {
                    // 触发文件选择
                    fileInput.click();
                }

                isDragging = false;
                pinchDistance = 0;

                window.removeEventListener('mousemove', pointerMoveHandler);
                window.removeEventListener('mouseup', pointerUpHandler);
                window.removeEventListener('touchmove', pointerMoveHandler);
                window.removeEventListener('touchend', pointerUpHandler);
                window.removeEventListener('touchcancel', pointerUpHandler);
            }

            container.addEventListener('mousedown', pointerDownHandler);
            container.addEventListener('touchstart', pointerDownHandler, { passive: false });

            // 防止鼠标在容器外释放
            window.addEventListener('mouseleave', (e) => {
                if (isDragging) {
                    isDragging = false;
                    pinchDistance = 0;
                    window.removeEventListener('mousemove', pointerMoveHandler);
                    window.removeEventListener('mouseup', pointerUpHandler);
                }
            });
			
});