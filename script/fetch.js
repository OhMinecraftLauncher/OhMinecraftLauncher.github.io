async function fetchWithProgress(url) {
	const r = await fetch(url, {
		method: 'HEAD',
	  headers: {
		'Accept-Encoding': 'identity' // 明确请求不压缩
	  }
	});
  const contentLength = r.headers.get('Content-Length');
  // 现在 Content-Length 应该是解压后的大小

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  //const contentLength = response.headers.get('Content-Length');
  const reader = response.body.getReader();
  let receivedLength = 0;
  let chunks = [];
  
  // 更新进度条
  function updateProgress(loaded, total) {
    const percent = total ? Math.round((loaded / total) * 100) : 0;
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('loading-text').textContent = 
      `正在加载 Cards.json ... ${percent}% (${(loaded/1024/1024).toFixed(2)}MB/${(total/1024/1024).toFixed(2)}MB)`;
  }
  
  // 读取数据流
  while(true) {
    const {done, value} = await reader.read();
    
    if (done) break;
    
    chunks.push(value);
    receivedLength += value.length;
    updateProgress(receivedLength, contentLength);
  }
  
  // 合并所有chunks
  let chunksAll = new Uint8Array(receivedLength);
  let position = 0;
  for(let chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }
  
  // 转换为文本
  const result = new TextDecoder("utf-8").decode(chunksAll);
  return JSON.parse(result);
}