import React, { useState } from 'react';

export default function Test() {
  const [text, setText] = useState('Hello');
  const [position, setPosition] = useState(1);

  const handleMouse = () => {
    const a = window.getSelection().toString();
    setText(a);

    const range = window.getSelection().getRangeAt(0);
    // const position1 = range.getBoundingClientRect();
    // setPosition(position1);
    console.log(range.getBoundingClientRect());
  };

  return (
    <div>
      <div onMouseUp={handleMouse}>
        U22 Việt Nam đã có lúc tưởng chừng như bị loại khỏi SEA Games 2019 khi
        để cho Thái Lan dẫn trước 2-0 chỉ trong vòng từ phút thứ 5 đến 11. Tuy
        nhiên sau đó, cú đúp của Tiến Linh ở các phút 16 và 71 đã giúp Việt Nam
        có trận hoà 2-2 đầy quan trọng trước Thái Lan. Sau kết quả ấy, Thái Lan
        đã phải về nước và chứng kiến Việt Nam giành huy chương Vàng chung cuộc.
      </div>
      <p>{text}</p>
      <p>{position}</p>
    </div>
  );
}
