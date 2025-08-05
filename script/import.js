// 获取DOM元素
        const import_modal = document.getElementById('import-modal');
        const closeBtn = document.getElementById('closeBtn');
        const cancelBtn = document.getElementById('cancelBtn');
		const importInput = document.getElementById('importInput');
        
        // 关闭模态框
        function closeModal() {
			importInput.value = "";
            exim_modal.style.display = 'none';
        }
		
		
        function onImportClicked() {
            exim_modal.style.display = 'block';
			import_modal.style.display = 'block';
			export_modal.style.display = 'none';
        }
        
        // 点击关闭按钮
        closeBtn.addEventListener('click', closeModal);
        
        // 点击取消按钮
        cancelBtn.addEventListener('click', closeModal);
        
        // 点击模态框外部关闭
        window.addEventListener('click', function(event) {
            if (event.target === exim_modal) {
                closeModal();
            }
        });
        
        // 确认按钮逻辑
        document.getElementById('confirmBtn').addEventListener('click', function() {
            var inputValue = importInput.value;
            cCards = {};
			try
			{
				if (inputValue.includes("%%"))
				{
					inputValue = inputValue.slice(inputValue.search("%%"));
					var inputValue_spiltbyone = inputValue.split("",4);
					let main_regex = /^[1-5]+$/;
					if (!main_regex.test(inputValue_spiltbyone[2]))
					{
						throw new Error("错误的主国");
					}
					let ally_regex = /^[1-9]+$/;
					if (!ally_regex.test(inputValue_spiltbyone[3]))
					{
						throw new Error("错误的盟国");
					}
					const inputValue_importCodes = inputValue.split("|")[1];
					var inputValue_cCardsCode = (inputValue_importCodes.slice(0, inputValue_importCodes.search(/[^a-zA-Z0-9;]/)) + ";").split("");
					var inputValue_cCards = [];
					var cCard_str = "";
					var Card_count = 0;
					var Cards_count = 0;
						inputValue_cCardsCode.forEach((c) => {
							if (c === ';')
							{
								Card_count++;
								inputValue_cCards.forEach((cCard_impcode) => {
									allCards.forEach((card) => {
										if (card.importId === cCard_impcode)
										{
											if (cCards[JSON.stringify(card)] === undefined)
											{
												cCards[JSON.stringify(card)] = Card_count;
											}
											else
											{
												cCards[JSON.stringify(card)] += Card_count;
											}
											Cards_count += Card_count;
										}
									});
								});
								inputValue_cCards = [];
							}
							else
							{
								if (cCard_str.length === 1)
								{
									cCard_str += c;
									inputValue_cCards.push(cCard_str);
									cCard_str = "";
								}
								else
								{
									cCard_str += c;
								}
							}
						});
					Main.value = inputValue_spiltbyone[2];
					Ally.value = inputValue_spiltbyone[3];
					if (!checkDeck())
					{
						cCards = JSON.parse(JSON.stringify(old_cCards));
						Main.value = "0";
						Ally.value = "0";
						return;
					}
					onMainChanged(Main.value);
					onAllyChanged(Ally.value);
					count = Cards_count;
				}
				else
				{
					throw new Error("卡组码需以 %% 开头");
				}
			}
			catch (e)
			{
				showTemporaryMessage("导入卡组失败：卡组导入码错误。" + e.message,"error");
				throw e;
			}
			old_cCards = JSON.parse(JSON.stringify(cCards));
			loadDeck();
			showTemporaryMessage("卡组导入成功");
            closeModal();
        });