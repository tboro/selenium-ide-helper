import('http://localhost:3030/html2canvas.js');

export const addTextToBody = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  document.body.appendChild(div);
};

export const report = (text) => {
  alert(text);
  request();
};

export const request = () => {
  html2canvas(document.body).then(function(canvas) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3030/testRailClient', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = xhr.responseText;
        var obj = JSON.parse(response);
        console.log(obj);
      }
    }

    // Export the canvas to its data URI representation
    var base64url = canvas.toDataURL('image/jpeg'); //.replace('image/jpeg', 'image/octet-stream');

    var data = JSON.stringify({
      capture: base64url,
      test: 'SIDE1',
      run_id: 1
    });
    xhr.send(data);
  });
};