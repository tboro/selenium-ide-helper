import('http://localhost:3030/html2canvas.js');

export const info = (text) => {
  alert(text);
};

export const toElement = (selector, silent = false) => {
  const element = document.querySelector(selector)
  if(!silent && !element) {
    info('Cannot find any elements by selector: ' + selector);
  }
  
  return element;
};
export { toElement as te };

export const fireMouseEvent = (element, eventType, clientX, clientY) => {
  const mouseEvent = new MouseEvent(eventType, {
    view: window,
    bubbles: !0,
    cancelable: !0,
    clientX,
    clientY
  });
  element.dispatchEvent(mouseEvent);
};
export { fireMouseEvent as fme };

export const clickAtPosition = (element, clientX, clientY) => {
  fireMouseEvent(element, "mousedown", clientX, clientY);
  fireMouseEvent(element, "mouseup", clientX, clientY);
};
export { clickAtPosition as cap };

export const report = (runId, testRefs, reportData = { status_id: 1 }, captureSelector = '') => {
  if(!captureSelector) {
    localRequest(runId, testRefs, reportData);
  } else {
    const captureNode = toElement(captureSelector);
    html2canvas(captureNode, {
      useCORS: true
    }).then(canvas => {
      const dataUri = canvas.toDataURL('image/jpeg');
      localRequest(runId, testRefs, reportData, dataUri);
    });
  }
};
export { report as r };

const localRequest = (runId, testRefs, reportData = { status_id: 1 }, dataUri = '') => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3030/testRailClient', true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      if(response.error) {
        info(response.error);
      }
    }
  };
  const requestData = JSON.stringify({
    runId,
    testRefs,
    reportData,
    dataUri
  });
  xhr.send(requestData);
};